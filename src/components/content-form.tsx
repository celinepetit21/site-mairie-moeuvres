import { associationLinks } from '@/lib/association-links';
import { ActionForm } from './action-form';
import { saveContent, deleteContent } from '@/app/admin/actions';
import { pageCategories, type Section, type Content, type Asset } from '@/lib/types';
import { requireAdmin } from '@/lib/auth';
import Link from 'next/link';
import { localInput } from '@/lib/validation';
export async function ContentForm({section,item}:{section:Section;item?:Content}) {
 const {client}=await requireAdmin();
 const [{data:photos,error:photoError},{data:documents,error:docError}]=await Promise.all([client.from('mairie_galerie_photos').select('*').eq('statut','publie'),client.from('mairie_documents').select('*').eq('statut','publie')]);
 if(photoError||docError)throw new Error('Impossible de charger les fichiers.');
 const resources=item?associationLinks[item.id]:undefined;const events=item?.association_evenements??resources?.events??[];
 return <><ActionForm action={saveContent.bind(null,section,item?.id??null)}>
 {item&&<p><Link className="text-link" href={`/admin/apercu/${section}/${item.id}`}>Prévisualiser le contenu enregistré</Link></p>}
 {item?.statut==='publie'&&<p><Link className="text-link" href={`/${section}/${item.id}`} target="_blank" rel="noopener">Voir le contenu publié ↗</Link></p>}
 {section==='pages'&&<label>Rubrique<select name="categorie" defaultValue={item?.categorie??'commune'}>{Object.entries(pageCategories).map(([key,title])=><option key={key} value={key}>{title}</option>)}</select></label>}
 <label>Titre<input name="titre" defaultValue={item?.titre} required minLength={3} maxLength={180}/></label>
 <label>Résumé court<textarea name="resume" defaultValue={item?.resume} rows={3} maxLength={400}/></label>
 <label>Contenu<textarea name="contenu" defaultValue={item?.contenu} rows={12} required maxLength={30000}/></label><p className="muted">Texte simple : les paragraphes et retours à la ligne sont conservés.</p>
 {(section==='evenements'||section==='informations')&&<><div className="form-grid"><label>{section==='evenements'?'Début de l’événement':'Visible à partir du'}<input name="date_debut" type="datetime-local" defaultValue={localInput(item?.date_debut)} required={section==='evenements'}/></label><label>{section==='evenements'?'Fin de l’événement':'Visible jusqu’au'}<input name="date_fin" type="datetime-local" defaultValue={localInput(item?.date_fin)}/></label></div><p className="muted">Toutes les heures sont celles de Paris.</p><label>Lieu<input name="lieu" defaultValue={item?.lieu??''} maxLength={200}/></label></>}
 <div className="form-grid">{[['photo_id','Photographie',photos],['document_id','Document PDF associé',documents]].map(([name,label,assets])=><label key={String(name)}>{String(label)}<select name={String(name)} defaultValue={item?.[name as 'photo_id'|'document_id']??''}><option value="">Aucun</option>{((assets??[]) as Asset[]).map(a=><option key={a.id} value={a.id}>{a.titre}</option>)}</select></label>)}</div><p className="muted">Importez et publiez vos fichiers dans Documents & photos avant de les associer.</p>
 <label>Statut<select name="statut" defaultValue={item?.statut??'brouillon'}><option value="brouillon">Brouillon — visible par vous seule</option><option value="publie">Publié — visible sur le site</option></select></label>
 </ActionForm>{item&&<details className="delete-box"><summary>Supprimer ce contenu</summary><p>Cette suppression est définitive.</p><ActionForm action={deleteContent.bind(null,section,item.id)} label="Supprimer définitivement" danger><label>Pour confirmer, saisissez SUPPRIMER<input name="confirmation" required pattern="SUPPRIMER" autoComplete="off"/></label></ActionForm></details>}</>;
}
