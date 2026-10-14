import Link from 'next/link';
import { AssociationPage } from '@/components/association-page';
import { AssociationResources } from '@/components/association-links';
import { LinkedText } from '@/components/linked-text';
import { notFound } from 'next/navigation';
import { publicClient } from '@/lib/supabase/server';
import { isSection,sections,pageCategories,type Content } from '@/lib/types';
import { uuid } from '@/lib/validation';
import { dateLabel,publicAssets } from '@/lib/data';
import { ShareActions } from '@/components/share-actions';
import { cache } from 'react';
const getItem=cache(async(section:string,id:string)=>{
 if(!isSection(section)||!uuid.safeParse(id).success)notFound();
 const client=publicClient();if(!client)notFound();
 const {data,error}=await client.from(sections[section].table).select('*').eq('id',id).eq('statut','publie').lte('published_at',new Date().toISOString()).maybeSingle();
 if(error)throw new Error('Ce contenu est momentanément indisponible.');if(!data)notFound();return data as Content;
});
export async function generateMetadata({params}:{params:Promise<{section:string;id:string}>}){
 const {section,id}=await params;const item=await getItem(section,id);return {title:item.titre,description:item.resume||item.contenu.slice(0,160)};
}
export default async function PublicDetail({params}:{params:Promise<{section:string;id:string}>}){
 const {section,id}=await params;const item=await getItem(section,id);
 const [photos,documents]=await Promise.all([item.photo_id?publicAssets('photos'):Promise.resolve([]),item.document_id?publicAssets('documents'):Promise.resolve([])]);
 const photo=photos.find(p=>p.id===item.photo_id);const document=documents.find(d=>d.id===item.document_id);
 if(section==='pages'&&item.categorie==='associations')return <AssociationPage item={item} photo={photo?`/fichiers/photos/${photo.id}`:undefined} document={document}/>;
 const back=section==='pages'?`/${item.categorie??'commune'}`:`/${section}`;
 const label=section==='pages'?pageCategories[item.categorie??'commune']:sections[section as keyof typeof sections].title;
 return <main id="main" className="container public-page article"><Link href={back} className="back-link">← {label}</Link><p className="eyebrow">{dateLabel(item.published_at)}</p><h1>{item.titre}</h1>{item.resume&&<p className="article-intro">{item.resume}</p>}{photo&&<figure className="article-photo"><img src={`/fichiers/photos/${photo.id}`} alt={photo.titre}/></figure>}{section==='evenements'&&<div className="info-band"><div><strong>{dateLabel(item.date_debut)}</strong>{item.date_fin&&<p>Fin : {dateLabel(item.date_fin)}</p>}{item.lieu&&<p>{item.lieu}</p>}<Link href={`/calendrier/${item.id}`} className="button secondary">Ajouter à mon calendrier</Link></div></div>}<div className="article-body preserve">{section==='pages'&&item.categorie==='associations'?<LinkedText text={item.contenu}/>:item.contenu}</div>{section==='pages'&&item.categorie==='associations'&&<AssociationResources id={item.id}/>}{document&&<div className="attachment"><h2>Document associé</h2><a className="button" href={`/fichiers/documents/${document.id}`} target="_blank" rel="noopener">Ouvrir le PDF : {document.titre}</a></div>}<ShareActions title={item.titre}/></main>;
}
