import './article-gallery.css';

type ArticlePhoto = { src: string; alt: string };

const galleries: Record<string, ArticlePhoto[]> = {
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
