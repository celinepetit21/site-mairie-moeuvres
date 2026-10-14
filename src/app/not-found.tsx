import Link from 'next/link';
export default function NotFound(){return <main className="container public-page"><p className="eyebrow">404</p><h1>Cette page n’est pas disponible.</h1><p>Le contenu a peut-être été retiré ou n’est pas encore publié.</p><Link className="button" href="/">Retour à l’accueil</Link></main>}
