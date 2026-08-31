import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, type Exhibition, type Artwork } from '@/lib/api';
import { Button } from '@/components/ui/button';
import FsLightbox from 'fslightbox-react';
import { Loader2, ArrowLeft, Calendar, MapPin, ExternalLink, Palette } from 'lucide-react';

type ExhibitionStatus = 'ongoing' | 'upcoming' | 'past';

const STATUS_LABEL: Record<ExhibitionStatus, string> = {
  ongoing: '전시회 진행중',
  upcoming: 'Coming Soon',
  past: '마감된 전시회',
};

const STATUS_STYLE: Record<ExhibitionStatus, string> = {
  ongoing: 'bg-neutral-900',
  upcoming: 'bg-neutral-600',
  past: 'bg-neutral-400',
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
      <div className="container mx-auto px-4 lg:px-6 py-32 text-center">
        <Loader2 className="size-12 animate-spin text-neutral-900 mx-auto mb-4" />
        <p className="text-lg text-neutral-600 font-light">전시회를 불러오는 중...</p>
      </div>
    );
  }

  if (!exhibition) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-32 text-center">
        <p className="text-xl text-neutral-600 font-light mb-8">전시회를 찾을 수 없습니다</p>
        <Button variant="outline" onClick={() => navigate('/exhibitions')} className="font-light">
          <ArrowLeft className="size-4 mr-2" />
          전시회 목록으로
        </Button>
      </div>
    );
  }

  const status = getStatus(exhibition.startDate, exhibition.endDate);
  const photoUrls = exhibition.photoUrls ?? [];
  const relatedLink = exhibition.relatedLink ?? '';

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-6 lg:px-12 pt-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/exhibitions')}
          className="font-light text-neutral-600 hover:text-neutral-900 px-0"
        >
          <ArrowLeft className="size-4 mr-2" />
          전시회 목록으로
        </Button>
      </div>

      {/* Exhibition Info */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 md:gap-16 items-start">
              {/* Poster */}
              <div className="relative">
                {exhibition.imageUrl ? (
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 flex items-center justify-center">
                    <img
                      src={exhibition.imageUrl}
                      alt={exhibition.title}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-6 left-6">
                      <div className={`px-4 py-2 text-white text-xs font-light tracking-wide uppercase ${STATUS_STYLE[status]}`}>
                        {STATUS_LABEL[status]}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-neutral-100 flex items-center justify-center">
                    <Calendar className="size-12 text-neutral-300" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-6 md:space-y-8">
                <div>
                  <div className="w-12 h-px bg-neutral-300 mb-4 md:mb-6" />
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight leading-tight">
                    {exhibition.title}
                  </h1>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="size-4 text-neutral-500 mt-1 shrink-0" />
                    <div className="space-y-1">
                      <p className="text-xs font-light tracking-wide uppercase text-neutral-500">
                        Exhibition Period
                      </p>
                      <p className="text-sm md:text-base font-light text-neutral-900">
                        {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="size-4 text-neutral-500 mt-1 shrink-0" />
                    <div className="space-y-1">
                      <p className="text-xs font-light tracking-wide uppercase text-neutral-500">
                        Location
                      </p>
                      <p className="text-sm md:text-base font-light text-neutral-900">
                        {exhibition.location}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <div className="w-12 h-px bg-neutral-300" />
                  <p className="text-sm md:text-base text-neutral-700 font-light leading-relaxed whitespace-pre-line">
                    {exhibition.description}
                  </p>
                </div>

                {relatedLink && isSafeLink(relatedLink) && (
                  <a
                    href={relatedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-900 text-sm font-light text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
                  >
                    관련 링크 바로가기
                    <ExternalLink className="size-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Photos */}
      {photoUrls.length > 0 && (
        <section className="py-12 md:py-16 border-t border-neutral-200">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-8 mb-10">
                <div className="w-12 h-px bg-neutral-300" />
                <h2 className="text-2xl md:text-3xl font-light text-neutral-900 tracking-wide">
                  Exhibition Photos
                </h2>
                <div className="flex-1 h-px bg-neutral-300" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {photoUrls.map((url, index) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => openLightboxOnSlide(index + 1)}
                    className="group relative aspect-[4/3] overflow-hidden bg-neutral-100"
                  >
                    <img
                      src={url}
                      alt={`${exhibition.title} 관련 사진 ${index + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Exhibited Artworks */}
      {artworks.length > 0 && (
        <section className="py-12 md:py-16 border-t border-neutral-200">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-8 mb-10">
                <div className="w-12 h-px bg-neutral-300" />
                <h2 className="text-2xl md:text-3xl font-light text-neutral-900 tracking-wide">
                  Exhibited Works
                </h2>
                <div className="flex-1 h-px bg-neutral-300" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {artworks.map((artwork) => (
                  <Link key={artwork.id} to={`/artwork/${artwork.id}`} className="group block">
                    <div className="aspect-[3/4] overflow-hidden bg-neutral-100 mb-4">
                      {artwork.imageUrl ? (
                        <img
                          src={artwork.imageUrl}
                          alt={artwork.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Palette className="size-10 text-neutral-300" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-base font-light text-neutral-900 group-hover:text-neutral-600 transition-colors">
                      {artwork.title}
                    </h3>
                    <p className="text-xs text-neutral-500 font-light mt-1">
                      {artwork.year} • {artwork.medium}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
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
