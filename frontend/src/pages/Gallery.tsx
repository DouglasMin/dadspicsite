import { useEffect, useState, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, type Artwork } from '@/lib/api';

import { Loader2, Search, ArrowLeft, ArrowRight } from 'lucide-react';
import FsLightbox from 'fslightbox-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PageMasthead } from '@/components/SectionHeading';
import { ArtworkCard } from '@/components/ArtworkCard';
import { Reveal } from '@/components/Reveal';

const ITEMS_PER_PAGE = 9;

/**
 * Salon hang. Six placements repeat across a 12-column grid so no two
 * neighbours share a width, and every second work drops below its partner's
 * top edge. Combined with each painting's true proportions this gives the
 * page a wall rhythm instead of a card grid.
 */
const HANG = [
  'md:col-start-1 md:col-span-5',
  'md:col-start-7 md:col-span-6 md:mt-[clamp(2rem,6vw,7rem)]',
  'md:col-start-2 md:col-span-4',
  'md:col-start-8 md:col-span-5 md:mt-[clamp(1.5rem,4vw,5rem)]',
  'md:col-start-1 md:col-span-6',
  'md:col-start-8 md:col-span-4 md:mt-[clamp(2rem,7vw,8rem)]',
];

export function Gallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: 1
  });
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

  // 라이트박스는 이미지가 있는 작품만 표시하므로 슬라이드 번호도 같은 목록을 기준으로 계산
  const lightboxSources = useMemo(
    () => artworks.filter(artwork => artwork.imageUrl).map(artwork => artwork.imageUrl),
    [artworks]
  );

  // URL 쿼리 파라미터에서 페이지 정보 읽기
  // returnToArtworkId가 있으면 작품 ID로 페이지를 찾으므로 page 파라미터는 무시
  useEffect(() => {
    const returnToArtworkId = searchParams.get('returnToArtworkId');
    if (returnToArtworkId) {
      // returnToArtworkId가 있으면 작품 ID로 페이지를 찾는 로직이 처리함
      return;
    }

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
      <div className="shell py-32 text-center">
        <Loader2 className="mx-auto mb-5 size-8 animate-spin text-ink-faint" />
        <p className="text-meta tracking-wide text-ink-soft">갤러리를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wall pb-[var(--space-section)]">
      <PageMasthead
        title="Gallery"
        aside={
          <div>
            <p className="font-serif text-h2 leading-none text-ink">
              {artworks.length}
            </p>
            <p className="label-sm mt-2">Works</p>
          </div>
        }
      >
        현대미술의 다양한 시각과 감성을 담은 작품들을 만나보세요.
        <br />각 작품이 전하는 고유한 이야기를 발견해보세요.
      </PageMasthead>

      {/* Filter bar */}
      <div className="shell mt-[var(--space-block)]">
        <div className="flex flex-col gap-5 border-b border-rule pb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <h2 className="font-serif text-h3 font-normal text-ink">
            All Artworks
          </h2>

          <div className="relative w-full sm:max-w-xs">
            <Search
              className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-ink-faint"
              aria-hidden="true"
            />
            <Input
              type="search"
              aria-label="작품 검색"
              placeholder="작품을 검색하세요"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on new search
              }}
              className="h-10 rounded-none border-0 border-b border-transparent bg-transparent pl-7 text-meta shadow-none transition-colors duration-200 ease-out placeholder:text-ink-faint focus-visible:border-ink focus-visible:ring-0"
            />
          </div>
        </div>
      </div>

      {paginatedArtworks.length === 0 ? (
        <div className="shell py-32 text-center">
          <p className="font-serif text-h2 font-normal text-ink">
            {searchTerm ? 'No results found.' : 'Coming Soon'}
          </p>
          <p className="text-meta mt-4 text-ink-soft">
            {searchTerm ? 'Try a different search term.' : 'New artworks will be available soon.'}
          </p>
        </div>
      ) : (
        <>
          <div className="shell mt-[var(--space-block)]">
            <div className="grid grid-cols-1 items-start gap-x-[var(--gutter)] gap-y-[clamp(3.5rem,2rem+5vw,7rem)] md:grid-cols-12">
              {paginatedArtworks.map((artwork, index) => (
                <div
                  key={artwork.id}
                  ref={(el) => { artworkRefs.current[artwork.id] = el; }}
                  className={`${HANG[index % HANG.length]} ${
                    index % 3 === 2 ? 'max-md:mx-8' : ''
                  }`}
                >
                  <Reveal delay={(index % 3) * 60}>
                    <ArtworkCard
                      artwork={artwork}
                      to={`/artwork/${artwork.id}?fromPage=${currentPage}`}
                      priority={index < 2}
                      onZoom={
                        artwork.imageUrl
                          ? () => {
                              const slide = lightboxSources.indexOf(artwork.imageUrl);
                              if (slide !== -1) openLightboxOnSlide(slide + 1);
                            }
                          : undefined
                      }
                    />
                  </Reveal>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="shell mt-[var(--space-section)]">
              <div className="flex items-center justify-between gap-4 border-t border-rule pt-8">
                <Button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  variant="ghost"
                  className="pressable text-meta h-auto rounded-none px-0 font-normal text-ink hover:bg-transparent hover:text-ink-soft disabled:opacity-30"
                >
                  <ArrowLeft className="size-4" />
                  이전 페이지
                </Button>

                <p className="font-serif text-lg text-ink-soft tabular-nums">
                  <span className="text-ink">
                    {String(currentPage).padStart(2, '0')}
                  </span>
                  <span className="mx-2 text-ink-faint">/</span>
                  {String(totalPages).padStart(2, '0')}
                </p>

                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  variant="ghost"
                  className="pressable text-meta h-auto rounded-none px-0 font-normal text-ink hover:bg-transparent hover:text-ink-soft disabled:opacity-30"
                >
                  다음 페이지
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Lightbox */}
      <FsLightbox
        toggler={lightboxController.toggler}
        sources={lightboxSources}
        slide={lightboxController.slide}
        type="image"
      />
    </div>
  );
}
