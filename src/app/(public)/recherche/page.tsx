import Link from 'next/link';
import { Search } from 'lucide-react';
import { published, publicAssets } from '@/lib/data';
import { sections } from '@/lib/types';
import { matchesSearch } from '@/lib/content-tools';
export const metadata={title:'Rechercher'};
export default async function SearchPage({searchParams}:{searchParams:Promise<{q?:string}>}){
 const query=String((await searchParams).q??'').trim().slice(0,100);
 const collections=query.length>=2?await Promise.all(Object.keys(sections).map(async key=>({key,rows:await published(key as keyof typeof sections,1000)}))):[];
 const docs=query.length>=2?await publicAssets('documents'):[];
 const results=collections.flatMap(({key,rows})=>rows.filter(row=>matchesSearch(query,[row.titre,row.resume,row.contenu,row.lieu])).map(row=>({title:row.titre,summary:row.resume,label:String(sections[key as keyof typeof sections].title),href:`/${key}/${row.id}`}))).concat(docs.filter(doc=>matchesSearch(query,[doc.titre])).map(doc=>({title:doc.titre,summary:'Document PDF publié par la mairie',label:'Documents',href:`/fichiers/documents/${doc.id}`})));
 return <main id="main" className="container public-page"><p className="eyebrow">UN RENSEIGNEMENT À TROUVER</p><h1>Rechercher sur le site</h1><form className="search-form" method="get"><label htmlFor="site-search">Votre recherche</label><div><input id="site-search" name="q" type="search" defaultValue={query} minLength={2} maxLength={100} placeholder="Un événement, une démarche…" required/><button className="button"><Search size={18}/>Rechercher</button></div></form>{query.length<2?<p className="muted">Saisissez au moins deux caractères.</p>:<><p role="status">{results.length} résultat{results.length>1?'s':''} pour « {query} »</p><div className="public-list">{results.map(r=><Link className="public-list-card" href={r.href} key={r.href}><div><p className="eyebrow">{r.label}</p><h2>{r.title}</h2><p>{r.summary}</p></div></Link>)}</div>{!results.length&&<div className="empty-state"><h2>Aucun résultat</h2><p>Essayez un autre mot ou contactez la mairie.</p><Link className="text-link" href="/contact">Contacter la mairie</Link></div>}</>}</main>;
}
