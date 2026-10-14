import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publicClient } from '@/lib/supabase/server';
import { isSection,sections,type Content } from '@/lib/types';
import { uuid } from '@/lib/validation';
import { dateLabel } from '@/lib/data';
export default async function PublicDetail({params}:{params:Promise<{section:string;id:string}>}){
 const {section,id}=await params;if(!isSection(section)||!uuid.safeParse(id).success)notFound();
 const client=publicClient();if(!client)notFound();const {data,error}=await client.from(sections[section].table).select('*').eq('id',id).eq('statut','publie').lte('published_at',new Date().toISOString()).maybeSingle();
 if(error)throw new Error('Ce contenu est momentanément indisponible.');if(!data)notFound();const item=data as Content;
 return <main id="main" className="container public-page article"><Link href={`/${section}`} className="back-link">← {sections[section].title}</Link><p className="eyebrow">{dateLabel(item.published_at)}</p><h1>{item.titre}</h1>{item.resume&&<p className="article-intro">{item.resume}</p>}{section==='evenements'&&<div className="info-band"><div><strong>{dateLabel(item.date_debut)}</strong>{item.date_fin&&<p>Fin : {dateLabel(item.date_fin)}</p>}{item.lieu&&<p>{item.lieu}</p>}</div></div>}<div className="article-body preserve">{item.contenu}</div></main>;
}
