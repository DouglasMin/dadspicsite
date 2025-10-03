import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, type Artwork } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Ruler, Palette, AlertCircle, Share2, Heart } from 'lucide-react';
import FsLightbox from 'fslightbox-react';

export function ArtworkDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxToggler, setLightboxToggler] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!id) return;

      try {
        const data = await api.getArtwork(id);
        setArtwork(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '작품을 불러오는데 실패했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: artwork?.title,
          text: `${artwork?.title} - YH Art Lab`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('공유 취소됨');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-neutral-500 font-light">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-16 h-16 border border-neutral-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="size-6 text-neutral-400" />
          </div>
          <h1 className="text-xl font-light text-neutral-900 mb-2">
            작품을 찾을 수 없습니다
          </h1>
          <p className="text-sm text-neutral-500 font-light mb-8">
            요청하신 작품이 존재하지 않거나 삭제되었습니다.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate('/gallery')}
            className="font-light"
          >
            <ArrowLeft className="mr-2 size-4" />
            갤러리로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile-First Header */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/gallery')}
              className="p-2 hover:bg-neutral-100 rounded-full"
            >
              <ArrowLeft className="size-5 text-neutral-600" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 hover:bg-neutral-100 rounded-full"
              >
                <Heart className={`size-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-neutral-600'}`} />
              </Button>
              <Button
                variant="ghost"
                onClick={handleShare}
                className="p-2 hover:bg-neutral-100 rounded-full"
              >
                <Share2 className="size-5 text-neutral-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image Section */}
      <section className="relative">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Main Image */}
            <div 
              className="relative aspect-[4/5] md:aspect-[3/2] overflow-hidden bg-neutral-100 cursor-pointer group"
              onClick={() => setLightboxToggler(!lightboxToggler)}
            >
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Zoom indicator */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                  <div className="w-6 h-6 border-2 border-neutral-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-neutral-600 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-[2fr_1fr] gap-12">
              {/* Main Content */}
              <div className="space-y-8">
                {/* Title & Basic Info */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-light text-neutral-900 leading-tight mb-4">
                      {artwork.title}
                    </h1>
                    <div className="w-16 h-px bg-neutral-300 mb-6" />
                  </div>

                  {/* Meta Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-neutral-500">
                        <Calendar className="size-4" />
                        <span className="text-xs font-light tracking-wide uppercase">Year</span>
                      </div>
                      <p className="text-lg font-light text-neutral-900">{artwork.year}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-neutral-500">
                        <Palette className="size-4" />
                        <span className="text-xs font-light tracking-wide uppercase">Medium</span>
                      </div>
                      <p className="text-lg font-light text-neutral-900">{artwork.medium}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-neutral-500">
                        <Ruler className="size-4" />
                        <span className="text-xs font-light tracking-wide uppercase">Size</span>
                      </div>
                      <p className="text-lg font-light text-neutral-900">{artwork.dimensions}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <div className="w-12 h-px bg-neutral-300" />
                  <div className="prose prose-neutral max-w-none">
                    <p className="text-base text-neutral-700 font-light leading-relaxed whitespace-pre-line">
                      {artwork.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Contact CTA */}
                <div className="bg-neutral-50 p-8 space-y-4">
                  <h3 className="text-lg font-light text-neutral-900">
                    작품 문의
                  </h3>
                  <p className="text-sm text-neutral-600 font-light leading-relaxed">
                    이 작품에 대해 더 자세한 정보가 필요하시거나 구매를 원하신다면 언제든 연락주세요.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/contact')}
                    className="w-full font-light border-neutral-300 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300"
                  >
                    문의하기
                  </Button>
                </div>

                {/* Back to Gallery */}
                <div className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/gallery')}
                    className="text-neutral-500 hover:text-neutral-900 font-light px-0"
                  >
                    ← 갤러리로 돌아가기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <FsLightbox
        toggler={lightboxToggler}
        sources={[artwork.imageUrl]}
      />
    </div>
  );
}