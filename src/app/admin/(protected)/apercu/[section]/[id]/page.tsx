import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { isSection, sections, type Content } from '@/lib/types';
import { uuid } from '@/lib/validation';
import { dateLabel } from '@/lib/data';
export default async function Preview({params}:{params:Promise<{section:string;id:string}>}){
 const {client}=await requireAdmin();const {section,id}=await params;
 if(!isSection(section)||!uuid.safeParse(id).success)notFound();
 const {data,error}=await client.from(sections[section].table).select('*').eq('id',id).maybeSingle();
 if(error)throw new Error('Chargement impossible.');if(!data)notFound();const item=data as Content;
 let photo:string|null=null;
 if(item.photo_id){const {data:asset}=await client.from('mairie_galerie_photos').select('chemin').eq('id',item.photo_id).maybeSingle();if(asset){const {data:signed}=await client.storage.from('mairie-photos').createSignedUrl(asset.chemin,60);photo=signed?.signedUrl??null;}}
 return <><Link className="back-link" href={`/admin/${section}/${id}`}>← Retour à la modification</Link><p className="alert">Aperçu privé — {item.statut==='brouillon'?'ce brouillon n’est pas publié.':'ce contenu est publié.'}</p><article className="editor-card"><h1>{item.titre}</h1>{item.resume&&<p className="article-intro">{item.resume}</p>}{photo&&<figure className="article-photo"><img src={photo} alt="Photographie associée"/></figure>}{section==='evenements'&&<p>{dateLabel(item.date_debut)}{item.lieu&&` · ${item.lieu}`}</p>}<div className="article-body preserve">{item.contenu}</div>{item.document_id&&<p className="muted">Un document PDF est associé à ce contenu.</p>}</article></>;
}
