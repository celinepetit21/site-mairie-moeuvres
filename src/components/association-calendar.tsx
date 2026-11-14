'use client';
import {useState} from 'react';
import {ChevronLeft,ChevronRight} from 'lucide-react';
type AssociationEvent={title:string;date:string};
const days=['L','M','M','J','V','S','D'];
const iso=(y:number,m:number,d:number)=>[y,String(m+1).padStart(2,'0'),String(d).padStart(2,'0')].join('-');
export function AssociationCalendar({events}:{events:AssociationEvent[]}){
 const now=new Date();const today=iso(now.getFullYear(),now.getMonth(),now.getDate());
 const next=events.slice().sort((a,b)=>a.date.localeCompare(b.date)).find(e=>e.date>=today);
 const initial=next?new Date(next.date+'T12:00:00'):now;
 const [month,setMonth]=useState({y:initial.getFullYear(),m:initial.getMonth()});
 const shift=(n:number)=>setMonth(old=>{const value=new Date(old.y,old.m+n,1);return {y:value.getFullYear(),m:value.getMonth()}});
 const offset=(new Date(month.y,month.m,1).getDay()+6)%7;
 const size=new Date(month.y,month.m+1,0).getDate();
 const cells=Array.from({length:Math.ceil((offset+size)/7)*7},(_,i)=>i-offset+1);
 const monthEvents=events.filter(e=>e.date.startsWith(month.y+'-'+String(month.m+1).padStart(2,'0')+'-')).sort((a,b)=>a.date.localeCompare(b.date));
 return <div className="assoc-calendar"><div className="assoc-calendar-toolbar"><button type="button" aria-label="Mois précédent" onClick={()=>shift(-1)}><ChevronLeft size={20}/></button><strong aria-live="polite">{new Intl.DateTimeFormat('fr-FR',{month:'long',year:'numeric'}).format(new Date(month.y,month.m,1))}</strong><button type="button" aria-label="Mois suivant" onClick={()=>shift(1)}><ChevronRight size={20}/></button></div>
 <div className="assoc-calendar-grid" role="grid" aria-label="Calendrier des manifestations">{days.map((d,i)=><span key={i} className="assoc-calendar-weekday">{d}</span>)}{cells.map((d,i)=>{const valid=d>=1&&d<=size;const date=valid?iso(month.y,month.m,d):'';const matches=events.filter(e=>e.date===date);return <div role="gridcell" key={i} title={matches.map(e=>e.title).join(' · ')} className={'assoc-calendar-day'+(!valid?' outside':'')+(date===today?' today':'')} aria-label={valid?date+(matches.length?' : '+matches.map(e=>e.title).join(', '):''):undefined}>{valid&&(matches.length?<a href="#association-manifestations">{d}<span className="assoc-event-dot" aria-hidden="true"/></a>:<span>{d}</span>)}</div>})}</div>
 <div className="assoc-calendar-month-list">{monthEvents.length?monthEvents.map((e,i)=><p key={i}><strong>{new Date(e.date+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long'})}</strong> — {e.title}</p>):<p className="muted">Aucune manifestation annoncée pour ce mois.</p>}</div></div>;
}
