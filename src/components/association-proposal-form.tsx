'use client';
import {useActionState} from 'react';
import {submitAssociationProposal,type ProposalState} from '@/app/actions/association-proposal';
export function AssociationProposalForm({associationId,associationName,emphasis=false}:{associationId:string;associationName:string;emphasis?:boolean}){
 const [state,action,pending]=useActionState<ProposalState,FormData>(submitAssociationProposal,{});
 return <section className={'assoc-panel assoc-update'+(emphasis?' assoc-update-emphasis':'')} id="proposer-fiche"><h2>Cette association vous appartient ?</h2>
 <p>Vous en êtes responsable ou membre ? Remplissez ce formulaire pour nous aider à compléter les informations de votre association : coordonnées, présentation, actualités ou manifestations. Chaque proposition est vérifiée avant publication.</p>
 {state.success?<div className="alert success" role="status">Votre proposition pour « {associationName} » a bien été enregistrée. Merci !</div>:
 <form action={action} className="action-form assoc-proposal-form"><input type="hidden" name="association_id" value={associationId}/>
 <div className="form-grid"><label>Nom *<input name="nom" autoComplete="family-name" required maxLength={100}/></label><label>Prénom *<input name="prenom" autoComplete="given-name" required maxLength={100}/></label></div>
 <label>Votre fonction dans l’association<input name="fonction" maxLength={120} placeholder="Président(e), secrétaire, membre…"/></label>
 <div className="form-grid"><label>E-mail<input name="email" type="email" autoComplete="email" maxLength={200}/></label><label>Téléphone<input name="telephone" type="tel" autoComplete="tel" maxLength={35}/></label></div>
 <p className="muted">Indiquez au moins un e-mail ou un téléphone pour être recontacté.</p>
 <label>Information concernée *<select name="sujet" defaultValue="coordonnees" required><option value="coordonnees">Coordonnées de l’association</option><option value="presentation">Présentation et membres du bureau</option><option value="manifestations">Calendrier des manifestations</option><option value="actualites">Actualités</option><option value="autre">Autre</option></select></label>
 <label>Les informations à ajouter *<textarea name="message" rows={5} minLength={15} maxLength={5000} required placeholder="Précisez les informations, dates, contacts, annonces…"/></label>
 <div className="assoc-honeypot" aria-hidden="true"><label>Ne pas remplir<input name="site_web" tabIndex={-1} autoComplete="off"/></label></div>
 <label className="assoc-consent"><input type="checkbox" name="accord" required/>J’accepte que mes coordonnées et mon message soient transmis au gestionnaire du site pour traiter ma demande.</label>
 {state.error&&<p className="alert error" role="alert">{state.error}</p>}
 <button className="button" type="submit" disabled={pending}>{pending?'Envoi en cours…':'Envoyer les informations'}</button></form>}
 </section>;
}
