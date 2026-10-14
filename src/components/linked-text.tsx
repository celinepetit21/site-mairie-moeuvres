// Liens HTTPS uniquement ; le reste du contenu reste du texte échappé par React.
export function LinkedText({text}:{text:string}){
 return <>{text.split(/(https:\/\/[^\s<>]+)/g).map((part,i)=>part.startsWith('https://')?<a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{textDecoration:'underline',overflowWrap:'anywhere'}}>{part}</a>:part)}</>;
}
