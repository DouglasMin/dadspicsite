import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type Exhibition } from '@/lib/api';
import { Loader2, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { PageMasthead, SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';

type ExhibitionStatus = 'ongoing' | 'upcoming' | 'past';

const STATUS_LABEL: Record<ExhibitionStatus, string> = {
  ongoing: '전시회 진행중',
  upcoming: 'Coming Soon',
  past: '마감된 전시회',
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

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
      <div className="shell py-32 text-center">
        <Loader2 className="mx-auto mb-5 size-8 animate-spin text-ink-faint" />
        <p className="text-meta tracking-wide text-ink-soft">전시회를 불러오는 중...</p>
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

  const groups = [
    { key: 'ongoing' as const, title: 'Now Showing', items: ongoingExhibitions },
    { key: 'upcoming' as const, title: 'Upcoming', items: upcomingExhibitions },
    { key: 'past' as const, title: 'Past Exhibitions', items: pastExhibitions },
  ].filter((group) => group.items.length > 0);

  return (
    <div className="min-h-screen bg-wall pb-[var(--space-section)]">
      <PageMasthead
        title="Exhibitions"
        aside={
          <div>
            <p className="font-serif text-h2 leading-none text-ink">
              {exhibitions.length}
            </p>
            <p className="label-sm mt-2">Shows</p>
          </div>
        }
      >
        현재 진행 중인 전시회와 예정된 전시 일정을 확인하세요.
        <br />각 전시회는 독특한 주제와 작품들로 구성되어 있습니다.
      </PageMasthead>

      {exhibitions.length === 0 ? (
        <div className="shell py-32 text-center">
          <p className="font-serif text-h2 font-normal text-ink">Coming Soon</p>
          <p className="text-meta mt-4 text-ink-soft">
            새로운 전시회가 곧 공개될 예정입니다
          </p>
        </div>
      ) : (
        <div className="mt-[var(--space-section)] space-y-[var(--space-section)]">
          {groups.map((group, groupIndex) => (
            <section key={group.key} className="shell">
              <Reveal>
                <SectionHeading
                  index={String(groupIndex + 1).padStart(2, '0')}
                  kicker={`${group.items.length} ${
                    group.items.length === 1 ? 'Show' : 'Shows'
                  }`}
                  title={group.title}
                  className={group.key === 'past' ? 'opacity-70' : undefined}
                />
              </Reveal>

              <div className="mt-[var(--space-block)] space-y-[var(--space-section)]">
                {group.items.map((exhibition, index) => (
                  <ExhibitionRow
                    key={exhibition.id}
                    exhibition={exhibition}
                    status={group.key}
                    reversed={index % 2 === 1}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function ExhibitionRow({
  exhibition,
  status,
  reversed,
}: {
  exhibition: Exhibition;
  status: ExhibitionStatus;
  reversed: boolean;
}) {
  const detailPath = `/exhibitions/${exhibition.id}`;

  return (
    <Reveal
      as="article"
      className={status === 'past' ? 'opacity-75' : undefined}
    >
      <div className="grid items-start gap-x-[var(--gutter)] gap-y-8 md:grid-cols-[0.85fr_1.15fr] md:gap-x-16">
        {/* Poster */}
        <Link
          to={detailPath}
          className={`art group block ${reversed ? 'md:order-2' : ''}`}
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="art-plate aspect-[3/4] bg-wall-shade">
            {exhibition.imageUrl ? (
              <img
                src={exhibition.imageUrl}
                alt=""
                loading="lazy"
                decoding="async"
                className="art-img"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageIcon className="size-10 text-ink-faint" />
              </div>
            )}
          </div>
        </Link>

        {/* Details */}
        <div className={reversed ? 'md:order-1' : ''}>
          <div className="flex items-center gap-2.5">
            {status === 'ongoing' && (
              <span className="signal-dot" aria-hidden="true" />
            )}
            <span
              className={`label-sm ${
                status === 'ongoing' ? 'text-signal' : ''
              }`}
            >
              {STATUS_LABEL[status]}
            </span>
          </div>

          <h3 className="font-serif text-h2 mt-4 leading-tight font-normal">
            <Link
              to={detailPath}
              className="text-ink transition-colors duration-200 ease-out hover:text-ink-soft"
            >
              {exhibition.title}
            </Link>
          </h3>

          <div className="mt-6 h-px w-full bg-rule" aria-hidden="true" />

          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="label-sm">Exhibition Period</dt>
              <dd className="text-meta mt-2 text-ink">
                {formatDate(exhibition.startDate)}
                {' – '}
                {formatDate(exhibition.endDate)}
              </dd>
            </div>
            <div>
              <dt className="label-sm">Location</dt>
              <dd className="text-meta mt-2 text-ink">{exhibition.location}</dd>
            </div>
          </dl>

          {exhibition.description && (
            <p className="text-body mt-7 whitespace-pre-line text-ink-soft">
              {exhibition.description}
            </p>
          )}

          <div className="mt-8 flex items-center justify-between gap-4 border-t border-rule pt-5">
            <p className="text-meta text-ink-faint">
              {exhibition.artworkIds && exhibition.artworkIds.length > 0
                ? `${exhibition.artworkIds.length}점의 작품 전시`
                : ''}
            </p>
            <Link to={detailPath} className="arrow-link text-meta shrink-0">
              자세히 보기
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
