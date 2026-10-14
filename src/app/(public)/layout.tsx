import { SiteHeader,SiteFooter } from '@/components/site-shell';
export const dynamic='force-dynamic';
export default function PublicLayout({children}:{children:React.ReactNode}){return <><a className="skip-link" href="#main">Aller au contenu</a><SiteHeader/>{children}<SiteFooter/></>}
