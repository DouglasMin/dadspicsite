import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, type Artwork } from '@/lib/api';

import { Loader2, Image as ImageIcon, Eye, Search } from 'lucide-react';
import FsLightbox from 'fslightbox-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ITEMS_PER_PAGE = 9;

export function Gallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: 1
  });
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const artworkRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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
        console.error('작품을 불러오는데 실패했습니다!:', err);
        setArtworks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const filteredArtworks = useMemo(() => {
    return artworks.filter(artwork =>
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.medium?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [artworks, searchTerm]);

  // URL 쿼리 파라미터에서 페이지 정보 읽기
  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (!isNaN(page) && page > 0) {
        setCurrentPage(page);
      }
    }
  }, [searchParams]);

  // 특정 작품으로 스크롤하기
  useEffect(() => {
    const returnToArtworkId = searchParams.get('returnToArtworkId');
    if (returnToArtworkId && filteredArtworks.length > 0 && !loading) {
      // 필터링된 작품 목록에서 작품 인덱스 찾기
      const artworkIndex = filteredArtworks.findIndex(a => a.id === returnToArtworkId);
      if (artworkIndex !== -1) {
        // 작품이 있는 페이지 계산 (1-based)
        const targetPage = Math.ceil((artworkIndex + 1) / ITEMS_PER_PAGE);
        
        // 페이지가 다르면 변경
        if (targetPage !== currentPage) {
          setCurrentPage(targetPage);
        }
        
        // 페이지가 변경된 후 스크롤 (약간의 지연 필요)
        const scrollTimeout = setTimeout(() => {
          const element = artworkRefs.current[returnToArtworkId];
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // URL에서 returnToArtworkId 쿼리 파라미터 제거
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete('returnToArtworkId');
            setSearchParams(newSearchParams, { replace: true });
          }
        }, 300);
        
        return () => clearTimeout(scrollTimeout);
      }
    }
  }, [filteredArtworks, loading, searchParams, currentPage, setSearchParams]);

  const paginatedArtworks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArtworks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredArtworks, currentPage]);

  const totalPages = Math.ceil(filteredArtworks.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    const nextPage = Math.min(currentPage + 1, totalPages);
    setCurrentPage(nextPage);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', nextPage.toString());
    setSearchParams(newSearchParams, { replace: true });
  };

  const handlePrevPage = () => {
    const prevPage = Math.max(currentPage - 1, 1);
    setCurrentPage(prevPage);
    const newSearchParams = new URLSearchParams(searchParams);
    if (prevPage === 1) {
      newSearchParams.delete('page');
    } else {
      newSearchParams.set('page', prevPage.toString());
    }
    setSearchParams(newSearchParams, { replace: true });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-32 text-center">
        <Loader2 className="size-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-lg text-muted-foreground">갤러리를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header - Minimal */}
      <section className="py-20 bg-background border-b border-border/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-16 h-px bg-primary/50 mx-auto mb-8" />
              <h1 className="text-5xl md:text-6xl font-light text-foreground tracking-tight mb-6">
                Gallery
              </h1>
              <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                현대미술의 다양한 시각과 감성을 담은 작품들을 만나보세요.<br />
                각 작품이 전하는 고유한 이야기를 발견해보세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid - Minimal Style */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="text-3xl font-light text-foreground mb-6 md:mb-0">All Artworks</h2>
            <div className="w-full md:w-auto md:max-w-xs">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="작품을 검색하세요"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on new search
                  }}
                  className="pl-10 w-full bg-card border-border focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {paginatedArtworks.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-16 h-16 border border-border rounded-full flex items-center justify-center mx-auto mb-8">
                <ImageIcon className="size-6 text-muted-foreground" />
              </div>
              <p className="text-xl font-light text-foreground mb-4">
                {searchTerm ? 'No results found.' : 'Coming Soon'}
              </p>
              <p className="text-sm text-muted-foreground font-light">
                {searchTerm ? 'Try a different search term.' : 'New artworks will be available soon.'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {paginatedArtworks.map((artwork) => (
                  <div
                    key={artwork.id}
                    ref={(el) => (artworkRefs.current[artwork.id] = el)}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/artwork/${artwork.id}?fromPage=${currentPage}`)}
                  >
                    {/* Image Container */}
                    {artwork.imageUrl ? (
                      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-800 mb-6 rounded-sm border border-neutral-700/50">
                        <img
                          src={artwork.imageUrl}
                          alt={artwork.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Subtle overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

                        {/* Action button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const originalIndex = artworks.findIndex(a => a.id === artwork.id);
                            openLightboxOnSlide(originalIndex + 1);
                          }}
                          className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                          title="Zoom In"
                        >
                          <Eye className="size-4 text-neutral-900" />
                        </button>
                      </div>
                    ) : (
                      <div className="aspect-[3/4] bg-neutral-800 flex items-center justify-center mb-6 rounded-sm border border-neutral-700/50">
                        <ImageIcon className="size-12 text-neutral-600" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="space-y-3 text-center bg-neutral-900/50 p-4 rounded-sm">
                      <h3 className="text-lg font-medium text-neutral-100 tracking-wide group-hover:text-primary transition-colors">
                        {artwork.title}
                      </h3>
                      <div className="flex items-center justify-center gap-3 text-sm text-neutral-400 font-light">
                        <span>{artwork.year}</span>
                        <div className="w-px h-3 bg-neutral-700" />
                        <span>{artwork.medium}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-16">
                  <Button onClick={handlePrevPage} disabled={currentPage === 1} variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                    이전 페이지
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {currentPage} / {totalPages}
                  </span>
                  <Button onClick={handleNextPage} disabled={currentPage === totalPages} variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                    다음 페이지
                  </Button>
                </div>
              )}
            </>
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