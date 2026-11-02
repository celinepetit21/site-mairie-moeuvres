import { getAppearance, type Appearance } from './appearance';

type SeasonalPalette = Pick<Appearance, 'boutons' | 'icones' | 'titres' | 'encadres' | 'decoration' | 'saison' | 'intensite'>;

// Les couleurs et messages restent centralisés : aucune intervention mensuelle requise.
const palettes: Partial<Record<Appearance['saison'], SeasonalPalette>> = {
  octobre_rose: { boutons: '#a82e67', icones: '#cd4d81', titres: '#94305e', encadres: '#edadc9', decoration: '#d65386', saison: 'octobre_rose', intensite: 'discrete' },
  halloween: { boutons: '#512c67', icones: '#d47b2b', titres: '#56366a', encadres: '#d8aa7d', decoration: '#d47b2b', saison: 'halloween', intensite: 'festive' },
  movember: { boutons: '#184b91', icones: '#2563a6', titres: '#1c4576', encadres: '#a8c9ec', decoration: '#2267ab', saison: 'movember', intensite: 'festive' },
  noel: { boutons: '#246a4b', icones: '#b4414b', titres: '#284f40', encadres: '#d7b878', decoration: '#b4414b', saison: 'noel', intensite: 'festive' },
  nouvel_an: { boutons: '#233f69', icones: '#b9913b', titres: '#243c64', encadres: '#dbbe73', decoration: '#b9913b', saison: 'nouvel_an', intensite: 'festive' },
  saint_valentin: { boutons: '#9f355c', icones: '#d45477', titres: '#842948', encadres: '#f0b9c9', decoration: '#c13a65', saison: 'saint_valentin', intensite: 'discrete' },
  paques: { boutons: '#605193', icones: '#8a72c5', titres: '#584782', encadres: '#cabce8', decoration: '#856abd', saison: 'paques', intensite: 'festive' },
  premier_mai: { boutons: '#267449', icones: '#448c58', titres: '#215a40', encadres: '#a0d3b2', decoration: '#438752', saison: 'premier_mai', intensite: 'discrete' },
  huit_mai: { boutons: '#214b7b', icones: '#bb3a48', titres: '#274c75', encadres: '#aabfd8', decoration: '#b93a4a', saison: 'huit_mai', intensite: 'discrete' },
  fete_musique: { boutons: '#6d379e', icones: '#c54aa7', titres: '#5c317f', encadres: '#d7aee8', decoration: '#bc559b', saison: 'fete_musique', intensite: 'festive' },
  quatorze_juillet: { boutons: '#214b8f', icones: '#c63844', titres: '#244f86', encadres: '#a8b6d6', decoration: '#c63844', saison: 'quatorze_juillet', intensite: 'festive' },
  rentree: { boutons: '#3d6458', icones: '#b27b36', titres: '#39584d', encadres: '#cfb98a', decoration: '#b27b36', saison: 'rentree', intensite: 'discrete' },
};

// Algorithme grégorien de Meeus/Jones/Butcher : Pâques change de date chaque année.
function easter(year: number): { month: number; day: number } {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k + 7 * 7) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  return { month, day: ((h + l - 7 * m + 114) % 31) + 1 };
}

function parisDay(date: Date): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const value = (type: string) => Number(parts.find(part => part.type === type)?.value);
  return { year: value('year'), month: value('month'), day: value('day') };
}

export function activeSeason(date = new Date()): Appearance['saison'] {
  const { year, month, day } = parisDay(date);
  // La semaine d'Halloween prend le pas sur Octobre Rose.
  if (month === 10) return day >= 26 ? 'halloween' : 'octobre_rose';
  if (month === 11) return 'movember';
  if (month === 12) return day >= 27 ? 'nouvel_an' : 'noel';
  if (month === 1 && day <= 6) return 'nouvel_an';
  if (month === 2 && day >= 10 && day <= 14) return 'saint_valentin';

  const holiday = easter(year);
  const easterUtcDay = Date.UTC(year, holiday.month - 1, holiday.day) / 86400000;
  const currentUtcDay = Date.UTC(year, month - 1, day) / 86400000;
  if (currentUtcDay >= easterUtcDay - 7 && currentUtcDay <= easterUtcDay + 1) return 'paques';

  if (month === 5 && day >= 1 && day <= 3) return 'premier_mai';
  if (month === 5 && day === 8) return 'huit_mai';
  if (month === 6 && day >= 19 && day <= 22) return 'fete_musique';
  if (month === 7 && day >= 10 && day <= 14) return 'quatorze_juillet';
  if (month === 9 && day <= 10) return 'rentree';
  return 'aucune';
}

export function resolveAppearance(value: unknown, date = new Date()): Appearance {
  const saved = getAppearance(value);
  if (saved.mode === 'manuel') return saved;
  const saison = activeSeason(date);
  const palette = palettes[saison];
  // Hors calendrier, revenir aux couleurs enregistrées sans conserver une ancienne décoration.
  return palette ? { ...saved, ...palette, texte: '' } : { ...saved, saison: 'aucune', texte: '' };
}
