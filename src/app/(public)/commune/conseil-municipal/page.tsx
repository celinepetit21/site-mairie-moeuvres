import Link from 'next/link';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, UserRound } from 'lucide-react';
import { type CouncilMember } from '@/lib/council';
import { publicCouncil } from '@/lib/council-data';
import './council.css';
export const metadata={title:'Le conseil municipal — Mœuvres',description:'Le maire, les adjoints et le conseil municipal de Mœuvres.'};
function Portrait({member}:{member:CouncilMember}) {
 return <div className="team-photo">{member.photo?<img src={member.photo} alt={member.name}/>:<span aria-hidden="true">{member.name.split(' ').map(p=>p[0]).join('')}</span>}</div>;
}
function Details({member,hidePresentation=false}:{member:CouncilMember;hidePresentation?:boolean}) {
 return <><div className="team-facts">{member.age!=null&&<p><UserRound size={17}/>{member.age} ans</p>}{member.profession&&<p><BriefcaseBusiness size={17}/>{member.profession}</p>}</div>{!hidePresentation&&member.presentation&&<div className="team-message"><p>{member.presentation}</p></div>}</>;
}
function Members({members}:{members:CouncilMember[]}) {
 return <div className="team-grid">{members.map((m,i)=><article className={`team-card team-accent-${i%3}`} key={m.name}><Portrait member={m}/><div className="team-card-body"><span className="team-role">{m.role}</span><h3>{m.name}</h3><Details member={m}/></div></article>)}</div>;
}
export default async function CouncilPage(){
 const members=await publicCouncil();const mayor=members.find(m=>m.group==='maire');const deputies=members.filter(m=>m.group==='adjoints');const councillors=members.filter(m=>m.group==='conseillers');
 return <main id="main" className="container public-page council-dynamic"><Link href="/commune" className="back-link"><ArrowLeft size={16}/>La commune</Link><header className="team-heading"><p className="eyebrow">LA VIE MUNICIPALE</p><h1>Votre conseil municipal</h1><p className="team-slogan">Petit village, grande énergie</p><p className="article-intro">Des parcours, des idées et une même envie : faire vivre Mœuvres.</p></header>{mayor&&<section aria-label="Le maire" className="team-mayor"><Portrait member={mayor}/><div className="team-mayor-copy"><span className="team-role">{mayor.role} de Mœuvres</span><h2>{mayor.name}</h2><Details member={mayor} hidePresentation/></div>{mayor.presentation&&<div className="team-mayor-message"><p className="team-message-label">Le mot du maire</p><div className="team-mayor-paragraphs">{mayor.presentation.split(/\n\s*\n/).filter(Boolean).map((text,i)=><p key={i}>{text}</p>)}</div></div>}<span className="team-mayor-motif" aria-hidden="true"/></section>}{deputies.length>0&&<section className="team-section" aria-labelledby="adjoints"><h2 id="adjoints">Les adjoints au maire</h2><Members members={deputies}/></section>}{councillors.length>0&&<section className="team-section" aria-labelledby="conseillers"><h2 id="conseillers">Les conseillers municipaux</h2><Members members={councillors}/></section>}<aside className="council-contact"><h3>Contacter votre équipe municipale</h3><p>Pour toute question ou demande de rendez-vous, contactez la mairie.</p><Link href="/contact" className="text-link">Les coordonnées de la mairie <ArrowRight size={16}/></Link></aside></main>;
}
