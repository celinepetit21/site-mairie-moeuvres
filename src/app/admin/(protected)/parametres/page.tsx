import { AppearanceEditor } from '@/components/appearance-editor';
import { getAppearance } from '@/lib/appearance';
import { requireAdmin } from '@/lib/auth';
import { type Settings,type Asset } from '@/lib/types';
import { ActionForm } from '@/components/action-form';
import { saveSettings } from '../../actions';
export default async function SettingsPage({searchParams}:{searchParams:Promise<{succes?:string}>}){
 const {client}=await requireAdmin();const {succes}=await searchParams;
 const [{data,error},{data:photos,error:photoError}]=await Promise.all([client.from('mairie_parametres_site').select('*').eq('id',true).single(),client.from('mairie_galerie_photos').select('*').eq('statut','publie')]);
 if(error||photoError)throw new Error('Impossible de charger les paramètres.');const config=data as Settings;
 return <><p className="eyebrow">VOTRE COMMUNE</p><h1>Paramètres du site</h1>{succes&&<p className="alert success">Paramètres enregistrés.</p>}<div className="editor-card"><ActionForm action={saveSettings}><label>Nom de la commune<input name="nom_commune" defaultValue={config.nom_commune} required maxLength={80}/></label><label>Slogan<input name="slogan" defaultValue={config.slogan} required maxLength={160}/></label><label>Adresse<textarea name="adresse" defaultValue={config.adresse} maxLength={300}/></label><div className="form-grid"><label>Téléphone<input name="telephone" type="tel" defaultValue={config.telephone} maxLength={30}/></label><label>Adresse e-mail<input name="email" type="email" defaultValue={config.email}/></label></div><label>Horaires d’ouverture<textarea name="horaires" defaultValue={config.horaires} rows={5} maxLength={1000}/></label><label>Photographie de la page d’accueil<select name="photo_mairie_id" defaultValue={config.photo_mairie_id??''}><option value="">Fond illustré par défaut</option>{(photos as Asset[]??[]).map(p=><option key={p.id} value={p.id}>{p.titre}</option>)}</select></label><p className="muted">Importez d’abord une photographie de la mairie dans « Documents & photos », puis publiez-la pour la sélectionner ici.</p></ActionForm></div><section className="editor-card" id="apparence"><p className="eyebrow">PERSONNALISER VOTRE SITE</p><h2>Couleurs et décorations</h2><AppearanceEditor initial={getAppearance(config.apparence)}/></section></>;
}
