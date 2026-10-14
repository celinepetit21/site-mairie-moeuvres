import Link from 'next/link';
import { ArrowRight,Plus,CheckCircle2,FilePenLine } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import { sections } from '@/lib/types';
export default async function Dashboard(){
 const {client}=await requireAdmin();
 const counts=await Promise.all(Object.entries(sections).map(async([key,s])=>{
 const [{count:published,error:pubError},{count:draft,error:draftError}]=await Promise.all([client.from(s.table).select('id',{count:'exact',head:true}).eq('statut','publie'),client.from(s.table).select('id',{count:'exact',head:true}).eq('statut','brouillon')]);
 if(pubError||draftError)throw new Error('Le schéma Supabase est à vérifier.');return {key,...s,published:published??0,draft:draft??0};
 }));
 return <><p className="eyebrow">VOTRE ESPACE MUNICIPAL</p><div className="section-heading"><div><h1>Bonjour Céline</h1><p className="muted">Tout ce qu’il faut pour faire vivre Mœuvres en ligne.</p></div><Link href="/admin/actualites/nouveau" className="button"><Plus size={18}/>Nouvelle actualité</Link></div><div className="stats-grid">{counts.map(s=><Link className="stat-card" href={`/admin/${s.key}`} key={s.key}><p>{s.title}</p><strong>{s.published+s.draft}</strong><div><span><CheckCircle2 size={15}/>{s.published} publiés</span><span><FilePenLine size={15}/>{s.draft} brouillons</span></div><span className="text-link">Gérer <ArrowRight size={15}/></span></Link>)}</div><section className="admin-welcome"><div><p className="eyebrow">UNE COMMUNE QUI COMMUNIQUE</p><h2>Une information à partager ?</h2><p>Préparez votre contenu en brouillon. Publiez-le lorsque vous êtes prête : il apparaîtra immédiatement sur le site.</p><div className="button-row"><Link className="button" href="/admin/informations/nouveau">Ajouter une information</Link><Link className="button secondary" href="/admin/evenements/nouveau">Créer un événement</Link></div></div></section><div className="cards admin-shortcuts"><Link href="/admin/medias"><h3>Documents & photographies</h3><p>Importer les fichiers, vérifier les publications et gérer la galerie.</p><ArrowRight size={20}/></Link><Link href="/admin/parametres"><h3>Les informations de la mairie</h3><p>Coordonnées, horaires et photographie de la page d’accueil.</p><ArrowRight size={20}/></Link></div></>;
}
