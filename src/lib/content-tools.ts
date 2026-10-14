export function matchesSearch(query:string,values:(string|null|undefined)[]){
 const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr').replaceAll('œ','oe');
 const haystack=normalize(values.filter(Boolean).join(' '));
 return normalize(query).trim().split(/\s+/).filter(Boolean).every(word=>haystack.includes(word));
}
export function eventEnded(start:string|null|undefined,end:string|null|undefined,now=Date.now()){
 if(!start)return true;
 // Un événement sans heure de fin reste annoncé jusqu'à la fin de sa journée à Paris.
 if(end)return Date.parse(end)<now;
 const day=(value:number)=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).format(value);
 return day(Date.parse(start))<day(now);
}
export function calendarFile(event:{id:string;titre:string;contenu:string;lieu?:string;date_debut:string;date_fin?:string|null},now=new Date()){
 const escape=(s:string)=>s.replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
 const stamp=(s:string|Date)=>new Date(s).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Moeuvres//Agenda//FR','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${event.id}@mairie-moeuvres`,`DTSTAMP:${stamp(now)}`,`DTSTART:${stamp(event.date_debut)}`];
 if(event.date_fin)lines.push(`DTEND:${stamp(event.date_fin)}`);
 lines.push(`SUMMARY:${escape(event.titre)}`,`DESCRIPTION:${escape(event.contenu)}`,`LOCATION:${escape(event.lieu??'Mœuvres')}`,'END:VEVENT','END:VCALENDAR');
 // RFC 5545 : lignes limitées à 75 octets, en préservant les caractères UTF-8.
 return lines.map(line=>{let output='',part='',size=0;for(const char of line){const bytes=new TextEncoder().encode(char).length;if(size+bytes>75){output+=part+'\r\n';part=' ';size=1;}part+=char;size+=bytes;}return output+part;}).join('\r\n')+'\r\n';
}
