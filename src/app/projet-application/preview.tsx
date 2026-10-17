'use client';

import { useState } from 'react';
import {
  ArrowDown, ArrowLeft, ArrowRight, BookOpen, GraduationCap, Building2, CalendarDays, Check,
  ChevronRight, ClipboardList, FileText, HeartHandshake, Landmark,
  LayoutDashboard, LockKeyhole, MapPin, PartyPopper, Settings2,
  ShieldCheck, Sparkles, Users, WalletCards,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Profile = 'administration' | 'gestion' | 'secretariat' | 'consultation';
type Space = 'salle' | 'afc' | 'site';
const profiles: Record<Profile, { label: string; subtitle: string }> = {
  administration: { label: 'Administration', subtitle: 'Une vue d’ensemble de tous vos espaces.' },
  gestion: { label: 'Gestion de la salle', subtitle: 'Les outils utiles pour accompagner chaque location.' },
  secretariat: { label: 'Secrétariat', subtitle: 'Préparer les demandes et suivre les remises.' },
  consultation: { label: 'Consultation', subtitle: 'Consulter le planning et suivre les remises.' },
};
const spaces: { id: Space; title: string; text: string; icon: LucideIcon; color: string }[] = [
  { id: 'salle', title: 'Salle des fêtes', text: 'De la première demande à la restitution des clés.', icon: Building2, color: 'blue' },
  { id: 'afc', title: 'Vie de l’AFC', text: 'Des événements qui rassemblent, une organisation partagée.', icon: PartyPopper, color: 'purple' },
  { id: 'site', title: 'Site de la commune', text: 'Informer les habitants et faire vivre le village.', icon: Landmark, color: 'ochre' },
];
const hallTools = {
  administration: ['Réservations', 'Calendrier', 'États des lieux', 'Factures et remises', 'Cautions', 'Paramètres'],
  gestion: ['Réservations', 'Calendrier', 'États des lieux', 'Factures et remises', 'Cautions', 'Vaisselle et mobilier'],
  secretariat: ['Pré-réservation', 'Disponibilités sans noms', 'Remises au Trésor public'],
  consultation: ['Planning des réservations', 'Remises au Trésor public'],
} satisfies Record<Profile, string[]>;
const afcTools = ['Événements', 'Inscriptions', 'Personnes et familles', 'Finances', 'Bénévoles', 'Matériel'];
const siteTools = ['Actualités', 'Agenda public', 'Conseil municipal', 'Associations', 'Photos et documents', 'Apparence'];
const toolIcons = [ClipboardList, CalendarDays, Users, WalletCards, FileText, Settings2];

export function ApplicationPreview() {
  const [view, setView] = useState<'public' | 'team'>('public');
  const [profile, setProfile] = useState<Profile>('administration');
  const [afcAccess, setAfcAccess] = useState(true);
  const [space, setSpace] = useState<Space>('salle');
  const [selection, setSelection] = useState('');
  const [publicInfo, setPublicInfo] = useState('');
  const availableSpaces = spaces.filter(item => item.id === 'salle' || (item.id === 'afc' ? afcAccess : profile === 'administration'));
  const currentSpace = availableSpaces.find(item => item.id === space) ?? availableSpaces[0];
  const tools = currentSpace.id === 'salle' ? hallTools[profile] : currentSpace.id === 'afc' ? afcTools : siteTools;

  function changeView(next: 'public' | 'team') {
    setView(next); setSelection('');
  }
  function changeProfile(next: Profile) {
    setProfile(next); setSpace('salle'); setSelection('');
  }

  return <div className="unified-preview">
    <a className="unified-skip" href="#application-content">Aller au contenu</a>
    <div className="unified-demo"><Sparkles size={15}/><span>PROJET À DÉCOUVRIR</span><span className="unified-demo-note">Maquette interactive · aucune donnée réelle</span></div>
    <header className="unified-header">
      <button className="unified-brand" onClick={() => changeView('public')} aria-label="Mœuvres, accueil de la maquette"><span className="unified-crest"><Landmark size={26}/></span><span>Mœuvres<small>Commune du Nord · L’Enclave</small></span></button>

      <nav id="unified-nav" aria-label="Navigation de la maquette">
        <button className={view === 'team' ? 'unified-team-link active' : 'unified-team-link'} onClick={() => changeView('team')}><LockKeyhole size={16}/>Espace administration<ArrowRight size={16}/></button>
      </nav>
    </header>

    {view === 'public' ? <main id="application-content" className="unified-public">
      <section className="unified-hero">
        <div className="unified-hero-copy"><p className="unified-kicker"><span/>BIENVENUE CHEZ VOUS</p><h1>Petit village,<br/><em>grande énergie.</em></h1><p className="unified-lead">La vie de Mœuvres, les rendez-vous du village et vos démarches, réunis au même endroit.</p><div className="unified-hero-actions"><a className="unified-primary" href="#village-services">Découvrir les services<ArrowDown size={17}/></a></div></div>
        <div className="unified-hero-image"><img src="/salle-des-fetes/facade.png" alt="La façade en briques de la salle des fêtes de Mœuvres" width={1536} height={1024}/><div className="unified-photo-label"><span className="unified-photo-icon"><HeartHandshake size={22}/></span><span><strong>Un village qui se retrouve</strong><small>La salle des fêtes de Mœuvres</small></span></div><span className="unified-image-sticker" aria-hidden="true"><Sparkles size={28}/></span></div>
      </section>
      <section className="unified-enclave" id="enclave"><div className="unified-enclave-heading"><span className="unified-enclave-symbol"><MapPin size={32}/></span><p className="unified-kicker">TROIS VILLAGES, UN TERRITOIRE SINGULIER</p><h2>Un petit coin du Nord,<br/><em>au cœur du Pas-de-Calais.</em></h2></div><div className="unified-enclave-copy"><p>Mœuvres partage avec Boursies et Doignies une particularité géographique : ces trois communes du Nord sont entourées par le Pas-de-Calais. Ensemble, elles forment l’Enclave.</p><div className="unified-village-pills"><span>Mœuvres</span><span>Boursies</span><span>Doignies</span></div><p>Cette proximité se retrouve dans la vie des familles : les trois villages ont constitué un regroupement pédagogique intercommunal, le RPI de l’Enclave.</p><details><summary>En savoir plus sur l’Enclave</summary><p>Une enclave est un territoire entouré par un autre. Ici, les trois communes restent rattachées au département du Nord, même si leurs voisines immédiates appartiennent au Pas-de-Calais.</p><a href="https://www.pasdecalais.fr/download/file/19433?key=Fd%2FFkAjHi9oornIhx3pe3Q%3D%3D" target="_blank" rel="noopener noreferrer">Lire le reportage de L’Écho du Pas-de-Calais, juillet–août 2019<ArrowRight size={15}/></a></details></div></section>
      <section id="village-services" className="unified-services"><div className="unified-section-heading"><div><p className="unified-kicker">AU QUOTIDIEN</p><h2>De quoi avez-vous besoin ?</h2></div><span className="unified-heading-note">Des accès simples, pour chacun.</span></div><div className="unified-service-grid">
        {[{title:'La commune',text:'Votre mairie, vos élus et les informations pratiques.',icon:Landmark,color:'blue',href:'/commune'},{title:'La salle des fêtes',text:'Découvrir les lieux, consulter les tarifs et les disponibilités.',icon:CalendarDays,color:'coral',href:'/salle-des-fetes'},{title:'La vie associative',text:'Rencontrer les associations qui font bouger le village.',icon:HeartHandshake,color:'purple',href:'/associations'},{title:'Vos démarches',text:'Retrouver les documents et les contacts utiles.',icon:FileText,color:'ochre',href:'/demarches'},{title:'Notre école',text:'Grandir et apprendre avec les trois villages de l’Enclave.',icon:GraduationCap,color:'coral',href:'#notre-ecole'},{title:'Notre bibliothèque',text:'Un lieu de lecture et de découverte, tout près de chez vous.',icon:BookOpen,color:'purple',href:'#notre-bibliotheque'},{title:'L’Enclave',text:'Mœuvres, Boursies et Doignies : une identité singulière.',icon:MapPin,color:'blue',href:'#enclave'}].map(item=><a key={item.href} className={`unified-service ${item.color}`} onClick={event => {if(['#notre-ecole','#notre-bibliotheque'].includes(item.href)){event.preventDefault();setPublicInfo(item.href);}}} href={item.href.startsWith('#') ? item.href : `https://mairie-moeuvres.vercel.app${item.href}`} target={item.href.startsWith('#') ? undefined : '_blank'} rel={item.href.startsWith('#') ? undefined : 'noopener noreferrer'}><span className="unified-service-icon"><item.icon size={25}/></span><h3>{item.title}</h3><p>{item.text}</p><span className="unified-service-bottom">{item.href.startsWith('#') ? 'Découvrir' : 'Voir la page actuelle'}<ArrowRight size={17}/></span></a>)}
      </div>{publicInfo&&<div className="unified-compact-info" id={publicInfo.slice(1)} role="status"><div><h3>{publicInfo==='#notre-ecole'?'Notre école':'Notre bibliothèque'}</h3><p>{publicInfo==='#notre-ecole'?'L’école de Mœuvres participe au regroupement pédagogique intercommunal avec Boursies et Doignies. La mairie vous renseigne sur les inscriptions et les services de l’année scolaire en cours.':'La bibliothèque-ludothèque de Mœuvres est présentée sur le site de Doignies comme située derrière l’école. Renseignez-vous auprès de la mairie pour les horaires et les modalités actuelles.'}</p><a href="https://mairie-moeuvres.vercel.app/contact" target="_blank" rel="noopener noreferrer">Contacter la mairie →</a></div><button onClick={()=>setPublicInfo('')} aria-label="Fermer les informations">×</button></div>}</section>




      <p className="unified-content-source">Informations de présentation : <a href="https://www.doignies.fr/services/jeunesse" target="_blank" rel="noopener noreferrer">site municipal de Doignies</a> et L’Écho du Pas-de-Calais. Horaires et modalités pratiques à confirmer pour la version finale.</p>

    </main> : <main id="application-content" className="unified-team">
      <section className="unified-simulator" aria-label="Réglages de démonstration"><div><span className="unified-demo-dot"/>SIMULER UN ACCÈS<small>Ce sélecteur sert uniquement à comparer les écrans.</small></div><label>Profil salle<select value={profile} onChange={e => changeProfile(e.target.value as Profile)}>{Object.entries(profiles).map(([key,item])=><option key={key} value={key}>{item.label}</option>)}</select></label><label className="unified-afc-toggle"><input type="checkbox" checked={afcAccess} onChange={e => {setAfcAccess(e.target.checked);setSpace('salle');setSelection('');}}/>Accès gestion AFC<small>Indépendant du rôle municipal</small></label></section>
      <div className="unified-workspace"><aside className="unified-sidebar"><p className="unified-kicker">MES ESPACES</p>{availableSpaces.map(item=><button key={item.id} className={currentSpace.id === item.id ? `selected ${item.color}` : item.color} onClick={() => {setSpace(item.id);setSelection('');}}><item.icon size={20}/><span>{item.title}</span><ChevronRight size={15}/></button>)}<div className="unified-sidebar-note"><ShieldCheck size={22}/><p>Des outils adaptés<br/>à chaque mission.</p></div><button className="unified-back-public" onClick={() => changeView('public')}><ArrowLeft size={17}/>Retour à l’accueil</button></aside>
        <section className="unified-dashboard"><div className="unified-workspace-top"><span><LayoutDashboard size={16}/>Mon espace · {currentSpace.title}</span><span className="unified-profile-badge">{profiles[profile].label}</span></div><p className="unified-kicker">HEUREUX DE VOUS RETROUVER</p><h1>Tout commence ici.</h1><p className="unified-dashboard-intro">{profiles[profile].subtitle}</p>
          <div className={`unified-workspace-banner ${currentSpace.color}`}><span className="unified-banner-icon"><currentSpace.icon size={30}/></span><div><h2>{currentSpace.title}</h2><p>{currentSpace.text}</p></div><span className="unified-banner-tag">VUE DE DÉMONSTRATION</span></div>
          <div className="unified-tools-heading"><h2>Vos outils</h2><span>{tools.length} accès proposés</span></div><div className="unified-tools-grid">{tools.map((title,index)=>{const Icon=toolIcons[index%toolIcons.length];return <button key={title} className={selection === title ? 'chosen' : ''} onClick={()=>setSelection(title)} aria-pressed={selection===title}><span className={`unified-tool-icon ${currentSpace.color}`}><Icon size={21}/></span><strong>{title}</strong><ArrowRight size={17}/></button>;})}</div>
          {selection&&<div className="unified-detail" role="status"><Check size={21}/><div><h3>{selection}</h3><p>Cet accès ouvrira le module correspondant dans l’application commune. Cette maquette ne lit ni ne modifie aucun dossier.</p></div><button aria-label="Fermer l’aperçu de l’outil" onClick={()=>setSelection('')}>×</button></div>}
          <div className="unified-access-note"><LockKeyhole size={17}/><p>{profile === 'secretariat' ? 'Vue proposée : pré-réservations à faire valider, disponibilités sans noms et remises au Trésor public.' : profile === 'consultation' ? 'Vue proposée : planning en consultation et suivi des remises au Trésor public.' : 'Les accès définitifs seront vérifiés avec les autorisations de chaque compte.'} {afcAccess ? 'L’accès AFC est simulé séparément.' : 'Aucun outil de gestion AFC n’est affiché.'}</p></div>
        </section>
      </div>
    </main>}
    <footer className="unified-footer"><span><Landmark size={17}/>MŒUVRES<span className="unified-footer-separator">/</span>Une commune, un point d’entrée.</span><small>Proposition d’organisation · Octobre 2026</small></footer>
  </div>;
}
