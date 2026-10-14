import { SiteHeader,SiteFooter } from '@/components/site-shell';
import { SeasonBanner } from '@/components/season-decoration';
import { settings } from '@/lib/data';
import { getAppearance,appearanceStyle } from '@/lib/appearance';
export const dynamic='force-dynamic';
export default async function PublicLayout({children}:{children:React.ReactNode}){
 const config=await settings();const appearance=getAppearance(config.apparence);
 return <div className="site-theme" style={appearanceStyle(appearance)}><a className="skip-link" href="#main">Aller au contenu</a><SiteHeader/><SeasonBanner appearance={appearance}/>{children}<SiteFooter/></div>;
}
