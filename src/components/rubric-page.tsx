import Link from 'next/link';
import {ArrowRight,Users} from 'lucide-react';
import {published} from '@/lib/data';
import {associationLogos,associationNames,associationSort} from '@/lib/association-data';
import {pageCategories,type PageCategory} from '@/lib/types';
import './association-page.css';
const intros={commune:'Découvrez le village, son histoire et la vie municipale.',demarches:'Retrouvez les informations préparées par la mairie pour vos démarches.','vie-pratique':'Les services et renseignements utiles au quotidien.',associations:'Les associations qui font vivre notre village : manifestations, actualités et contacts.'};
export async function RubricPage({category}:{category:PageCategory}){
 const rows=(await published('pages',1000)).filter(p=>p.categorie===category);
 if(category==='associations')rows.sort((a,b)=>associationSort(a.id)-associationSort(b.id));
 return <main id="main" className="container public-page"><p className="eyebrow">PETIT VILLAGE, GRANDE ÉNERGIE</p><h1>{pageCategories[category]}</h1><p className="article-intro">{intros[category]}</p>
 {category==='associations'?<div className="association-list">{rows.map(row=><Link href={'/pages/'+row.id} className="association-list-card" key={row.id}><div className="association-list-logo">{associationLogos[row.id]?<img src={associationLogos[row.id]} alt={'Logo de '+row.titre}/>:<Users size={30} aria-hidden="true"/>}</div><div className="association-list-body"><h2>{associationNames[row.id]??row.titre}</h2><p>{row.resume||'Découvrir les manifestations, les actualités et les coordonnées.'}</p></div><ArrowRight size={21} className="association-list-arrow"/></Link>)}{!rows.length&&<div className="empty-state">Les fiches des associations seront bientôt disponibles.</div>}</div>:
 <div className="rubric-grid">{category==='commune'&&<Link href="/commune/conseil-municipal" className="rubric-card"><h2>Le conseil municipal</h2><p>Découvrez le maire, les adjoints et les membres du conseil municipal de Mœuvres.</p><span className="text-link">Rencontrer l’équipe <ArrowRight size={16}/></span></Link>}{rows.length?rows.map(row=><Link href={'/pages/'+row.id} className="rubric-card" key={row.id}><h2>{row.titre}</h2><p>{row.resume||row.contenu.slice(0,160)}</p><span className="text-link">Découvrir <ArrowRight size={16}/></span></Link>):category==='commune'?null:<div className="empty-state wide"><h2>Cette rubrique se prépare</h2><p>La mairie ajoutera prochainement les informations de cette rubrique.</p><Link href="/contact" className="text-link">Contacter la mairie <ArrowRight size={16}/></Link></div>}</div>}
 </main>;
}
