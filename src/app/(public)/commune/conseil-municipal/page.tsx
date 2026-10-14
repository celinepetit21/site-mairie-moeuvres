import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { mayor, deputies, councillors, type CouncilMember } from '@/lib/council';
export const metadata = { title: 'Le conseil municipal — Mœuvres', description: 'Le maire, les adjoints et le conseil municipal de Mœuvres.' };
function Portrait({member}:{member:CouncilMember}) {
 return member.photo ? <img className="council-avatar" src={member.photo} alt={member.name} style={{objectFit:'cover'}}/> : <span className="council-avatar" aria-hidden="true">{member.name.split(' ').map(part=>part[0]).join('')}</span>;
}
function Members({members}:{members:CouncilMember[]}) {
 return <div className="council-grid">{members.map(member=><article className="council-card" key={member.name}><Portrait member={member}/><h3>{member.name}</h3><p className="council-role">{member.role}</p></article>)}</div>;
}
export default function CouncilPage() {
 return <main id="main" className="container public-page"><Link href="/commune" className="back-link"><ArrowLeft size={16}/>La commune</Link><p className="eyebrow">LA VIE MUNICIPALE</p><h1>Votre conseil municipal</h1><p className="article-intro council-intro">Une équipe au service de Mœuvres et de ses habitants. Retrouvez les membres du conseil municipal et leurs fonctions.</p><section className="council-section" aria-label="Le maire"><article className="council-card council-mayor"><Portrait member={mayor}/><div><p className="eyebrow">LE MAIRE</p><h2>{mayor.name}</h2><p className="council-role">{mayor.role} de Mœuvres</p></div></article></section><section className="council-section" aria-labelledby="adjoints"><h2 id="adjoints">Les adjoints au maire</h2><Members members={deputies}/></section><section className="council-section" aria-labelledby="conseillers"><h2 id="conseillers">Les conseillers municipaux</h2><Members members={councillors}/></section><aside className="council-contact"><h3>Contacter votre équipe municipale</h3><p>Pour toute question ou demande de rendez-vous, contactez la mairie.</p><Link href="/contact" className="text-link">Les coordonnées de la mairie <ArrowRight size={16}/></Link></aside></main>;
}
