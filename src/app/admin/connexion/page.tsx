import Link from 'next/link';
import { Landmark,ShieldCheck,ArrowLeft } from 'lucide-react';
import { ActionForm } from '@/components/action-form';
import { login } from '../actions';
export const metadata={title:'Connexion administration',robots:{index:false,follow:false}};
export default async function LoginPage({searchParams}:{searchParams:Promise<{erreur?:string}>}){
 const {erreur}=await searchParams;
 return <main className="login-page"><div className="login-card"><Link className="back-link" href="/"><ArrowLeft size={16}/>Retour au site</Link><div className="brand-icon"><Landmark size={28}/></div><p className="eyebrow">MAIRIE DE MŒUVRES</p><h1>Votre espace<br/>d’administration</h1><p className="muted">Connectez-vous pour faire vivre le site de la commune.</p>{erreur&&<p className="alert error" role="alert">{erreur==='configuration'?'Configuration Supabase ou compte administrateur à compléter.':'Accès réservé à l’administratrice autorisée.'}</p>}<ActionForm action={login} label="Se connecter"><label>Adresse e-mail<input type="email" name="email" required autoComplete="username"/></label><label>Mot de passe<input type="password" name="password" required autoComplete="current-password"/></label></ActionForm><p className="security-note"><ShieldCheck size={16}/>Espace réservé à l’administration municipale.</p></div></main>;
}
