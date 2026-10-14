"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
const links=[['/commune','La commune'],['/actualites','Actualités'],['/evenements','Agenda'],['/demarches','Démarches'],['/vie-pratique','Vie pratique'],['/associations','Associations'],['/documents','Documents'],['/photos','Photos'],['/contact','La mairie']];
export function PublicNavigation(){const [open,setOpen]=useState(false);const path=usePathname();return <><button className="menu-toggle" aria-expanded={open} aria-controls="public-navigation" onClick={()=>setOpen(!open)}>{open?<X size={20}/>:<Menu size={20}/>} Menu</button><nav className={`public-navigation ${open?'is-open':''}`} id="public-navigation" aria-label="Navigation principale">{links.map(([href,label])=><Link key={href} href={href} aria-current={path===href||path.startsWith(href+'/')?'page':undefined} onClick={()=>setOpen(false)}>{label}</Link>)}<Link href="/recherche" aria-label="Rechercher sur le site" onClick={()=>setOpen(false)}><Search size={18}/></Link></nav></>}
