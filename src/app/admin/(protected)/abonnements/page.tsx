import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { subscriptionTopics, type SubscriptionTopic } from '@/lib/subscriptions';
import { ActionForm } from '@/components/action-form';
import { removeSubscription } from './actions';
export default async function Subscribers({searchParams}:{searchParams:Promise<{canal?:string;sujet?:string;page?:string}>}) {
 const params = await searchParams; const {client} = await requireAdmin();
 const canal = ['email','sms'].includes(params.canal || '') ? params.canal! : '';
 const sujet = Object.hasOwn(subscriptionTopics, params.sujet || '') ? params.sujet! : '';
 const page = Math.max(1, Math.min(10000, Number.parseInt(params.page || '1',10) || 1));
 let query = client.from('mairie_abonnements').select('id,canal,destination,sujets,created_at',{count:'exact'}).order('created_at',{ascending:false}).order('id').range((page-1)*50,page*50-1);
 if (canal) query=query.eq('canal',canal); if(sujet) query=query.contains('sujets',[sujet]);
 const {data, count, error} = await query;
 const filter = new URLSearchParams({canal,sujet});
 return <><p className="eyebrow">COMMUNICATION COMMUNALE</p><h1>Inscriptions aux informations</h1><p>Une ligne par mode de réception : une personne ayant choisi e-mail et SMS apparaît deux fois.</p><p className="alert">Les inscriptions sont enregistrées. Aucun service d’envoi n’est raccordé pour le moment. Les coordonnées sont déclarées par les visiteurs et ne sont pas vérifiées automatiquement.</p>
 <form className="subscription-filters"><label>Mode de réception<select name="canal" defaultValue={canal}><option value="">Tous</option><option value="email">E-mail</option><option value="sms">SMS</option></select></label><label>Sujet<select name="sujet" defaultValue={sujet}><option value="">Tous les sujets</option>{Object.entries(subscriptionTopics).map(([key,label])=><option value={key} key={key}>{label}</option>)}</select></label><button className="button">Filtrer</button><a className="button secondary" href={'/admin/abonnements/export?'+filter}>Exporter la sélection (CSV)</a></form>
 {error ? <p role="alert">Impossible de charger les inscriptions. Veuillez réessayer.</p> : <><p><strong>{count || 0}</strong> inscription(s)</p><div className="subscription-table"><table><thead><tr><th>Coordonnées</th><th>Réception</th><th>Sujets</th><th>Inscription</th><th>Gestion</th></tr></thead><tbody>{data?.map(row=><tr key={row.id}><td>{row.destination}</td><td>{row.canal==='email'?'E-mail':'SMS'}</td><td>{row.sujets.map((t:SubscriptionTopic)=>subscriptionTopics[t]).join(', ')}</td><td>{new Date(row.created_at).toLocaleDateString('fr-FR',{timeZone:'Europe/Paris'})}</td><td><details><summary>Désinscrire</summary><ActionForm action={removeSubscription} label="Confirmer" danger><input type="hidden" name="id" value={row.id}/><label>Supprimer définitivement ces coordonnées<input type="checkbox" name="confirmer" value="oui" required/></label></ActionForm></details></td></tr>)}</tbody></table></div>{!data?.length&&<p>Aucune inscription pour cette sélection.</p>}<div className="button-row">{page>1&&<Link className="button secondary" href={'?'+filter+'&page='+(page-1)}>Précédent</Link>}{page*50<(count||0)&&<Link className="button secondary" href={'?'+filter+'&page='+(page+1)}>Suivant</Link>}</div></> }</>;
}
