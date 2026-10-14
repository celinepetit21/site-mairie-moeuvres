import { ActionForm } from './action-form';
import { saveContent, deleteContent } from '@/app/admin/actions';
import { type Section, type Content } from '@/lib/types';
import { localInput } from '@/lib/validation';
export function ContentForm({section,item}:{section:Section;item?:Content}) {
 return <><ActionForm action={saveContent.bind(null,section,item?.id??null)}>
 <label>Titre<input name="titre" defaultValue={item?.titre} required minLength={3} maxLength={180}/></label>
 <label>Résumé court<textarea name="resume" defaultValue={item?.resume} rows={3} maxLength={400}/></label>
 <label>Contenu<textarea name="contenu" defaultValue={item?.contenu} rows={12} required maxLength={30000}/></label><p className="muted">Texte simple : les paragraphes et retours à la ligne sont conservés.</p>
 {section!=='actualites'&&<><div className="form-grid"><label>{section==='evenements'?'Début de l’événement':'Visible à partir du'}<input name="date_debut" type="datetime-local" defaultValue={localInput(item?.date_debut)} required={section==='evenements'}/></label><label>{section==='evenements'?'Fin de l’événement':'Visible jusqu’au'}<input name="date_fin" type="datetime-local" defaultValue={localInput(item?.date_fin)}/></label></div><p className="muted">Toutes les heures sont celles de Paris.</p><label>Lieu<input name="lieu" defaultValue={item?.lieu??''} maxLength={200}/></label></>}
 <label>Statut<select name="statut" defaultValue={item?.statut??'brouillon'}><option value="brouillon">Brouillon — visible par vous seule</option><option value="publie">Publié — visible sur le site</option></select></label>
 </ActionForm>{item&&<details className="delete-box"><summary>Supprimer ce contenu</summary><p>Cette suppression est définitive.</p><ActionForm action={deleteContent.bind(null,section,item.id)} label="Supprimer définitivement" danger><label>Pour confirmer, saisissez SUPPRIMER<input name="confirmation" required pattern="SUPPRIMER" autoComplete="off"/></label></ActionForm></details>}</>;
}
