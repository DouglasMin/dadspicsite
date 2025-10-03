import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, type Artwork } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Calendar, Palette, Ruler } from 'lucide-react';

export function ArtworkDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!id) return;
      
      try {
        const data = await api.getArtwork(id);
        setArtwork(data);
      } catch (err) {
        console.error('작품을 불러오는데 실패했습니다:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-32 text-center">
        <Loader2 className="size-12 animate-spin text-neutral-900 mx-auto mb-4" />
        <p className="text-lg text-neutral-600 font-light">작품을 불러오는 중...</p>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-32 text-center">
        <p className="text-xl text-neutral-600 font-light mb-8">작품을 찾을 수 없습니다</p>
        <Button
          variant="outline"
          onClick={() => navigate('/gallery')}
          className="font-light"
        >
          <ArrowLeft className="size-4 mr-2" />
          갤러리로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-6 lg:px-12 pt-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/gallery')}
          className="font-light text-neutral-600 hover:text-neutral-900 px-0"
        >
          <ArrowLeft className="size-4 mr-2" />
          갤러리로 돌아가기
        </Button>
      </div>

      {/* Artwork Detail */}
      <section className="py-12">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              {/* Image */}
              <div className="relative">
                <div className="aspect-[3/4] bg-neutral-100 overflow-hidden">
                  {artwork.imageUrl ? (
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Palette className="size-16 text-neutral-300" />
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-8">
                <div>
                  <div className="w-12 h-px bg-neutral-300 mb-6" />
                  <h1 className="text-4xl md:text-5xl font-light text-neutral-900 tracking-tight mb-6">
                    {artwork.title}
                  </h1>
                </div>

                {/* Metadata */}
                <div className="space-y-4">
                  {artwork.year && (
                    <div className="flex items-center gap-3 text-neutral-700">
                      <Calendar className="size-5 text-neutral-400" />
                      <span className="font-light">{artwork.year}</span>
                    </div>
                  )}
                  
                  {artwork.medium && (
                    <div className="flex items-center gap-3 text-neutral-700">
                      <Palette className="size-5 text-neutral-400" />
                      <span className="font-light">{artwork.medium}</span>
                    </div>
                  )}
                  
                  {artwork.dimensions && (
                    <div className="flex items-center gap-3 text-neutral-700">
                      <Ruler className="size-5 text-neutral-400" />
                      <span className="font-light">{artwork.dimensions}</span>
                    </div>
                  )}
                </div>

                <div className="w-full h-px bg-neutral-200" />

                {/* Description */}
                {artwork.description && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-light text-neutral-900 tracking-wide">
                      작품 설명
                    </h2>
                    <p className="text-base text-neutral-700 font-light leading-relaxed whitespace-pre-wrap">
                      {artwork.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
