import { ExternalLink } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';

interface NewsItem {
    id: string;
    title: string;
    source: string;
    date: string;
    url: string;
    description?: string;
    thumbnailUrl?: string;
}

// 뉴스 데이터 - 여기에 새로운 뉴스를 추가하세요
const newsItems: NewsItem[] = [
    {
        id: '1',
        title: '민유홍 작가, 혈액학 전문의에서 화가로의 변신',
        source: '의학신문',
        date: '2025.10.31',
        url: 'http://www.bosa.co.kr/news/articleView.html?idxno=2261345',
        description: '40년 의사 생활을 마치고 새로운 예술 여정을 시작한 민유홍 작가의 이야기',
        thumbnailUrl: 'https://cdn.bosa.co.kr/news/photo/202510/2261345_295609_5113.jpg'
    },
    // 새로운 뉴스는 여기에 추가하세요
    // {
    //   id: '2',
    //   title: '새로운 뉴스 제목',
    //   source: '언론사명',
    //   date: 'YYYY.MM.DD',
    //   url: 'https://...',
    //   description: '간단한 설명 (선택사항)',
    //   thumbnailUrl: 'https://...' // 기사 썸네일 URL (선택사항)
    // },
];

export function RecentNews() {
    if (newsItems.length === 0) {
        return null;
    }

    return (
        <section className="shell py-[var(--space-section)]">
            <Reveal>
                <SectionHeading index="03" kicker="Press & Media" title="최근 소식" />
                <p className="text-body mt-6 max-w-xl text-ink-soft">
                    언론에 소개된 작가의 이야기와 전시 소식을 만나보세요
                </p>
            </Reveal>

            <ul className="mt-[var(--space-block)] border-t border-rule">
                {newsItems.map((news, index) => (
                    <li key={news.id} className="border-b border-rule">
                        <Reveal delay={index * 60}>
                            <a
                                href={news.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="press-item group grid items-start gap-x-[var(--gutter)] gap-y-5 py-8 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:gap-x-12"
                            >
                                {news.thumbnailUrl && (
                                    <div className="press-thumb aspect-[16/10]">
                                        <img
                                            src={news.thumbnailUrl}
                                            alt=""
                                            loading="lazy"
                                            decoding="async"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className={news.thumbnailUrl ? '' : 'md:col-span-2'}>
                                    <div className="flex items-center gap-3">
                                        <span className="label-sm">{news.source}</span>
                                        <span
                                            className="h-px w-5 bg-rule"
                                            aria-hidden="true"
                                        />
                                        <time className="text-meta tabular-nums text-ink-faint">
                                            {news.date}
                                        </time>
                                    </div>

                                    <h3 className="font-serif text-h3 mt-4 leading-snug font-normal text-ink transition-colors duration-200 ease-out group-hover:text-ink-soft">
                                        {news.title}
                                    </h3>

                                    {news.description && (
                                        <p className="text-meta mt-4 leading-relaxed text-ink-soft">
                                            {news.description}
                                        </p>
                                    )}

                                    <span className="arrow-link text-meta mt-6">
                                        기사 읽기
                                        <ExternalLink className="size-4" />
                                    </span>
                                </div>
                            </a>
                        </Reveal>
                    </li>
                ))}
            </ul>
        </section>
    );
}
