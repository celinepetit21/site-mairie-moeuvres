"use client";
import { useState } from 'react';
export function ShareActions({title}:{title:string}){
 const [message,setMessage]=useState('');
 async function share(){try{if(navigator.share){await navigator.share({title,url:window.location.href});}else{await navigator.clipboard.writeText(window.location.href);setMessage('Lien copié.');}}catch(error){if((error as Error).name!=='AbortError')setMessage('Le partage est indisponible. Vous pouvez copier l’adresse dans votre navigateur.');}}
 return <div className="share-actions"><button className="button secondary" onClick={share}>Partager</button><button className="button secondary" onClick={()=>window.print()}>Imprimer</button><span role="status">{message}</span></div>;
}
