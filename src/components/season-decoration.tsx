import { Ribbon,TreePine,Sparkles,Heart,Egg,Music,BookOpen } from 'lucide-react';
import { seasons,type Appearance } from '@/lib/appearance';
export function SeasonIcon({season,size=28}:{season:Appearance['saison'];size?:number}){
 const props={size,strokeWidth:1.7,'aria-hidden':true as const};
 if(season==='octobre_rose')return <Ribbon {...props}/>;
 if(season==='noel')return <TreePine {...props}/>;
 if(season==='saint_valentin')return <Heart {...props} fill="currentColor" fillOpacity=".15"/>;
 if(season==='paques')return <Egg {...props}/>;
 if(season==='fete_musique')return <Music {...props}/>;
 if(season==='rentree')return <BookOpen {...props}/>;
 if(season==='huit_mai'||season==='quatorze_juillet')return <svg width={size} height={size} viewBox="0 0 36 30" aria-hidden="true"><path d="M5 28V3" stroke="#344a60" strokeWidth="2"/><rect x="6" y="4" width="8" height="16" fill="#264b8f"/><rect x="14" y="4" width="8" height="16" fill="#fff" stroke="#ddd" strokeWidth=".4"/><rect x="22" y="4" width="8" height="16" fill="#ce3d48"/></svg>;
 if(season==='halloween')return <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden="true"><path d="M18 9q-3-5 1-7" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M18 9C3 3-3 30 13 31h10c16-1 10-28-5-22Z" fill="currentColor" fillOpacity=".2" stroke="currentColor" strokeWidth="1.8"/><path d="m11 17 4 1-3-4Zm14 0-4 1 3-4ZM12 24q6 5 12 0" fill="currentColor" stroke="currentColor" strokeWidth="1.4"/></svg>;
 if(season==='premier_mai')return <svg width={size} height={size} viewBox="0 0 36 40" aria-hidden="true"><path d="M17 37V5m0 13 9-7m-9 2-7-5" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M16 35Q2 30 6 17q12 6 10 18Zm3 0q15-4 12-15-10 3-12 15Z" fill="currentColor" fillOpacity=".3"/><path d="M7 6q-4 4-1 7h8q3-3-1-7ZM23 9q-4 4-1 7h9q2-3-2-7ZM14 2q-4 4-1 7h8q3-3-1-7Z" fill="#fff" stroke="currentColor" strokeWidth="1.2"/></svg>;
 return <Sparkles {...props}/>;
}
const defaultMessages:Partial<Record<Appearance['saison'],string>>={octobre_rose:'Octobre Rose — Ensemble, mobilisons-nous',halloween:'Halloween au village',noel:'Joyeuses fêtes à Mœuvres',nouvel_an:'Bonne année à toutes et à tous',saint_valentin:'Une touche de douceur à Mœuvres',paques:'Joyeuses Pâques',premier_mai:'Un brin de bonheur pour le 1er mai',huit_mai:'8 mai — Mémoire et commémoration',quatorze_juillet:'14 juillet — Fête nationale',fete_musique:'Le village en musique',rentree:'Bonne rentrée à toutes et à tous',personnalisee:'Le village en fête'};
export function SeasonBanner({appearance:a}:{appearance:Appearance}){
 if(a.saison==='aucune')return null;
 return <div className={`season-banner season-${a.saison}`}><SeasonIcon season={a.saison}/><span>{a.texte||defaultMessages[a.saison]||seasons[a.saison]}</span><span className="season-banner-end"><SeasonIcon season={a.saison}/></span></div>;
}
export function HeroDecorations({appearance:a}:{appearance:Appearance}){
 if(a.saison==='aucune')return null;
 return <div className={`hero-decorations decor-${a.intensite}`} aria-hidden="true"><span className="decor-top"><SeasonIcon season={a.saison} size={38}/></span><span className="decor-bottom"><SeasonIcon season={a.saison} size={32}/></span>{a.intensite==='festive'&&<><span className="decor-left"><SeasonIcon season={a.saison} size={24}/></span><span className="decor-right"><SeasonIcon season={a.saison} size={24}/></span></>}</div>;
}
