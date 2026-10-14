import { z } from 'zod';
import type { CSSProperties } from 'react';
export const seasons={aucune:'Aucune décoration',octobre_rose:'Octobre Rose',halloween:'Halloween',noel:'Noël',nouvel_an:'Nouvel An',saint_valentin:'Saint-Valentin',paques:'Pâques',premier_mai:'1er mai — Muguet',huit_mai:'8 mai — Commémoration',quatorze_juillet:'14 juillet — Fête nationale',fete_musique:'Fête de la musique',rentree:'Rentrée',personnalisee:'Fête personnalisée'} as const;
const hex=z.string().regex(/^#[0-9a-fA-F]{6}$/,'Choisissez une couleur au format #RRGGBB.');
export const appearanceSchema=z.object({boutons:hex,icones:hex,titres:hex,encadres:hex,decoration:hex,saison:z.enum(Object.keys(seasons) as [keyof typeof seasons,...(keyof typeof seasons)[]]),intensite:z.enum(['discrete','festive']),texte:z.string().trim().max(80,'Le message doit rester inférieur à 80 caractères.')});
export type Appearance=z.infer<typeof appearanceSchema>;
export const defaultAppearance:Appearance={boutons:'#344a60',icones:'#ce7652',titres:'#344a60',encadres:'#dbc7a0',decoration:'#dd5684',saison:'aucune',intensite:'discrete',texte:''};
export function getAppearance(value:unknown):Appearance{const parsed=appearanceSchema.safeParse(value);return parsed.success?parsed.data:defaultAppearance;}
function channels(color:string){return [1,3,5].map(i=>parseInt(color.slice(i,i+2),16)/255);}
function luminance(color:string){return channels(color).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((sum,c,i)=>sum+c*[.2126,.7152,.0722][i],0);}
export function contrast(a:string,b:string){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
function shade(color:string,ratio:number){return '#'+channels(color).map(c=>Math.round(c*255*ratio).toString(16).padStart(2,'0')).join('');}
export function readableOnLight(color:string){let result=color;for(let i=0;i<20&&contrast(result,'#f5f1e9')<4.5;i++)result=shade(result,.85);return result;}
export function appearanceStyle(value:Appearance):CSSProperties{
 const a=getAppearance(value);const buttonText=contrast(a.boutons,'#ffffff')>=contrast(a.boutons,'#000000')?'#ffffff':'#000000';
 return {'--ink':'#344a60','--paper':'#faf8f3','--green':readableOnLight(a.boutons),'--green-dark':shade(a.boutons,.8),'--muted':'#5f6c77','--gold':'#806532','--line':'#e5e0d8','--button-bg':a.boutons,'--button-fg':buttonText,'--button-hover':shade(a.boutons,.85),'--button-hover-fg':contrast(shade(a.boutons,.85),'#ffffff')>=contrast(shade(a.boutons,.85),'#000000')?'#ffffff':'#000000','--icon-color':a.icones,'--icon-readable':readableOnLight(a.icones),'--heading-color':readableOnLight(a.titres),'--frame-color':a.encadres,'--decor-color':a.decoration,'--decor-readable':readableOnLight(a.decoration),'--hero-bg':'#f5f1e9','--footer-bg':'#273d52'} as CSSProperties;
}
export const appearancePresets=[
 {name:'Bleu & corail',values:defaultAppearance},
 {name:'Rose solidaire',values:{...defaultAppearance,icones:'#dc4d83',encadres:'#e6a3bd',decoration:'#dc4d83',saison:'octobre_rose' as const}},
 {name:'Halloween',values:{...defaultAppearance,icones:'#d47726',encadres:'#dca25d',decoration:'#d47726',saison:'halloween' as const}},
 {name:'Noël',values:{...defaultAppearance,icones:'#b64449',encadres:'#c6a666',decoration:'#b64449',saison:'noel' as const}},
 {name:'Bleu, blanc, rouge',values:{...defaultAppearance,icones:'#ba4248',encadres:'#7f99b7',decoration:'#ba4248',saison:'quatorze_juillet' as const}},
];
