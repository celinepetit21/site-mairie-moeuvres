import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CalendarDays, Megaphone } from 'lucide-react';
import { isSection,sections,pageCategories } from '@/lib/types';
import { published,dateLabel } from '@/lib/data';
import { matchesSearch,eventEnded } from '@/lib/content-tools';
export async function generateMetadata({params}:{params:Promise<{section:string}>}){const {section}=await params;return {title:isSection(section)?sections[section].title:'Rubrique'};}
export default async function PublicList({params,searchParams}:{params:Promise<{section:string}>;searchParams:Promise<{q?:string;periode?:string}>}){
 const {section}=await params;if(!isSection(section))notFound();const filter=await searchParams;
 const query=String(filter.q??'').slice(0,100);const past=filter.periode==='passes';const all=await published(section,1000);
 const rows=all.filter(row=>matchesSearch(query,[row.titre,row.resume,row.contenu,row.lieu])&&(section!=='evenements'||eventEnded(row.date_debut,row.date_fin)===past));
 if(section==='evenements'&&past)rows.reverse();
 return <main id="main" className="container public-page"><p className="eyebrow">LA VIE DE VOTRE COMMUNE</p><h1>{sections[section].title}</h1>{section==='evenements'&&<nav className="filter-tabs" aria-label="Période"><Link href="/evenements" aria-current={!past?'page':undefined}>À venir</Link><Link href="/evenements?periode=passes" aria-current={past?'page':undefined}>Événements passés</Link></nav>}<form className="search-form" method="get"><label htmlFor="list-search">Rechercher dans cette rubrique</label><div><input type="search" name="q" id="list-search" defaultValue={query} maxLength={100}/>{past&&<input type="hidden" name="periode" value="passes"/>}<button className="button">Filtrer</button></div></form><p className="muted">{rows.length} contenu{rows.length>1?'s':''}</p><div className="public-list">{rows.length?rows.map(row=><Link className="public-list-card" key={row.id} href={`/${section}/${row.id}`}><span className="list-icon">{section==='evenements'?<CalendarDays/>:<Megaphone/>}</span><div><p className="eyebrow">{section==='pages'?pageCategories[row.categorie??'commune']:dateLabel(section==='evenements'?row.date_debut:row.published_at)}</p><h2>{row.titre}</h2><p>{row.resume||row.contenu.slice(0,180)}</p>{row.lieu&&<small>{row.lieu}</small>}</div><ArrowRight size={20}/></Link>):<div className="empty-state"><h2>Aucun contenu à afficher</h2><p>{query?'Essayez une autre recherche.':'Les prochaines publications apparaîtront ici.'}</p></div>}</div></main>;
}
