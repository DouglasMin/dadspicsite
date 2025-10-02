import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, type Artwork } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Image as ImageIcon } from 'lucide-react';

export function Gallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 lg:px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            아트 갤러리
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            엄선된 현대미술 작품 컬렉션을 만나보세요. 각 작품은 고유한 이야기를 담고 있습니다.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-6">
          {artworks.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="size-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-xl text-muted-foreground mb-2">아직 등록된 작품이 없습니다</p>
              <p className="text-sm text-muted-foreground">
                곧 새로운 작품이 추가될 예정이니 다시 방문해 주세요
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {artworks.map((artwork) => (
                <Card
                  key={artwork.id}
                  className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 overflow-hidden"
                  onClick={() => navigate(`/artwork/${artwork.id}`)}
                >
                  {/* Image Container */}
                  {artwork.imageUrl ? (
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />


                    </div>
                  ) : (
                    <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                      <ImageIcon className="size-16 text-muted-foreground opacity-30" />
                    </div>
                  )}

                  {/* Content */}
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                      {artwork.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {artwork.year} • {artwork.medium}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {artwork.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}