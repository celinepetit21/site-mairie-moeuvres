import Link from 'next/link';
import { Landmark,LayoutDashboard,Megaphone,CalendarDays,Info,Image,Settings,ExternalLink,LogOut } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import { logout } from '../actions';
export const dynamic='force-dynamic';
export const metadata={robots:{index:false,follow:false}};
export default async function AdminLayout({children}:{children:React.ReactNode}){
 const {user}=await requireAdmin();
 return <div className="admin-layout"><aside className="admin-sidebar"><Link href="/admin" className="brand"><span className="brand-icon"><Landmark size={24}/></span><span>Mœuvres<small>ADMINISTRATION</small></span></Link><nav aria-label="Administration">{[{href:'/admin',label:'Tableau de bord',icon:LayoutDashboard},{href:'/admin/actualites',label:'Actualités',icon:Megaphone},{href:'/admin/informations',label:'Informations',icon:Info},{href:'/admin/evenements',label:'Agenda',icon:CalendarDays},{href:'/admin/pages',label:'Pages & rubriques',icon:Info},{href:'/admin/medias',label:'Documents & photos',icon:Image},{href:'/admin/parametres',label:'Paramètres du site',icon:Settings}].map(({href,label,icon:Icon})=><Link key={href} href={href}><Icon size={19}/>{label}</Link>)}</nav><div className="sidebar-bottom"><Link href="/" target="_blank" rel="noopener"><ExternalLink size={17}/>Voir le site</Link><form action={logout}><button><LogOut size={17}/>Se déconnecter</button></form></div></aside><div className="admin-main"><header className="admin-topbar"><span>Le site de votre commune</span><span className="admin-avatar" title={user.email}>CP</span></header><main id="main" className="admin-content">{children}</main></div></div>;
}
