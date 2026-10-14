import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:{default:'Mœuvres · Commune du Nord',template:'%s | Mœuvres'},description:'Actualités, agenda et informations municipales de Mœuvres, 59400.',robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fr"><body>{children}</body></html>}
