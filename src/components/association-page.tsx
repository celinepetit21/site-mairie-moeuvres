import Link from 'next/link';
import {Users,Phone,CalendarDays,Newspaper,Mail,ExternalLink} from 'lucide-react';
import {type Content} from '@/lib/types';
import {associationLogos} from '@/lib/association-data';
import {LinkedText} from './linked-text';
import {AssociationResources} from './association-links';
import {AssociationProposalForm} from './association-proposal-form';
import {ShareActions} from './share-actions';
import './association-page.css';
export function AssociationPage({item,photo,document}:{item:Content;photo?:string;document?:{id:string;titre:string}}){
 const logo=photo||associationLogos[item.id];
 const blocks=item.contenu.split(/\n\s*\n/).filter(Boolean);const bureau:string[]=[];const contact:string[]=[];const presentation:string[]=[];
 for(const b of blocks){const lines=b.split('\n');const roles=lines.filter(l=>/^(président|présidente|vice-président|vice-présidente|trésorier|trésorière|secrétaire)/i.test(l.trim()));if(roles.length){bureau.push(...roles);presentation.push(...lines.filter(l=>!roles.includes(l)&&l.trim()));}else if(/^contact\b/i.test(b.trim())||/^(téléphone|e-mail|adresse)\s*:/im.test(b))contact.push(b);else presentation.push(b);}
 const missing=!contact.length||!item.association_evenements?.length||!item.association_actualites?.length;
 return <main id="main" className="container public-page association-page"><Link href="/associations" className="back-link">← Associations du village</Link>
 <header className="assoc-hero">{logo&&<div className="assoc-logo"><img src={logo} alt={'Logo de '+item.titre}/></div>}<div><p className="eyebrow">LA VIE ASSOCIATIVE</p><h1>{item.titre}</h1>{item.resume&&<p className="article-intro">{item.resume}</p>}</div></header>
 <nav className="assoc-section-nav" aria-label="Accès aux rubriques"><a href="#calendrier"><CalendarDays size={17}/>Manifestations</a><a href="#actualites"><Newspaper size={17}/>Actualités</a><a href="#contact-association"><Phone size={17}/>Contact</a></nav>
 <div className="assoc-sections"><section className="assoc-panel"><h2>À propos de l’association</h2>{presentation.length?presentation.map((b,i)=><p className="preserve" key={i}><LinkedText text={b}/></p>):<p className="muted">Présentation à compléter.</p>}</section>
 <aside className="assoc-panel assoc-contact" id="contact-association"><h2><Phone size={22}/>Contact</h2>{contact.length?contact.map((b,i)=><p className="preserve" key={i}><LinkedText text={b.replace(/^Contact\s*\n/i,'')}/></p>):<p className="muted">Les coordonnées de cette association ne sont pas encore renseignées.</p>}<a href="#proposer-fiche" className="text-link"><Mail size={16}/>Proposer ou corriger les coordonnées</a></aside></div>
 {bureau.length>0&&<section className="assoc-panel"><h2><Users size={24}/>Le bureau</h2><div className="assoc-bureau">{bureau.map((line,i)=>{const col=line.indexOf(':');return <article key={i} className={'assoc-person assoc-person-'+i%3}><p>{col>=0?line.slice(0,col):'Membre du bureau'}</p><h3>{col>=0?line.slice(col+1).trim():line}</h3></article>})}</div></section>}
 <AssociationResources id={item.id} content={item}/>
 {document&&<section className="assoc-panel"><h2>Document de l’association</h2><a href={'/fichiers/documents/'+document.id} target="_blank" rel="noopener noreferrer" className="button">{document.titre}<ExternalLink size={16}/></a></section>}
 <AssociationProposalForm associationId={item.id} associationName={item.titre} emphasis={missing}/>
 <ShareActions title={item.titre}/></main>;
}
