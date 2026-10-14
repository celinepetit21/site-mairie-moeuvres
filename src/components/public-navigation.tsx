"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
const groups=[
 {id:'commune',label:'La commune',links:[['/commune','Découvrir Mœuvres'],['/commune/conseil-municipal','Conseil municipal'],['/informations','Informations municipales'],['/associations','Associations'],['/photos','Galerie photos']]},
 {id:'quotidien',label:'Au quotidien',links:[['/demarches','Vos démarches'],['/vie-pratique','Vie pratique'],['/documents','Documents utiles']]},
];
export function PublicNavigation(){
 const [open,setOpen]=useState(false);const [group,setGroup]=useState<string|null>(null);const path=usePathname();const nav=useRef<HTMLElement>(null);
 const active=(href:string)=>path===href||path.startsWith(href+'/');
 const close=()=>{setOpen(false);setGroup(null);};
 useEffect(()=>{const outside=(event:PointerEvent)=>{if(nav.current&&!nav.current.contains(event.target as Node))setGroup(null);};document.addEventListener('pointerdown',outside);return ()=>document.removeEventListener('pointerdown',outside);},[]);
 function escape(event:React.KeyboardEvent<HTMLElement>){if(event.key==='Escape'){const last=group;setGroup(null);if(last)nav.current?.querySelector<HTMLButtonElement>(`[data-group="${last}"]`)?.focus();else{setOpen(false);document.getElementById('public-menu-toggle')?.focus();}}}
 const link=(href:string,label:string,className?:string)=><Link key={href} href={href} className={className} aria-current={active(href)?'page':undefined} onClick={close}>{label}</Link>;
 const dropdown=(id:string)=>{const item=groups.find(g=>g.id===id)!;return <div className="nav-group" key={id}><button type="button" data-group={id} className={`nav-group-trigger ${item.links.some(([href])=>active(href))?'is-active':''}`} aria-expanded={group===id} aria-controls={`nav-panel-${id}`} onClick={()=>setGroup(group===id?null:id)}>{item.label}<ChevronDown size={14}/></button><div id={`nav-panel-${id}`} className="nav-panel" hidden={group!==id}>{item.links.map(([href,label])=>link(href,label))}</div></div>;};
 return <><button id="public-menu-toggle" type="button" className="menu-toggle" aria-expanded={open} aria-controls="public-navigation" onClick={()=>{setOpen(!open);setGroup(null);}}>{open?<X size={20}/>:<Menu size={20}/>} Menu</button><nav ref={nav} className={`public-navigation ${open?'is-open':''}`} id="public-navigation" aria-label="Navigation principale" onKeyDown={escape} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node))setGroup(null);}}>{dropdown('commune')}{link('/actualites','Actualités')}{link('/evenements','Agenda')}{dropdown('quotidien')}{link('/contact','La mairie','nav-contact')}<Link href="/recherche" className="nav-search" aria-label="Rechercher sur le site" aria-current={active('/recherche')?'page':undefined} onClick={close}><Search size={18}/><span className="search-label">Rechercher</span></Link></nav></>;
}
