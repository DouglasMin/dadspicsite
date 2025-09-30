import { useEffect, useState } from 'react';
import { api, type Exhibition } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Calendar, MapPin, Clock, Image as ImageIcon } from 'lucide-react';

export function Exhibitions() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const data = await api.getExhibitions();
        if (Array.isArray(data)) {
          // Sort by start date (newest first)
          const sorted = data.sort((a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
          setExhibitions(sorted);
        } else {
          setExhibitions([]);
        }
      } catch (err) {
        console.error('전시회를 불러오는데 실패했습니다:', err);
        setExhibitions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitions();
  }, []);

  const isUpcoming = (startDate: string) => new Date(startDate) > new Date();
  const isOngoing = (startDate: string, endDate: string) => {
    const now = new Date();
    return new Date(startDate) <= now && new Date(endDate) >= now;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-32 text-center">
        <Loader2 className="size-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-lg text-muted-foreground">전시회를 불러오는 중...</p>
      </div>
    );
  }

  const ongoingExhibitions = exhibitions.filter((e) =>
    isOngoing(e.startDate, e.endDate)
  );
  const upcomingExhibitions = exhibitions.filter((e) => isUpcoming(e.startDate));
  const pastExhibitions = exhibitions.filter(
    (e) => !isUpcoming(e.startDate) && !isOngoing(e.startDate, e.endDate)
  );

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 lg:px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">전시회</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            현대미술 작품을 선보이는 현재 및 예정된 전시회를 만나보세요
          </p>
        </div>
      </section>

      {/* Exhibitions Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-6">
          {exhibitions.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="size-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-xl text-muted-foreground mb-2">아직 예정된 전시회가 없습니다</p>
              <p className="text-sm text-muted-foreground">
                곧 있을 전시회 소식을 위해 다시 방문해 주세요
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Now Showing */}
              {ongoingExhibitions.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-px flex-1 bg-border" />
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Clock className="size-6 text-primary" />
                      현재 전시중
                    </h2>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <div className="space-y-8">
                    {ongoingExhibitions.map((exhibition) => (
                      <ExhibitionCard
                        key={exhibition.id}
                        exhibition={exhibition}
                        status="ongoing"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming */}
              {upcomingExhibitions.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-px flex-1 bg-border" />
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Calendar className="size-6 text-primary" />
                      예정된 전시회
                    </h2>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <div className="space-y-8">
                    {upcomingExhibitions.map((exhibition) => (
                      <ExhibitionCard
                        key={exhibition.id}
                        exhibition={exhibition}
                        status="upcoming"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Past Exhibitions */}
              {pastExhibitions.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-px flex-1 bg-border" />
                    <h2 className="text-2xl font-bold text-muted-foreground">
                      지난 전시회
                    </h2>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <div className="space-y-8">
                    {pastExhibitions.map((exhibition) => (
                      <ExhibitionCard
                        key={exhibition.id}
                        exhibition={exhibition}
                        status="past"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ExhibitionCard({
  exhibition,
  status,
}: {
  exhibition: Exhibition;
  status: 'ongoing' | 'upcoming' | 'past';
}) {
  return (
    <Card
      className={`border-2 overflow-hidden transition-all duration-300 ${
        status === 'ongoing'
          ? 'border-primary/50 shadow-lg'
          : status === 'upcoming'
          ? 'hover:border-primary/30 hover:shadow-lg'
          : 'opacity-75 hover:opacity-100'
      }`}
    >
      <div className="grid lg:grid-cols-[400px_1fr] gap-0">
        {/* Image */}
        {exhibition.imageUrl ? (
          <div className="relative aspect-video lg:aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={exhibition.imageUrl}
              alt={exhibition.title}
              className="w-full h-full object-cover"
            />
            {status === 'ongoing' && (
              <div className="absolute top-4 left-4">
                <span className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-full shadow-lg">
                  전시중
                </span>
              </div>
            )}
            {status === 'upcoming' && (
              <div className="absolute top-4 left-4">
                <span className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-bold rounded-full shadow-lg">
                  예정
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-video lg:aspect-[4/3] bg-muted flex items-center justify-center">
            <ImageIcon className="size-16 text-muted-foreground opacity-30" />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col">
          <CardHeader className="space-y-4">
            <div>
              <CardTitle className="text-3xl mb-3">{exhibition.title}</CardTitle>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-4 shrink-0" />
                  <CardDescription className="text-base">
                    {new Date(exhibition.startDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    {' - '}
                    {new Date(exhibition.endDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-4 shrink-0" />
                  <p className="text-sm font-medium">{exhibition.location}</p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1">
            <p className="text-base leading-relaxed whitespace-pre-line">
              {exhibition.description}
            </p>

            {exhibition.artworkIds && exhibition.artworkIds.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {exhibition.artworkIds.length}점의 작품 전시
                </p>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  );
}