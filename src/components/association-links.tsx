import {CalendarDays,Newspaper,ExternalLink} from 'lucide-react';
import {associationLinks} from '@/lib/association-links';
import {type Content} from '@/lib/types';
import {publicAssets} from '@/lib/data';
import {AssociationCalendar} from './association-calendar';
export async function AssociationResources({id,content}:{id:string;content?:Content}){
 const defaults=associationLinks[id];const facebook=content?.facebook_url||defaults?.facebook;const helloasso=content?.helloasso_url||defaults?.helloasso;
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const events=(content?.association_evenements?.length?content.association_evenements:(defaults?.events??[])).slice().sort((a,b)=>a.date.localeCompare(b.date));
 const next=events.filter(e=>e.date>=today);
 const news=(content?.association_actualites??[]).slice().sort((a,b)=>b.date.localeCompare(a.date));
 const photos=next.some(e=>'photo_id' in e&&e.photo_id)?await publicAssets('photos'):[];
 return <>
 <section className="assoc-panel" id="calendrier"><h2><CalendarDays size={23}/>Calendrier des manifestations</h2><p className="muted">Les événements publiés par l’association, mois par mois.</p><AssociationCalendar events={events}/></section>
 <section className="assoc-panel" id="association-manifestations"><h2>Prochaines manifestations</h2>{next.length?<div className="assoc-events">{next.map((e,i)=>{const photo='photo_id' in e&&photos.find(p=>p.id===e.photo_id);return <article className="assoc-event" key={i}>{photo&&<a className="assoc-poster" href={'/fichiers/photos/'+photo.id} target="_blank" rel="noopener noreferrer"><img src={'/fichiers/photos/'+photo.id} alt={'Affiche : '+e.title}/></a>}<div className="assoc-event-body"><p className="eyebrow">{new Date(e.date+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}</p><h3>{e.title}</h3>{e.label&&<p>{e.label}</p>}{e.url&&<a className="text-link" href={e.url} target="_blank" rel="noopener noreferrer">Voir l’annonce <ExternalLink size={15}/></a>}</div></article>})}</div>:<p className="muted">Aucune manifestation annoncée pour le moment.</p>}</section>
 <section className="assoc-panel" id="actualites"><h2><Newspaper size={23}/>Actualités de l’association</h2>{news.length?<div className="assoc-news-grid">{news.map((n,i)=><article className="assoc-news-item" key={i}><p className="eyebrow">{new Date(n.date+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}</p><h3>{n.title}</h3>{n.description&&<p>{n.description}</p>}{n.url&&<a href={n.url} className="text-link" target="_blank" rel="noopener noreferrer">En savoir plus <ExternalLink size={15}/></a>}</article>)}</div>:<p className="muted">Aucune actualité publiée pour le moment.</p>}</section>
 {(facebook||helloasso)&&<section className="assoc-panel"><h2>Suivre l’association</h2><div className="button-row">{facebook&&<a className="button secondary" target="_blank" rel="noopener noreferrer" href={facebook}>Facebook <ExternalLink size={16}/></a>}{helloasso&&<a className="button secondary" target="_blank" rel="noopener noreferrer" href={helloasso}>HelloAsso <ExternalLink size={16}/></a>}</div></section>}
 </>;
}
