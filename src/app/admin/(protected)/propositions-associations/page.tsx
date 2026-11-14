import Link from 'next/link';
import {requireAdmin} from '@/lib/auth';
import {markAssociationProposal} from '@/app/admin/propositions-associations/actions';
const subjects:Record<string,string>={coordonnees:'Coordonnées',presentation:'Présentation',manifestations:'Manifestations',actualites:'Actualités',autre:'Autre'};
export default async function AssociationProposals({searchParams}:{searchParams:Promise<{succes?:string}>}){
 const {client}=await requireAdmin();
 const [{data,error},{data:associations}]=await Promise.all([client.from('mairie_propositions_associations').select('*').order('created_at',{ascending:false}).limit(200),client.from('mairie_pages').select('id,titre').eq('categorie','associations')]);
 if(error)throw new Error('Impossible de charger les propositions.');
 const names=new Map((associations??[]).map(a=>[a.id,a.titre]));const params=await searchParams;
 return <><div className="section-heading"><div><p className="eyebrow">VIE ASSOCIATIVE</p><h1>Propositions des associations</h1><p className="muted">Les propositions reçues ne sont pas publiées automatiquement. Vérifiez-les puis mettez à jour la fiche.</p></div><Link href="/admin/pages" className="button secondary">Gérer les fiches</Link></div>
 {params.succes&&<p className="alert success" role="status">Proposition marquée comme traitée.</p>}
 <div className="content-list">{(data??[]).length?data!.map(p=><article key={p.id} className="content-row" style={{display:'block',borderLeft:p.statut==='nouveau'?'4px solid #b27b27':'4px solid #4c9465'}}><div>
 <span className={'badge '+(p.statut==='nouveau'?'brouillon':'publie')}>{p.statut==='nouveau'?'À traiter':'Traité'}</span>
 <h3>{names.get(p.association_id)||'Association'}</h3>
 <p><strong>{p.prenom} {p.nom}</strong>{p.fonction?' — '+p.fonction:''} · {new Date(p.created_at).toLocaleString('fr-FR',{timeZone:'Europe/Paris'})}</p>
 <p><strong>Sujet :</strong> {subjects[p.sujet]||p.sujet}</p><p className="preserve">{p.message}</p>
 <p>{p.email&&<a href={'mailto:'+p.email} className="text-link">{p.email}</a>}{p.telephone&&<> · <a className="text-link" href={'tel:'+p.telephone}>{p.telephone}</a></>}</p>
 <div className="button-row"><Link href={'/admin/pages/'+p.association_id} className="button secondary">Modifier la fiche</Link>{p.statut==='nouveau'?<form action={markAssociationProposal}><input type="hidden" name="id" value={p.id}/><button className="button" type="submit">Marquer comme traité</button></form>:<p className="muted">Traité par {p.traite_par||'—'} le {p.traite_le?new Date(p.traite_le).toLocaleString('fr-FR',{timeZone:'Europe/Paris'}):'—'}</p>}</div>
 </div></article>):<div className="empty-state"><h3>Aucune proposition reçue</h3><p>Les messages du formulaire apparaîtront ici.</p></div>}</div></>;
}
