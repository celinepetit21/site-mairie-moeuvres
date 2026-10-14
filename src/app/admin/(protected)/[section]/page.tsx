import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Plus,Pencil } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import { sections,isSection,type Content } from '@/lib/types';
import { dateLabel } from '@/lib/data';
export default async function ContentList({params,searchParams}:{params:Promise<{section:string}>;searchParams:Promise<{statut?:string;succes?:string}>}){
 const {section}=await params;if(!isSection(section))notFound();const filter=await searchParams;
 const {client}=await requireAdmin();let query=client.from(sections[section].table).select('*').order('updated_at',{ascending:false});
 if(['brouillon','publie'].includes(filter.statut??''))query=query.eq('statut',filter.statut!);
 const {data,error}=await query;if(error)throw new Error('Impossible de charger les contenus.');const rows=(data??[]) as Content[];
 return <><div className="section-heading"><div><p className="eyebrow">CONTENUS DU SITE</p><h1>{sections[section].title}</h1></div><Link className="button" href={`/admin/${section}/nouveau`}><Plus size={17}/>Créer</Link></div>{filter.succes&&<p className="alert success" role="status">Modification enregistrée.</p>}<nav className="filter-tabs" aria-label="Filtrer les contenus"><Link href={`/admin/${section}`} aria-current={!filter.statut?'page':undefined}>Tous</Link><Link href={`/admin/${section}?statut=brouillon`} aria-current={filter.statut==='brouillon'?'page':undefined}>Brouillons</Link><Link href={`/admin/${section}?statut=publie`} aria-current={filter.statut==='publie'?'page':undefined}>Publiés</Link></nav><div className="content-list">{rows.length?rows.map(row=><Link key={row.id} href={`/admin/${section}/${row.id}`} className="content-row"><div><span className={`badge ${row.statut}`}>{row.statut==='publie'?'Publié':'Brouillon'}</span><h3>{row.titre}</h3><p>{row.resume}</p><small>Modifié le {dateLabel(row.updated_at)}</small></div><span className="edit-label"><Pencil size={16}/>Modifier</span></Link>):<div className="empty-state"><h3>Aucun contenu pour le moment</h3><p>Utilisez « Créer » pour ajouter votre premier contenu.</p></div>}</div></>;
}
