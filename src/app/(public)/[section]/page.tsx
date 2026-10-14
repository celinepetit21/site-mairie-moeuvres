import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight,CalendarDays,Megaphone } from 'lucide-react';
import { isSection,sections } from '@/lib/types';
import { published,dateLabel } from '@/lib/data';
export default async function PublicList({params}:{params:Promise<{section:string}>}){
 const {section}=await params;if(!isSection(section))notFound();const rows=await published(section);
 return <main id="main" className="container public-page"><p className="eyebrow">LA VIE DE VOTRE COMMUNE</p><h1>{sections[section].title}</h1><div className="public-list">{rows.length?rows.map(row=><Link className="public-list-card" key={row.id} href={`/${section}/${row.id}`}><span className="list-icon">{section==='evenements'?<CalendarDays/>:<Megaphone/>}</span><div><p className="eyebrow">{dateLabel(section==='evenements'?row.date_debut:row.published_at)}</p><h2>{row.titre}</h2><p>{row.resume||row.contenu.slice(0,180)}</p>{row.lieu&&<small>{row.lieu}</small>}</div><ArrowRight size={20}/></Link>):<div className="empty-state"><h2>À suivre prochainement</h2><p>Aucun contenu publié dans cette rubrique pour le moment.</p></div>}</div></main>;
}
