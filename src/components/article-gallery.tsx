'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import './article-gallery.css';

type ArticlePhoto = { src: string; alt: string };

const galleries: Record<string, ArticlePhoto[]> = {
  'ae24b02a-7c69-41bf-9e56-35e3487b12c8': [
    { src: '/actualites/pentecote-2026-1.webp', alt: 'Photo de groupe sous la tonnelle pendant les festivités de Pentecôte à Mœuvres' },
    { src: '/actualites/pentecote-2026-2.webp', alt: 'Équipe des bénévoles de la fête de Pentecôte sous un chapiteau' },
    { src: '/actualites/pentecote-2026-3.webp', alt: 'Concert avec chant et accordéon dans l’église de Mœuvres' },
    { src: '/actualites/pentecote-2026-4.webp', alt: 'Enfants et familles autour des stands et des ballons à la fête foraine' },
    { src: '/actualites/pentecote-2026-5.webp', alt: 'Moment convivial autour des ballons multicolores à la fête foraine' },
    { src: '/actualites/pentecote-2026-6.webp', alt: 'Une jeune participante souriante avec son ballon pendant les festivités' },
  ],
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
  const [selected, setSelected] = useState<number | null>(null);
  const openerIndex = useRef(0);
  const thumbnails = useRef<Array<HTMLButtonElement | null>>([]);
  const closeButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const isOpen = selected !== null;

  const move = useCallback((direction: number) => {
    setSelected((current) =>
      current === null || images.length < 2
        ? current
        : (current + direction + images.length) % images.length
    );
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setSelected(null);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        move(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        move(-1);
      } else if (event.key === 'Tab') {
        const buttons = Array.from(dialog.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
        if (!buttons.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      thumbnails.current[openerIndex.current]?.focus();
    };
  }, [isOpen, move]);

  if (!images.length) return null;

  const open = (index: number) => {
    openerIndex.current = index;
    setSelected(index);
  };
  const currentPhoto = selected === null ? null : images[selected];

  return (
    <section
      className={articleId === 'ae24b02a-7c69-41bf-9e56-35e3487b12c8'
        ? 'article-gallery article-gallery-pentecote'
        : 'article-gallery'}
      aria-label="Photographies de cette actualité"
    >
      <h2>Retour en images</h2>
      <div className="article-gallery-grid">
        {images.map((photo, index) => (
          <figure key={photo.src}>
            <button
              type="button"
              className="article-gallery-thumbnail"
              ref={(node) => { thumbnails.current[index] = node; }}
              onClick={() => open(index)}
              aria-label={`Agrandir la photographie ${index + 1} sur ${images.length}, sans quitter la page`}
            >
              <img src={photo.src} alt={photo.alt} loading="lazy" width={500} height={231} />
            </button>
          </figure>
        ))}
      </div>

      {currentPhoto && (
        <div
          ref={dialog}
          className="article-gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse de photographies"
        >
          <div className="article-gallery-lightbox-header">
            <span aria-live="polite">Photo {selected! + 1} sur {images.length}</span>
            <button ref={closeButton} type="button" onClick={() => setSelected(null)} aria-label="Fermer la photo">
              <X aria-hidden="true" size={26} />
            </button>
          </div>
          <div
            className="article-gallery-lightbox-stage"
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              const start = touchStartX.current;
              const end = event.changedTouches[0]?.clientX;
              touchStartX.current = null;
              if (start !== null && end !== undefined && Math.abs(end - start) > 55) {
                move(end < start ? 1 : -1);
              }
            }}
          >
            {images.length > 1 && (
              <button type="button" className="article-gallery-lightbox-arrow" onClick={() => move(-1)} aria-label="Photo précédente">
                <ChevronLeft aria-hidden="true" size={34} />
              </button>
            )}
            <figure className="article-gallery-lightbox-figure">
              <img src={currentPhoto.src} alt={currentPhoto.alt} />
            </figure>
            {images.length > 1 && (
              <button type="button" className="article-gallery-lightbox-arrow" onClick={() => move(1)} aria-label="Photo suivante">
                <ChevronRight aria-hidden="true" size={34} />
              </button>
            )}
          </div>
          <p className="article-gallery-lightbox-caption">{currentPhoto.alt}</p>
        </div>
      )}
    </section>
  );
}
