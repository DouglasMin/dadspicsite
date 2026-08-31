import { Link } from 'react-router-dom';
import { Expand, Palette } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { Artwork } from '@/lib/api';
import { cn } from '@/lib/utils';

/**
 * Artwork metadata records size the Korean way — 세로 x 가로 (height first).
 * Reserving the box at the work's own proportions does two jobs at once: it
 * stops layout shift, and it is what breaks the grid out of uniform cards,
 * because the paintings themselves are not all the same shape.
 */
const FALLBACK_RATIO = 0.82;

function aspectRatioOf(dimensions?: string): number {
  if (!dimensions) return FALLBACK_RATIO;

  const numbers = dimensions.match(/\d+(?:\.\d+)?/g);
  if (!numbers || numbers.length < 2) return FALLBACK_RATIO;

  const height = Number(numbers[0]);
  const width = Number(numbers[1]);
  if (!height || !width) return FALLBACK_RATIO;

  const ratio = width / height;
  // Guard against typos in the admin form producing an absurd frame.
  return ratio >= 0.4 && ratio <= 2.6 ? ratio : FALLBACK_RATIO;
}

interface ArtworkPlateProps {
  imageUrl?: string;
  title: string;
  dimensions?: string;
  /** Above-the-fold images opt out of lazy loading. */
  priority?: boolean;
  className?: string;
}

/** The painting on the wall: true proportions, never cropped, no chrome. */
export function ArtworkPlate({
  imageUrl,
  title,
  dimensions,
  priority = false,
  className,
}: ArtworkPlateProps) {
  const ratio = aspectRatioOf(dimensions);

  if (!imageUrl) {
    return (
      <div
        className={cn(
          'art-plate flex items-center justify-center bg-wall-shade',
          className
        )}
        style={{ aspectRatio: `${ratio}` } as CSSProperties}
      >
        <Palette className="size-8 text-ink-faint" />
      </div>
    );
  }

  return (
    <div
      className={cn('art-plate', className)}
      style={{ aspectRatio: `${ratio}` } as CSSProperties}
    >
      <img
        src={imageUrl}
        alt={title}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className="art-img"
      />
    </div>
  );
}

interface ArtworkCardProps {
  artwork: Artwork;
  to: string;
  /** Renders a lightbox trigger over the plate when provided. */
  onZoom?: () => void;
  priority?: boolean;
  /** Caption size — `lg` for hero placements, `sm` for dense lists. */
  size?: 'sm' | 'md' | 'lg';
}

export function ArtworkCard({
  artwork,
  to,
  onZoom,
  priority = false,
  size = 'md',
}: ArtworkCardProps) {
  const titleSize =
    size === 'lg' ? 'text-h2' : size === 'sm' ? 'text-base' : 'text-h3';

  return (
    <article className="art relative">
      <Link to={to} className="block focus:outline-none">
        <ArtworkPlate
          imageUrl={artwork.imageUrl}
          title={artwork.title}
          dimensions={artwork.dimensions}
          priority={priority}
        />

        {/* Caption sits on the wall, not in a bar over the work. */}
        <div className="art-caption">
          <h3
            className={cn(
              'font-serif font-normal leading-snug text-ink',
              titleSize
            )}
          >
            {artwork.title}
          </h3>

          <span className="art-rule mt-3 mb-3" aria-hidden="true" />

          <p className="art-meta text-meta text-ink-soft tracking-wide">
            {[artwork.year, artwork.medium].filter(Boolean).join('  ·  ')}
          </p>
        </div>
      </Link>

      {onZoom && (
        <button
          type="button"
          onClick={onZoom}
          className="art-zoom pressable absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-paper/92 text-ink shadow-sm backdrop-blur-sm sm:top-4 sm:right-4"
          aria-label={`${artwork.title} 크게 보기`}
        >
          <Expand className="size-4" />
        </button>
      )}
    </article>
  );
}
