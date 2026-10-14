import Link from 'next/link';
import { Camera,CalendarDays } from 'lucide-react';
import { HallPrices } from '@/components/hall-prices';
import { HallEnquiry } from '@/components/hall-enquiry';
import { HallCalendar } from '@/components/hall-calendar';
import { published,publicAssets } from '@/lib/data';
import './hall.css';
export const metadata={title:'Louer la salle des fêtes — Mœuvres',description:'Découvrez la salle des fêtes de Mœuvres et consultez ses disponibilités.'};
export default async function HallPage(){
 const [pages,photos]=await Promise.all([published('pages',1000),publicAssets('photos')]);const page=pages.find(p=>p.id==='a5500000-0000-4000-8000-000000000011');
 const gallery=photos.filter(p=>p.titre.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().startsWith('salle des fetes'));
 return <main id="main" className="container public-page hall-page"><p className="eyebrow">VOS ÉVÉNEMENTS À MŒUVRES</p><h1>{page?.titre||'La salle des fêtes de Mœuvres'}</h1><p className="article-intro">{page?.resume||'Un lieu pour vos fêtes, rencontres et événements.'}</p><div className="hall-intro"><section className="hall-panel"><h2>Un lieu pour se retrouver</h2><p className="preserve">{page?.contenu||'Pour connaître les tarifs, les équipements et les conditions de location, contactez la mairie.'}</p><Link className="button" href="#demande-renseignements">Demander des renseignements</Link></section><div className="hall-photo-intro">{gallery[0]?<img src={`/fichiers/photos/${gallery[0].id}`} alt={gallery[0].titre}/>:<><Camera size={44}/><h2>Découvrez la salle</h2><p>Les photos seront ajoutées prochainement.</p></>}</div></div>{gallery.length>0&&<section className="hall-panel"><h2>La salle en images</h2><div className="gallery-grid">{gallery.map(p=><figure key={p.id}><a href={`/fichiers/photos/${p.id}`} target="_blank" rel="noopener noreferrer"><img src={`/fichiers/photos/${p.id}`} alt={p.titre} style={{objectFit:'contain'}}/></a><figcaption>{p.titre.replace(/^Salle des fêtes\s*[—:-]?\s*/i,'')}</figcaption></figure>)}</div></section>}<HallPrices/><HallCalendar/><HallEnquiry julie={validEmail(process.env.SALLE_CONTACT_JULIE_EMAIL)} rudy={validEmail(process.env.SALLE_CONTACT_RUDY_EMAIL)}/><aside className="hall-panel"><h2><CalendarDays size={24}/>Préparer votre location</h2><p>Consultez les tarifs ci-dessus et contactez les cogestionnaires pour préparer votre dossier et confirmer les conditions de location.</p><Link href="/contact" className="text-link">Voir les coordonnées et les horaires de la mairie →</Link></aside></main>;
}

function validEmail(value:string|undefined){const text=value?.trim()??'';return /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(text)?text:'';}
