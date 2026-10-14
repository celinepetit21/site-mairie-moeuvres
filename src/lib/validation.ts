import { z } from 'zod';
export const uuid = z.uuid();
export const contentSchema = z.object({
  titre: z.string().trim().min(3, 'Le titre doit contenir au moins 3 caractères.').max(180),
  resume: z.string().trim().max(400), contenu: z.string().trim().min(1, 'Ajoutez un contenu.').max(30000),
  statut: z.enum(['brouillon', 'publie']),
  date_debut: z.string().nullable(), date_fin: z.string().nullable(), lieu: z.string().trim().max(200),
});
export function validateDates(section: string, start: string | null, end: string | null) {
 if (section === 'evenements' && !start) return 'La date de début est obligatoire.';
 if ([start,end].some(d => d && !Number.isFinite(Date.parse(d)))) return 'Une date est invalide.';
 if (end && !start) return 'Renseignez aussi la date de début.';
 if (start && end && Date.parse(end) < Date.parse(start)) return 'La fin doit être après le début.';
 return null;
}
// L'heure saisie dans les formulaires est celle de Paris, indépendamment du serveur.
export function parisToISO(value: string): string | null {
 if (!value) return null;
 if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw new Error('Date invalide.');
 const target = Date.parse(value + ':00Z');
 if (!Number.isFinite(target)) throw new Error('Date invalide.');
 const formatter = new Intl.DateTimeFormat('sv-SE', { timeZone:'Europe/Paris', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hourCycle:'h23' });
 const format = (ms: number) => formatter.format(ms).replace(' ', 'T');
 const candidates = [target-3600000, target-7200000].filter(ms => format(ms) === value);
 if (candidates.length !== 1) throw new Error('Cette heure est inexistante ou ambiguë lors du changement d’heure. Choisissez une autre heure.');
 return new Date(candidates[0]).toISOString();
}
export function localInput(value?: string | null) {
 if (!value) return '';
 return new Intl.DateTimeFormat('sv-SE', { timeZone:'Europe/Paris', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hourCycle:'h23' }).format(new Date(value)).replace(' ', 'T');
}
export function detectFile(bytes: Uint8Array): string | null {
 const starts = (...a: number[]) => a.every((v,i) => bytes[i] === v);
 if (starts(0x25,0x50,0x44,0x46,0x2d)) return 'application/pdf';
 if (starts(0xff,0xd8,0xff)) return 'image/jpeg';
 if (starts(0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a)) return 'image/png';
 if (String.fromCharCode(...bytes.slice(0,4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8,12)) === 'WEBP') return 'image/webp';
 return null;
}
