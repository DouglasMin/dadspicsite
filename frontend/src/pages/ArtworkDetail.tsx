import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, type Artwork } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Calendar, Ruler, Palette, DollarSign, Tag, AlertCircle } from 'lucide-react';

export function ArtworkDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-32 text-center">
        <Loader2 className="size-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-lg text-muted-foreground">작품 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-32 text-center">
        <AlertCircle className="size-16 text-destructive mx-auto mb-4" />
        <p className="text-xl text-destructive mb-2">
          {error || '작품을 찾을 수 없습니다'}
        </p>
        <p className="text-muted-foreground mb-6">
          찾으시는 작품이 존재하지 않거나 삭제되었습니다.
        </p>
        <Button onClick={() => navigate('/gallery')}>
          <ArrowLeft className="mr-2 size-4" />
          갤러리로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4 lg:px-6 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/gallery')}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="mr-2 size-4" />
            갤러리로 돌아가기
          </Button>
        </div>
      </div>

      {/* Artwork Detail */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-2 shadow-2xl bg-muted">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />

                {/* Status Badge */}
                {artwork.status === 'sold' && (
                  <div className="absolute top-6 right-6">
                    <span className="px-4 py-2 bg-destructive text-white text-sm font-bold rounded-full shadow-lg">
                      판매완료
                    </span>
                  </div>
                )}
                {artwork.status === 'available' && (
                  <div className="absolute top-6 right-6">
                    <span className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-full shadow-lg">
                      판매가능
                    </span>
                  </div>
                )}
              </div>

              {/* Image Caption */}
              <p className="text-sm text-muted-foreground text-center italic">
                {artwork.title} ({artwork.year})
              </p>
            </div>

            {/* Details Section */}
            <div className="space-y-8">
              {/* Title & Meta */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  {artwork.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-lg text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-5" />
                    <span>{artwork.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette className="size-5" />
                    <span>{artwork.medium}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="size-5" />
                    <span>{artwork.dimensions}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">작품 소개</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line leading-relaxed text-base">
                    {artwork.description}
                  </p>
                </CardContent>
              </Card>

              {/* Details Card */}
              <Card className="border-2 bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-xl">상세 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Tag className="size-4" />
                        <span className="font-medium">상태</span>
                      </div>
                      <span className="font-semibold capitalize">
                        {artwork.status === 'not_for_sale' ? '비매품' : artwork.status === 'sold' ? '판매완료' : artwork.status === 'available' ? '판매가능' : artwork.status}
                      </span>
                    </div>

                    {artwork.price && artwork.status === 'available' && (
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="size-4" />
                          <span className="font-medium">가격</span>
                        </div>
                        <span className="text-2xl font-bold text-primary">
                          ${artwork.price.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              {artwork.status === 'available' && (
                <Card className="border-2 border-primary/50 bg-primary/5">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-2">이 작품에 관심이 있으신가요?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      구매 또는 직접 감상에 대해 더 알아보려면 문의해 주세요.
                    </p>
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() => navigate('/contact')}
                    >
                      작품 문의하기
                    </Button>
                  </CardContent>
                </Card>
              )}

              {artwork.status === 'sold' && (
                <Card className="border-2 border-muted">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground text-center">
                      이 작품은 판매되었습니다. 갤러리에서 구매 가능한 다른 작품을 둘러보세요.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}