import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, type Artwork } from '@/lib/api';

import { Loader2, Image as ImageIcon, Eye } from 'lucide-react';
import FsLightbox from 'fslightbox-react';

export function Gallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: 1
  });
  const navigate = useNavigate();

  const openLightboxOnSlide = (number: number) => {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: number
    });
  };

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const data = await api.getArtworks();
        setArtworks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('작품을 불러오는데 실패했습니다:', err);
        setArtworks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-32 text-center">
        <Loader2 className="size-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-lg text-muted-foreground">갤러리를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header - Minimal */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-16 h-px bg-neutral-300 mx-auto mb-8" />
              <h1 className="text-5xl md:text-6xl font-light text-neutral-900 tracking-tight mb-6">
                Gallery
              </h1>
              <p className="text-lg text-neutral-600 font-light leading-relaxed max-w-2xl mx-auto">
                현대미술의 다양한 시각과 감성을 담은 작품들을 만나보세요.<br />
                각 작품이 전하는 고유한 이야기를 발견해보세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid - Minimal Style */}
      <section className="pb-24">
        <div className="container mx-auto px-6 lg:px-12">
          {artworks.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-16 h-16 border border-neutral-200 rounded-full flex items-center justify-center mx-auto mb-8">
                <ImageIcon className="size-6 text-neutral-400" />
              </div>
              <p className="text-xl font-light text-neutral-600 mb-4">Coming Soon</p>
              <p className="text-sm text-neutral-400 font-light">
                새로운 작품들이 곧 공개될 예정입니다
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {artworks.map((artwork, index) => (
                <div
                  key={artwork.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/artwork/${artwork.id}`)}
                >
                  {/* Image Container */}
                  {artwork.imageUrl ? (
                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-6">
                      <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Subtle overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />
                      
                      {/* Action button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openLightboxOnSlide(index + 1);
                        }}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                        title="확대 보기"
                      >
                        <Eye className="size-4 text-neutral-700" />
                      </button>
                    </div>
                  ) : (
                    <div className="aspect-[3/4] bg-neutral-100 flex items-center justify-center mb-6">
                      <ImageIcon className="size-12 text-neutral-300" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-light text-neutral-900 tracking-wide group-hover:text-neutral-600 transition-colors">
                      {artwork.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-neutral-500 font-light">
                      <span>{artwork.year}</span>
                      <div className="w-px h-3 bg-neutral-300" />
                      <span>{artwork.medium}</span>
                    </div>
                    {artwork.description && (
                      <p className="text-sm text-neutral-600 font-light leading-relaxed line-clamp-3">
                        {artwork.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <FsLightbox
        toggler={lightboxController.toggler}
        sources={artworks.filter(artwork => artwork.imageUrl).map(artwork => artwork.imageUrl)}
        slide={lightboxController.slide}
        type="image"
      />
    </div>
  );
}