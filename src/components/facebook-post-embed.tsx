'use client';
import { useEffect, useRef, useState } from 'react';

export function FacebookPostEmbed({url}:{url:string}) {
 const container=useRef<HTMLDivElement>(null);
 const [width,setWidth]=useState(500);
 useEffect(()=>{
  const element=container.current;
  if(!element)return;
  const update=()=>{
   const available=Math.floor(element.clientWidth);
   setWidth(Math.max(260,Math.min(500,available)));
  };
  update();
  const observer=new ResizeObserver(update);
  observer.observe(element);
  return ()=>observer.disconnect();
 },[]);
 let safeUrl:URL;
 try{
  safeUrl=new URL(url);
  if(safeUrl.protocol!=='https:'||!['www.facebook.com','facebook.com','m.facebook.com'].includes(safeUrl.hostname))return null;
 }catch{return null;}
 const src=`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(safeUrl.toString())}&show_text=true&width=${width}`;
 return <section className="facebook-article" aria-label="Publication Facebook et photographies de l'événement">
  <h2>La publication Facebook en images</h2>
  <p>Retrouvez ci-dessous la publication d’origine et ses photographies.</p>
  <div ref={container} className="facebook-embed-frame">
   <iframe key={width} src={src} title="Publication Facebook et photographies" width={width} height={790} loading="lazy" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"/>
  </div>
  <a className="facebook-original-link" href={safeUrl.toString()} target="_blank" rel="noopener noreferrer">Voir la publication et toutes les photos sur Facebook ↗</a>
 </section>;
}
