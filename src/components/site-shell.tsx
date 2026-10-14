import Link from 'next/link';
import { Landmark, Search } from 'lucide-react';
import { PublicNavigation } from './public-navigation';
export function SiteHeader(){return <header className="site-header"><div className="container header-inner"><Link className="brand" href="/" aria-label="Mœuvres, accueil"><span className="brand-icon"><Landmark size={26}/></span><span>Mœuvres<small>COMMUNE DU NORD · 59400</small></span></Link><PublicNavigation/></div></header>}
export function SiteFooter(){return <footer className="site-footer"><div className="container footer-inner"><div><strong>Mœuvres</strong><p>Petit village, grande énergie.</p></div><nav aria-label="Liens de bas de page"><Link href="/informations">Informations municipales</Link><Link href="/recherche"><Search size={14}/> Recherche</Link><Link href="/contact">Contact</Link><Link href="/mentions-legales">Mentions légales</Link><Link href="/admin/connexion">Administration</Link></nav></div></footer>}
