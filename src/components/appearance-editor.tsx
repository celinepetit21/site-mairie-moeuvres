"use client";
import { useState } from 'react';
import { ArrowRight,CalendarDays,Megaphone } from 'lucide-react';
import { ActionForm } from './action-form';
import { saveAppearance } from '@/app/admin/actions';
import { appearanceStyle,appearancePresets,seasons,type Appearance } from '@/lib/appearance';
import { resolveAppearance } from '@/lib/seasonal-themes';
import { SeasonBanner,HeroDecorations } from './season-decoration';

const colors=[['boutons','Boutons et liens'],['icones','Icônes et badges'],['titres','Titres'],['encadres','Bordures et encadrés'],['decoration','Décorations saisonnières']] as const;

export function AppearanceEditor({initial}:{initial:Appearance}){
 const [value,setValue]=useState(initial);
 const preview=resolveAppearance(value);
 const automatic=value.mode==='automatique';
 return <ActionForm action={saveAppearance} label="Enregistrer l’apparence">
  <label>Gestion des couleurs et des décorations
   <select name="mode" value={value.mode} onChange={e=>setValue({...value,mode:e.target.value as Appearance['mode']})}>
    <option value="automatique">Automatique — selon les dates de l’année</option>
    <option value="manuel">Manuelle — je choisis moi-même</option>
   </select>
  </label>
  <p className="muted">{automatic
    ? <>Le thème change automatiquement à la date prévue, selon l’heure de Paris, sans intervention ni publication. <strong>Aujourd’hui : {seasons[preview.saison]}.</strong> Le thème Novembre Bleu est actif du 1er au 30 novembre ; Halloween prend le relais du 26 au 31 octobre après Octobre Rose.</>
    : <>Le calendrier est désactivé : les couleurs et décorations choisies ci-dessous restent affichées jusqu’à votre prochaine modification.</>}
  </p>
  <p className="muted">Les couleurs personnalisées ci-dessous restent votre base habituelle hors périodes saisonnières, et sont utilisées immédiatement en mode manuel.</p>
  <div className="appearance-presets">{appearancePresets.map(p=><button type="button" key={p.name} onClick={()=>setValue(previous=>({...p.values,mode:previous.mode}))}>{p.name}</button>)}</div>
  <div className="appearance-colors">{colors.map(([key,label])=><label key={key}>{label}<span className="color-control"><input type="color" name={key} value={value[key]} onChange={e=>setValue({...value,[key]:e.target.value})}/><code>{value[key].toUpperCase()}</code></span></label>)}</div>
  <div className="form-grid"><label>Décoration manuelle<select name="saison" value={value.saison} onChange={e=>setValue({...value,saison:e.target.value as Appearance['saison']})}>{Object.entries(seasons).map(([id,title])=><option key={id} value={id}>{title}</option>)}</select></label><label>Présence des décorations<select name="intensite" value={value.intensite} onChange={e=>setValue({...value,intensite:e.target.value as Appearance['intensite']})}><option value="discrete">Discrète</option><option value="festive">Festive</option></select></label></div>
  <label>Message saisonnier personnalisé (mode manuel uniquement)<input name="texte" value={value.texte} maxLength={80} onChange={e=>setValue({...value,texte:e.target.value})}/></label>
  <p className="muted">En mode automatique, le message et les décorations sont définis par le calendrier. Hors événements, le site retrouve vos couleurs habituelles sans décoration. Les événements de l’agenda restent indépendants.</p>
  <div className="appearance-preview" style={appearanceStyle(preview)}><SeasonBanner appearance={preview}/><div className="preview-content"><p className="eyebrow">APERÇU DU THÈME ACTIF</p><h3>Mœuvres</h3><p>Petit village, grande énergie</p><div className="preview-photo"><HeroDecorations appearance={preview}/><span>Vos décorations, autour de la photo</span></div><span className="preview-button">Découvrir la vie locale <ArrowRight size={15}/></span><div className="preview-icons"><span><Megaphone size={20}/>Actualités</span><span><CalendarDays size={20}/>Agenda</span></div></div></div>
 </ActionForm>;
}
