import { CalendarDays, ExternalLink } from 'lucide-react';
import { associationLinks } from '@/lib/association-links';
export function AssociationResources({id}:{id:string}){
 const item=associationLinks[id];if(!item)return null;
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const events=item.events?.filter(e=>e.date>=today)??[];
 return <section className="attachment" aria-label="Liens et événements de l’association"><h2>Suivre l’association</h2><div className="button-row">{item.facebook&&<a className="button" href={item.facebook} target="_blank" rel="noopener noreferrer">Facebook <ExternalLink size={16}/></a>}{item.helloasso&&<a className="button secondary" href={item.helloasso} target="_blank" rel="noopener noreferrer">HelloAsso <ExternalLink size={16}/></a>}</div>{events.length>0&&<div style={{marginTop:30}}><h2>Prochains événements</h2>{events.map(e=><article className="event-row" key={e.title}><CalendarDays size={22}/><div><h3>{e.title}</h3><p>{e.label}</p>{e.url&&<a className="text-link" href={e.url} target="_blank" rel="noopener noreferrer">Voir l’annonce et les modalités <ExternalLink size={14}/></a>}</div></article>)}</div>}</section>;
}
