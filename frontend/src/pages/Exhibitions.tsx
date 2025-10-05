import { useEffect, useState } from 'react';
import { api, type Exhibition } from '@/lib/api';
import { Loader2, Calendar, MapPin, Image as ImageIcon } from 'lucide-react';

export function Exhibitions() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const data = await api.getExhibitions();
        if (Array.isArray(data)) {
          // Sort by start date (earliest first for upcoming, latest first for past)
          const sorted = data.sort((a, b) => {
            const now = new Date();
            const aStart = new Date(a.startDate);
            const bStart = new Date(b.startDate);
            
            // Both upcoming: sort by earliest first
            if (aStart > now && bStart > now) {
              return aStart.getTime() - bStart.getTime();
            }
            
            // Both past or ongoing: sort by latest first
            return bStart.getTime() - aStart.getTime();
          });
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
    <div className="min-h-screen bg-white">
      {/* Page Header - Minimal */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-16 h-px bg-neutral-300 mx-auto mb-8" />
              <h1 className="text-5xl md:text-6xl font-light text-neutral-900 tracking-tight mb-6">
                Exhibitions
              </h1>
              <p className="text-lg text-neutral-600 font-light leading-relaxed max-w-2xl mx-auto">
                현재 진행 중인 전시회와 예정된 전시 일정을 확인하세요.<br />
                각 전시회는 독특한 주제와 작품들로 구성되어 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exhibitions Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-6">
          {exhibitions.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-16 h-16 border border-neutral-200 rounded-full flex items-center justify-center mx-auto mb-8">
                <Calendar className="size-6 text-neutral-400" />
              </div>
              <p className="text-xl font-light text-neutral-600 mb-4">Coming Soon</p>
              <p className="text-sm text-neutral-400 font-light">
                새로운 전시회가 곧 공개될 예정입니다
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Now Showing */}
              {ongoingExhibitions.length > 0 && (
                <div>
                  <div className="mb-12">
                    <div className="flex items-center gap-8 mb-8">
                      <div className="w-12 h-px bg-neutral-300" />
                      <h2 className="text-2xl md:text-3xl font-light text-neutral-900 tracking-wide">
                        Now Showing
                      </h2>
                      <div className="flex-1 h-px bg-neutral-300" />
                    </div>
                  </div>

                  <div className="space-y-16">
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
                  <div className="mb-12">
                    <div className="flex items-center gap-8 mb-8">
                      <div className="w-12 h-px bg-neutral-300" />
                      <h2 className="text-2xl md:text-3xl font-light text-neutral-900 tracking-wide">
                        Upcoming
                      </h2>
                      <div className="flex-1 h-px bg-neutral-300" />
                    </div>
                  </div>

                  <div className="space-y-16">
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
                  <div className="mb-12">
                    <div className="flex items-center gap-8 mb-8">
                      <div className="w-12 h-px bg-neutral-300" />
                      <h2 className="text-2xl md:text-3xl font-light text-neutral-500 tracking-wide">
                        Past Exhibitions
                      </h2>
                      <div className="flex-1 h-px bg-neutral-300" />
                    </div>
                  </div>

                  <div className="space-y-16">
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
    <div className={`transition-all duration-500 ${status === 'past' ? 'opacity-60 hover:opacity-100' : ''}`}>
      <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 md:gap-12 items-start">
        {/* Image */}
        <div className="relative order-1">
          {exhibition.imageUrl ? (
            <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
              <img
                src={exhibition.imageUrl}
                alt={exhibition.title}
                className="w-full h-full object-cover"
              />
              
              {/* Status badge */}
              {status === 'ongoing' && (
                <div className="absolute top-6 left-6">
                  <div className="px-4 py-2 bg-neutral-900 text-white text-xs font-light tracking-wide uppercase">
                    전시회 진행중
                  </div>
                </div>
              )}
              {status === 'upcoming' && (
                <div className="absolute top-6 left-6">
                  <div className="px-4 py-2 bg-neutral-600 text-white text-xs font-light tracking-wide uppercase">
                    Coming Soon
                  </div>
                </div>
              )}
              {status === 'past' && (
                <div className="absolute top-6 left-6">
                  <div className="px-4 py-2 bg-neutral-400 text-white text-xs font-light tracking-wide uppercase">
                    마감된 전시회
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-[4/3] bg-neutral-100 flex items-center justify-center">
              <ImageIcon className="size-12 text-neutral-300" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-6 md:space-y-8 order-2">
          <div className="space-y-4 md:space-y-6">
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-neutral-900 leading-tight mb-3 md:mb-4">
                {exhibition.title}
              </h3>
              <div className="w-12 md:w-16 h-px bg-neutral-300 mb-4 md:mb-6" />
            </div>

            {/* Meta Information */}
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="size-4 text-neutral-500 mt-1 shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-light tracking-wide uppercase text-neutral-500">
                    Exhibition Period
                  </p>
                  <p className="text-sm md:text-base font-light text-neutral-900">
                    {new Date(exhibition.startDate).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    {' - '}
                    {new Date(exhibition.endDate).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
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
          </div>

          {/* Description */}
          <div className="space-y-3 md:space-y-4">
            <div className="w-12 h-px bg-neutral-300" />
            <p className="text-sm md:text-base text-neutral-700 font-light leading-relaxed whitespace-pre-line">
              {exhibition.description}
            </p>
          </div>

          {/* Artwork count */}
          {exhibition.artworkIds && exhibition.artworkIds.length > 0 && (
            <div className="pt-4 border-t border-neutral-200">
              <p className="text-sm text-neutral-500 font-light">
                {exhibition.artworkIds.length}점의 작품 전시
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}