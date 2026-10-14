import Link from 'next/link';
import { ArrowRight, Landmark, MapPin } from 'lucide-react';
import type { Asset } from '@/lib/types';
export function HomeHero({name,slogan,photo}:{name:string;slogan:string;photo?:Asset}){
 const intro=<><p className="eyebrow light">BIENVENUE CHEZ VOUS</p><h1>{name}<br/><span className="hero-slogan">{slogan}</span></h1><p>La vie de notre commune, les rendez-vous à partager et toutes les informations utiles au quotidien.</p><div className="hero-buttons"><Link className="button white" href="#vie-locale">Découvrir la vie locale <ArrowRight size={17}/></Link><Link className="button hero-contact" href="/contact">Contacter la mairie <ArrowRight size={17}/></Link></div><span className="hero-location"><MapPin size={16}/>Nord · Hauts-de-France</span></>;
 if(photo)return <section className="hero hero-complete-photo"><div className="container hero-split"><div className="hero-copy">{intro}</div><figure className="hero-full-photo"><img src={`/fichiers/photos/${photo.id}`} alt={photo.titre} fetchPriority="high"/><figcaption>Notre mairie, au cœur du village</figcaption></figure></div></section>;
 return <section className="hero"><div className="hero-art"><div className="hero-placeholder"><Landmark size={140} strokeWidth={0.7}/><span>MŒUVRES</span></div></div><div className="hero-shade"/><div className="container hero-content">{intro}</div></section>;
}
