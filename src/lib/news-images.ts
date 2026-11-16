import type { Content } from './types';

export type NewsImage = {
  src: string;
  alt: string;
  illustration?: boolean;
  credit?: { label: string; url: string };
};

// Photos des manifestations déjà enregistrées sur le site.
// Quand elles ne sont pas encore disponibles, une photographie libre d'utilisation
// est clairement signalée comme illustration et non comme souvenir de Mœuvres.
export const newsImages: Record<string, NewsImage> = {
  'edc60c56-6638-4541-9c3f-7d24dd2bf0b8': {
    src: 'https://images.unsplash.com/photo-1577188947090-95007502b22f?auto=format&fit=crop&w=960&q=80',
    alt: 'Marché de Noël illuminé, photographie d’illustration prise hors de Mœuvres',
    illustration: true,
    credit: { label: 'Alsu Vershinina / Unsplash', url: 'https://unsplash.com/photos/crowd-walking-in-front-of-building-near-christmas-tree-zjFIT9Vib7A' },
  },
  'fa99c361-6bf3-45af-ac21-d0c34c3ce46c': {
    src: '/actualites/commemoration-moeuvres.avif',
    alt: 'Élus, porte-drapeaux, habitants et enfants réunis devant le monument aux morts de Mœuvres',
  },
  'af4d00f7-7ede-4280-8520-3e1cb3d2f0db': {
    src: '/actualites/commemoration-moeuvres.avif',
    alt: 'Rassemblement devant le monument aux morts de Mœuvres pour le 11 novembre',
  },
  'c8df1126-0111-4111-8111-202611160001': {
    src: '/actualites/commemoration-moeuvres.avif',
    alt: 'Habitants et porte-drapeaux à Mœuvres lors d’une cérémonie de mémoire',
  },
  '4b6e9d04-6cb2-4087-bf79-2e14874f60ae': {
    src: 'https://images.unsplash.com/photo-1636319428693-a252ef9c8c6c?auto=format&fit=crop&w=960&q=80',
    alt: 'Citrouilles décorées pour Halloween, photographie d’illustration',
    illustration: true,
    credit: { label: 'Unsplash', url: 'https://unsplash.com/photos/a-set-of-steps-decorated-with-pumpkins-and-flowers--PgVU7_KA3s' },
  },
  '288b7d03-e6f3-408f-93f4-a6ea905ec15c': {
    src: '/actualites/soiree-retro-2026.avif',
    alt: 'Participants à la soirée rétro 2026 de l’AFC Mœuvres, dans une ambiance colorée des années 80 à 2000',
  },
  '419d254e-0fa6-42ad-933d-128a6894bc72': {
    src: 'https://images.unsplash.com/photo-1598885159329-9377168ac375?auto=format&fit=crop&w=960&q=80',
    alt: 'Ruban rose de sensibilisation au cancer du sein, photographie d’illustration',
    illustration: true,
    credit: { label: 'Angiola Harry / Unsplash', url: 'https://unsplash.com/photos/person-with-pink-band-on-her-left-hand-nJv6xnlpNaA' },
  },
  '5963c037-7565-46a8-b460-8f44094c6471': {
    src: 'https://images.unsplash.com/photo-1551866442-64e75e911c23?auto=format&fit=crop&w=960&q=80',
    alt: 'Drapeau français flottant dans le ciel, photographie d’illustration',
    illustration: true,
    credit: { label: 'Unsplash', url: 'https://unsplash.com/s/photos/french' },
  },
  '554f4085-e9bf-4acc-926f-64bc39485823': {
    src: '/actualites/enfants-moeuvres-2026-1.jpg',
    alt: 'Enfants présents lors d’une animation conviviale à Mœuvres',
  },
  '13dcb946-4cb2-4c30-94e6-83ca27ea7a20': {
    src: '/actualites/animation-enfants-caravane-2026.webp',
    alt: 'Enfants accompagnés d’une animatrice devant une caravane à Mœuvres',
  },
  'ae24b02a-7c69-41bf-9e56-35e3487b12c8': {
    src: '/actualites/pentecote-2026-1.webp',
    alt: 'Participants et bénévoles réunis sous une tonnelle pendant la Pentecôte à Mœuvres',
  },
  'ad1e0dcc-5c92-4181-b055-8c8cb3f0a769': {
    src: '/actualites/paques-2026-1.webp',
    alt: 'Remise de chocolats aux membres du Club des 4 Saisons à Mœuvres',
  },
};

export function imageForNews(item: Pick<Content, 'id' | 'photo_id'>): NewsImage {
  if (item.photo_id) {
    return { src: `/fichiers/photos/${item.photo_id}`, alt: 'Photographie associée à cette actualité' };
  }
  return newsImages[item.id] ?? {
    src: '/salle-des-fetes/facade.png',
    alt: 'Bâtiment communal de Mœuvres, photographie d’illustration',
    illustration: true,
  };
}
