'use client';
import { useActionState, useState } from 'react';
import { subscribe } from '@/app/(public)/inscription/actions';
import { subscriptionTopics } from '@/lib/subscriptions';
export function SubscriptionForm() {
 const [state, action, pending] = useActionState(subscribe, {});
 const [email, setEmail] = useState(false); const [sms, setSms] = useState(false);
 if (state.success) return <div className="subscription-success" role="status"><h2>Votre demande a été prise en compte</h2><p>Merci de votre intérêt pour la vie de Mœuvres ! Les coordonnées déjà inscrites conservent leurs choix précédents.</p><p>Pour modifier vos choix ou vous désinscrire, écrivez à <a href="mailto:moeuvres@wanadoo.fr?subject=Abonnement%20aux%20informations%20communales">moeuvres@wanadoo.fr</a> en précisant l’adresse e-mail ou le numéro concerné.</p><p className="muted">Cette inscription n’envoie pas de message de confirmation. Les premiers messages seront diffusés après la mise en service des envois par la mairie.</p></div>;
 return <form action={action} className="action-form subscription-form"><fieldset disabled={pending}>
 <p className="muted">Les éléments marqués d’un * sont obligatoires.</p>
 <fieldset><legend>Comment souhaitez-vous recevoir les nouvelles ? *</legend><div className="subscription-choices"><label><input type="checkbox" name="canaux" value="email" checked={email} onChange={e=>setEmail(e.target.checked)}/> Par e-mail</label><label><input type="checkbox" name="canaux" value="sms" checked={sms} onChange={e=>setSms(e.target.checked)}/> Par SMS</label></div></fieldset>
 {email && <label>Adresse e-mail *<input name="email" type="email" autoComplete="email" maxLength={254} required placeholder="vous@exemple.fr"/></label>}
 {sms && <label>Numéro de portable *<input name="telephone" type="tel" autoComplete="tel" maxLength={24} required placeholder="06 12 34 56 78"/><span className="muted">Numéro français commençant par 06 ou 07.</span></label>}
 <fieldset><legend>Quels sujets vous intéressent ? *</legend><div className="subscription-choices topics">{Object.entries(subscriptionTopics).map(([key,label])=><label key={key}><input type="checkbox" name="sujets" value={key}/>{label}</label>)}</div></fieldset>
 <div className="subscription-trap" aria-hidden="true"><label>Ne pas remplir<input name="site_web" tabIndex={-1} autoComplete="off"/></label></div>
 <label className="subscription-consent"><input type="checkbox" name="consentement" value="oui" required/><span>J’accepte que la commune de Mœuvres utilise mes coordonnées pour m’adresser les informations sélectionnées, par les moyens choisis. Je peux retirer mon accord à tout moment.</span></label>
 </fieldset>{state.error && <p role="alert" className="alert error">{state.error}</p>}<button className="button" disabled={pending}>{pending ? 'Inscription en cours…' : 'Je m’inscris'}</button></form>;
}
