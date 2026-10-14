import { CalendarDays, ExternalLink } from 'lucide-react';
import { associationLinks } from '@/lib/association-links';
import { type Content } from '@/lib/types';
import { publicAssets } from '@/lib/data';
export async function AssociationResources({id,content}:{id:string;content?:Content}){
 const defaults=associationLinks[id];const facebook=content?.facebook_url??defaults?.facebook;const helloasso=content?.helloasso_url??defaults?.helloasso;
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const events=(content?.association_evenements??defaults?.events??[]).filter(e=>e.date>=today).sort((a,b)=>a.date.localeCompare(b.date));
 const photos=events.some(e=>'photo_id' in e&&e.photo_id)?await publicAssets('photos'):[];
 if(!facebook&&!helloasso&&!events.length)return null;
 return <>{(facebook||helloasso)&&<section className="assoc-panel"><h2>Suivre l’association</h2><div className="button-row">{facebook&&<a className="button" href={facebook} target="_blank" rel="noopener noreferrer">Facebook <ExternalLink size={16}/></a>}{helloasso&&<a className="button secondary" href={helloasso} target="_blank" rel="noopener noreferrer">HelloAsso <ExternalLink size={16}/></a>}</div></section>}{events.length>0&&<section className="assoc-panel"><h2>Prochains événements</h2><div className="assoc-events">{events.map((e,i)=>{const photo='photo_id' in e&&photos.find(p=>p.id===e.photo_id);return <article className="assoc-event" key={i}>{photo?<a className="assoc-poster" href={`/fichiers/photos/${photo.id}`} target="_blank" rel="noopener noreferrer" aria-label={`Agrandir l’affiche : ${e.title}`}><img src={`/fichiers/photos/${photo.id}`} alt={`Affiche : ${e.title}`}/><span>Agrandir l’affiche ↗</span></a>:<div className="assoc-poster-placeholder" aria-hidden="true"><CalendarDays size={42}/></div>}<div className="assoc-event-body"><p className="eyebrow">{new Intl.DateTimeFormat('fr-FR',{timeZone:'Europe/Paris',day:'numeric',month:'long',year:'numeric'}).format(new Date(e.date+'T12:00:00Z'))}</p><h3>{e.title}</h3>{e.label&&<p>{e.label}</p>}{e.url&&<a className="text-link" href={e.url} target="_blank" rel="noopener noreferrer">Voir l’annonce et les modalités <ExternalLink size={14}/></a>}</div></article>;})}</div></section>}</>;
}
