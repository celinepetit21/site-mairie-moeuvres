"use client";
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="container public-page"><h1>Le site est momentanément indisponible.</h1><p>Réessayez dans quelques instants. Pour une première installation, vérifiez le SQL et la configuration Supabase.</p><button className="button" onClick={reset}>Réessayer</button></main>}
