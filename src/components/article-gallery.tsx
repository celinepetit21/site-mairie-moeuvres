import './article-gallery.css';

type ArticlePhoto = { src: string; alt: string };

const galleries: Record<string, ArticlePhoto[]> = {
  '554f4085-e9bf-4acc-926f-64bc39485823': [
    {
      src: '/actualites/enfants-moeuvres-2026-1.jpg',
      alt: 'Deux enfants installés sur un banc coloré pendant une animation à Mœuvres',
    },
    {
      src: '/actualites/enfants-moeuvres-2026-2.jpg',
      alt: 'Groupe d’enfants avec des bulles de savon dans la cour de Mœuvres',
    },
    {
      src: '/actualites/enfants-moeuvres-2026-3.jpg',
      alt: 'Deux personnes bénévoles au stand de boissons pendant une animation à Mœuvres',
    },
  ],
  '13dcb946-4cb2-4c30-94e6-83ca27ea7a20': [
    {
      src: '/actualites/animation-enfants-caravane-2026.webp',
      alt: 'Les enfants et une animatrice souriants devant une caravane à Mœuvres',
    },
  ],
  'ad1e0dcc-5c92-4181-b055-8c8cb3f0a769': [
    {
      src: '/actualites/paques-2026-1.webp',
      alt: 'Distribution de chocolats aux membres du Club des 4 Saisons autour de leur table',
    },
    {
      src: '/actualites/paques-2026-2.webp',
      alt: 'Remise de chocolats de Pâques lors de la rencontre avec les aînés du Club des 4 Saisons',
    },
  ],
};

export function ArticleGallery({ articleId }: { articleId: string }) {
  const images = galleries[articleId] ?? [];
  if (images.length === 0) return null;

  return (
    <section className="article-gallery" aria-label="Photographies de cette actualité">
      <h2>Retour en images</h2>
      <div className="article-gallery-grid">
        {images.map((photo, index) => (
          <figure key={photo.src}>
            <a
              href={photo.src}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Agrandir la photographie ${index + 1}`}
            >
              <img src={photo.src} alt={photo.alt} loading="lazy" width={500} height={231} />
            </a>
          </figure>
        ))}
      </div>
    </section>
  );
}
