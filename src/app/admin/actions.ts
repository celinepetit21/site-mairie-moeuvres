"use server";
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { serverClient } from '@/lib/supabase/server';
import { supabaseConfig } from '@/lib/supabase/config';
import { sections, isSection, isPageCategory, type AssetKind } from '@/lib/types';
import { contentSchema, uuid, parisToISO, validateDates, detectFile } from '@/lib/validation';
export type ActionState = {error?:string};
export async function login(_state:ActionState,form:FormData):Promise<ActionState> {
 if(!supabaseConfig() || !process.env.ADMIN_USER_ID)return {error:'Renseignez d’abord les variables dans .env.local.'};
 const parsed=z.object({email:z.email(),password:z.string().min(1).max(200)}).safeParse(Object.fromEntries(form));
 if(!parsed.success)return {error:'Vérifiez votre adresse e-mail et votre mot de passe.'};
 const client=await serverClient();
 const {data,error}=await client.auth.signInWithPassword(parsed.data);
 if(error || !data.user)return {error:'Connexion impossible. Vérifiez vos identifiants ou réessayez dans quelques minutes.'};
 const {data:allowed,error:accessError}=await client.rpc('mairie_est_administrateur');
 if(data.user.id!==process.env.ADMIN_USER_ID || accessError || allowed!==true) {
  await client.auth.signOut();return {error:'Ce compte ne dispose pas d’un accès à l’administration.'};
 }
 redirect('/admin');
}
export async function logout() {const client=await serverClient();await client.auth.signOut();redirect('/admin/connexion');}
export async function saveContent(sectionValue:string,id:string|null,_state:ActionState,form:FormData):Promise<ActionState> {
 const {client}=await requireAdmin();
 if(!isSection(sectionValue) || (id && !uuid.safeParse(id).success))return {error:'Demande invalide.'};
 let start:string|null,end:string|null;
 try { start=parisToISO(String(form.get('date_debut')??''));end=parisToISO(String(form.get('date_fin')??'')); }
 catch(e){return {error:e instanceof Error?e.message:'Date invalide.'};}
 const parsed=contentSchema.safeParse({titre:form.get('titre'),resume:form.get('resume'),contenu:form.get('contenu'),statut:form.get('statut'),date_debut:start,date_fin:end,lieu:String(form.get('lieu')??'')});
 if(!parsed.success)return {error:parsed.error.issues[0].message};
 const dateError=validateDates(sectionValue,start,end);if(dateError)return {error:dateError};
 const categorie=String(form.get('categorie')??'commune');
 if(sectionValue==='pages'&&!isPageCategory(categorie))return {error:'Choisissez une rubrique valide.'};
 const references:Record<string,string|null>={};
 for(const [field,table] of [['photo_id','mairie_galerie_photos'],['document_id','mairie_documents']]){
  const value=String(form.get(field)??'');
  if(value&&!uuid.safeParse(value).success)return {error:'Référence de fichier invalide.'};
  if(value){const {data,error}=await client.from(table).select('id').eq('id',value).eq('statut','publie').lte('published_at',new Date().toISOString()).maybeSingle();if(error||!data)return {error:'Le fichier choisi doit être publié.'};}
  references[field]=value||null;
 }
 const {date_debut,date_fin,lieu,...base}=parsed.data;
 let oldPublished:string|null=null;
 if(id){const {data,error}=await client.from(sections[sectionValue].table).select('published_at').eq('id',id).single();if(error)return {error:'Ce contenu est introuvable.'};oldPublished=data.published_at;}
 const payload={...base,published_at:base.statut==='publie'?(oldPublished??new Date().toISOString()):null,...references,...(sectionValue==='pages'?{categorie}:sectionValue==='actualites'?{}:{date_debut,date_fin,lieu})};
 const query=id?client.from(sections[sectionValue].table).update(payload).eq('id',id):client.from(sections[sectionValue].table).insert(payload);
 const {error}=await query.select('id').single();
 if(error)return {error:'Enregistrement impossible. Vérifiez le schéma SQL et vos autorisations.'};
 revalidatePath('/');revalidatePath('/admin');revalidatePath(`/${sectionValue}`);
 redirect(`/admin/${sectionValue}?succes=enregistre`);
}
export async function deleteContent(sectionValue:string,id:string,_state:ActionState,form:FormData):Promise<ActionState> {
 const {client}=await requireAdmin();
 if(!isSection(sectionValue)||!uuid.safeParse(id).success||form.get('confirmation')!=='SUPPRIMER')return {error:'Saisissez SUPPRIMER pour confirmer.'};
 const {error}=await client.from(sections[sectionValue].table).delete().eq('id',id).select('id').single();
 if(error)return {error:'Suppression impossible.'};
 revalidatePath('/');revalidatePath(`/${sectionValue}`);revalidatePath('/admin');
 redirect(`/admin/${sectionValue}?succes=supprime`);
}
export async function uploadAsset(kind:AssetKind,_state:ActionState,form:FormData):Promise<ActionState> {
 const {client,user}=await requireAdmin();
 if(!['documents','photos'].includes(kind))return {error:'Type invalide.'};
 const title=z.string().trim().min(3).max(180).safeParse(form.get('titre'));
 const file=form.get('fichier');
 if(!title.success||!(file instanceof File)||file.size===0)return {error:'Ajoutez un titre et un fichier.'};
 if(file.size>10*1024*1024)return {error:'Le fichier doit faire moins de 10 Mo.'};
 const bytes=new Uint8Array(await file.arrayBuffer());const mime=detectFile(bytes);
 if(!mime || (kind==='documents'?mime!=='application/pdf':!mime.startsWith('image/')))return {error:'Format refusé : PDF pour les documents, JPG/PNG/WebP pour les photos.'};
 const ext:Record<string,string>={'application/pdf':'pdf','image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
 const path=`${user.id}/${crypto.randomUUID()}.${ext[mime]}`;const bucket=`mairie-${kind}`;
 const {error:uploadError}=await client.storage.from(bucket).upload(path,bytes,{contentType:mime,upsert:false});
 if(uploadError)return {error:'Import impossible. Vérifiez les buckets et les politiques Storage.'};
 const {error}=await client.from(kind==='documents'?'mairie_documents':'mairie_galerie_photos').insert({titre:title.data,chemin:path,mime_type:mime,taille:file.size});
 if(error){await client.storage.from(bucket).remove([path]);return {error:'La fiche du fichier n’a pas pu être créée.'};}
 revalidatePath('/admin');redirect(`/admin/medias?type=${kind}&succes=importe`);
}
export async function changeAsset(kind:AssetKind,id:string,_state:ActionState,form:FormData):Promise<ActionState> {
 const {client}=await requireAdmin();
 if(!['documents','photos'].includes(kind)||!uuid.safeParse(id).success)return {error:'Demande invalide.'};
 const parsed=z.object({titre:z.string().trim().min(3).max(180),statut:z.enum(['brouillon','publie'])}).safeParse(Object.fromEntries(form));
 if(!parsed.success)return {error:'Vérifiez le titre et le statut.'};
 const {error}=await client.from(kind==='documents'?'mairie_documents':'mairie_galerie_photos').update({...parsed.data,published_at:parsed.data.statut==='publie'?new Date().toISOString():null}).eq('id',id).select('id').single();
 if(error)return {error:'Modification impossible.'};revalidatePath('/');revalidatePath(`/${kind}`);redirect(`/admin/medias?type=${kind}&succes=enregistre`);
}
export async function deleteAsset(kind:AssetKind,id:string,_state:ActionState,form:FormData):Promise<ActionState> {
 const {client}=await requireAdmin();
 if(!['documents','photos'].includes(kind)||!uuid.safeParse(id).success||form.get('confirmation')!=='SUPPRIMER')return {error:'Saisissez SUPPRIMER pour confirmer.'};
 const table=kind==='documents'?'mairie_documents':'mairie_galerie_photos';
 const {data,error:lookupError}=await client.from(table).select('chemin').eq('id',id).single();
 if(lookupError)return {error:'Fichier introuvable.'};
 // Retire d'abord la publication pour couper les nouveaux liens publics.
 const {error:hideError}=await client.from(table).update({statut:'brouillon',published_at:null}).eq('id',id);
 if(hideError)return {error:'Impossible de retirer la publication.'};
 const {error:storageError}=await client.storage.from(`mairie-${kind}`).remove([data.chemin]);
 if(storageError)return {error:'Le fichier est retiré du public, mais sa suppression a échoué. Réessayez.'};
 const {error}=await client.from(table).delete().eq('id',id).select('id').single();
 if(error)return {error:'Le fichier a été supprimé ; réessayez pour retirer sa fiche.'};
 revalidatePath('/');revalidatePath(`/${kind}`);redirect(`/admin/medias?type=${kind}&succes=supprime`);
}
export async function saveSettings(_state:ActionState,form:FormData):Promise<ActionState> {
 const {client}=await requireAdmin();
 const parsed=z.object({nom_commune:z.string().trim().min(1).max(80),slogan:z.string().trim().min(1).max(160),adresse:z.string().trim().max(300),telephone:z.string().trim().max(30),email:z.union([z.literal(''),z.email()]),horaires:z.string().trim().max(1000),photo_mairie_id:z.union([z.literal(''),uuid])}).safeParse(Object.fromEntries(form));
 if(!parsed.success)return {error:'Vérifiez les coordonnées renseignées.'};
 const photo=parsed.data.photo_mairie_id;
 if(photo){const {data,error}=await client.from('mairie_galerie_photos').select('id').eq('id',photo).eq('statut','publie').single();if(error||!data)return {error:'Choisissez une photo publiée.'};}
 const {error}=await client.from('mairie_parametres_site').update({...parsed.data,photo_mairie_id:photo||null}).eq('id',true).select('id').single();
 if(error)return {error:'Enregistrement impossible.'};revalidatePath('/');redirect('/admin/parametres?succes=enregistre');
}
