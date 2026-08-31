import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, type Exhibition, type Artwork } from '@/lib/api';
import { Button } from '@/components/ui/button';
import FsLightbox from 'fslightbox-react';
import { Loader2, ArrowLeft, Calendar, ExternalLink } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { ArtworkCard } from '@/components/ArtworkCard';
import { Reveal } from '@/components/Reveal';

type ExhibitionStatus = 'ongoing' | 'upcoming' | 'past';

const STATUS_LABEL: Record<ExhibitionStatus, string> = {
  ongoing: '전시회 진행중',
  upcoming: 'Coming Soon',
  past: '마감된 전시회',
};

function getStatus(startDate: string, endDate: string): ExhibitionStatus {
  const now = new Date();
  if (new Date(startDate) > now) return 'upcoming';
  if (new Date(endDate) >= now) return 'ongoing';
  return 'past';
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// 저장 시점의 검증을 통과하지 못한 예전 데이터가 렌더링되지 않도록 한 번 더 확인
function isSafeLink(link: string): boolean {
  return /^https?:\/\//i.test(link);
}

export function ExhibitionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: 1,
  });

  const openLightboxOnSlide = (number: number) => {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: number,
    });
  };

  useEffect(() => {
    const fetchExhibition = async () => {
      if (!id) return;

      try {
        const data = await api.getExhibition(id);
        setExhibition(data);

        if (data.artworkIds && data.artworkIds.length > 0) {
          const allArtworks = await api.getArtworks();
          setArtworks(
            Array.isArray(allArtworks)
              ? allArtworks.filter((artwork) => data.artworkIds.includes(artwork.id))
              : []
          );
        }
      } catch (err) {
        console.error('전시회를 불러오는데 실패했습니다:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExhibition();
  }, [id]);

  if (loading) {
    return (
      <div className="shell py-32 text-center">
        <Loader2 className="mx-auto mb-5 size-8 animate-spin text-ink-faint" />
        <p className="text-meta tracking-wide text-ink-soft">전시회를 불러오는 중...</p>
      </div>
    );
  }

  if (!exhibition) {
    return (
      <div className="shell py-32 text-center">
        <p className="font-serif text-h2 mb-8 font-normal text-ink">전시회를 찾을 수 없습니다</p>
        <Button
          variant="outline"
          onClick={() => navigate('/exhibitions')}
          className="pressable text-meta rounded-none border-ink font-normal"
        >
          <ArrowLeft className="size-4" />
          전시회 목록으로
        </Button>
      </div>
    );
  }

  const status = getStatus(exhibition.startDate, exhibition.endDate);
  const photoUrls = exhibition.photoUrls ?? [];
  const relatedLink = exhibition.relatedLink ?? '';

  return (
    <div className="min-h-screen bg-wall pb-[var(--space-section)]">
      {/* Back */}
      <div className="shell pt-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/exhibitions')}
          className="pressable arrow-link text-meta h-auto rounded-none px-0 font-normal text-ink-soft hover:bg-transparent hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          전시회 목록으로
        </Button>
      </div>

      {/* Masthead */}
      <header className="shell pt-[var(--space-block)]">
        <div className="flex items-center gap-2.5">
          {status === 'ongoing' && (
            <span className="signal-dot" aria-hidden="true" />
          )}
          <span
            className={`label-sm ${status === 'ongoing' ? 'text-signal' : ''}`}
          >
            {STATUS_LABEL[status]}
          </span>
        </div>

        <h1 className="font-serif text-h1 mt-5 max-w-4xl font-light tracking-[-0.01em] text-ink">
          {exhibition.title}
        </h1>

        <div className="mt-9 h-px w-full bg-rule" aria-hidden="true" />
      </header>

      {/* Poster + details */}
      <section className="shell mt-[var(--space-block)]">
        <div className="grid items-start gap-x-[var(--gutter)] gap-y-10 md:grid-cols-[0.85fr_1.15fr] md:gap-x-16">
          <Reveal>
            <div className="art-plate aspect-[3/4] bg-wall-shade">
              {exhibition.imageUrl ? (
                <img
                  src={exhibition.imageUrl}
                  alt={exhibition.title}
                  decoding="async"
                  className="art-img"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Calendar className="size-10 text-ink-faint" />
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <dl className="grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="label-sm">Exhibition Period</dt>
                <dd className="text-meta mt-2 text-ink">
                  {formatDate(exhibition.startDate)} – {formatDate(exhibition.endDate)}
                </dd>
              </div>
              <div>
                <dt className="label-sm">Location</dt>
                <dd className="text-meta mt-2 text-ink">{exhibition.location}</dd>
              </div>
            </dl>

            {exhibition.description && (
              <>
                <div className="mt-8 h-px w-full bg-rule" aria-hidden="true" />
                <p className="text-body font-serif mt-7 whitespace-pre-line text-ink-soft">
                  {exhibition.description}
                </p>
              </>
            )}

            {relatedLink && isSafeLink(relatedLink) && (
              <a
                href={relatedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable text-meta mt-9 inline-flex items-center gap-2.5 border border-ink px-6 py-3 text-ink hover:bg-ink hover:text-paper"
              >
                관련 링크 바로가기
                <ExternalLink className="size-4" />
              </a>
            )}
          </Reveal>
        </div>
      </section>

      {/* Related Photos */}
      {photoUrls.length > 0 && (
        <section className="shell mt-[var(--space-section)]">
          <Reveal>
            <SectionHeading
              index="01"
              kicker={`${photoUrls.length} ${photoUrls.length === 1 ? 'Image' : 'Images'}`}
              title="Exhibition Photos"
            />
          </Reveal>

          <div className="mt-[var(--space-block)] grid grid-cols-2 items-start gap-[var(--gutter)] md:grid-cols-3">
            {photoUrls.map((url, index) => (
              <Reveal key={url} delay={(index % 3) * 60}>
                <button
                  type="button"
                  onClick={() => openLightboxOnSlide(index + 1)}
                  className="art block w-full"
                  aria-label={`${exhibition.title} 관련 사진 ${index + 1} 크게 보기`}
                >
                  <div className="art-plate aspect-[4/3]">
                    <img
                      src={url}
                      alt={`${exhibition.title} 관련 사진 ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Exhibited Artworks */}
      {artworks.length > 0 && (
        <section className="shell mt-[var(--space-section)]">
          <Reveal>
            <SectionHeading
              index={photoUrls.length > 0 ? '02' : '01'}
              kicker={`${artworks.length} ${artworks.length === 1 ? 'Work' : 'Works'}`}
              title="Exhibited Works"
            />
          </Reveal>

          <div className="mt-[var(--space-block)] grid grid-cols-2 items-start gap-x-[var(--gutter)] gap-y-14 md:grid-cols-3">
            {artworks.map((artwork, index) => (
              <Reveal key={artwork.id} delay={(index % 3) * 60}>
                <ArtworkCard
                  artwork={artwork}
                  to={`/artwork/${artwork.id}`}
                  size="sm"
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {photoUrls.length > 0 && (
        <FsLightbox
          toggler={lightboxController.toggler}
          sources={photoUrls}
          slide={lightboxController.slide}
          type="image"
        />
      )}
    </div>
  );
}
