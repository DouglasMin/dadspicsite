import { ExternalLink, Newspaper, TrendingUp } from 'lucide-react';

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
        <section className="relative py-32 bg-gradient-to-b from-background via-card/20 to-background overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative">
                <div className="max-w-6xl mx-auto">
                    {/* Enhanced Section header */}
                    <div className="mb-20 text-center">
                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
                            <TrendingUp className="size-4 text-primary" />
                            <span className="text-sm font-medium text-primary tracking-wide">PRESS & MEDIA</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4 tracking-tight">
                            최근 소식
                        </h2>

                        <p className="text-muted-foreground font-light max-w-2xl mx-auto">
                            언론에 소개된 작가의 이야기와 전시 소식을 만나보세요
                        </p>
                    </div>

                    {/* Enhanced News grid */}
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {newsItems.map((news, index) => (
                            <a
                                key={news.id}
                                href={news.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block"
                                style={{
                                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                }}
                            >
                                <article className="relative h-full bg-card border border-border/50 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                    {/* Thumbnail with overlay */}
                                    {news.thumbnailUrl && (
                                        <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                                            <img
                                                src={news.thumbnailUrl}
                                                alt={news.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                                            {/* Floating badge */}
                                            <div className="absolute top-4 left-4">
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                                                    <Newspaper className="size-3.5 text-primary" />
                                                    <span className="text-xs font-medium text-foreground">
                                                        {news.source}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* External link indicator */}
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                                                    <ExternalLink className="size-4 text-primary" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-6 space-y-4">
                                        {/* Date */}
                                        <time className="text-xs text-muted-foreground font-light tracking-wide">
                                            {news.date}
                                        </time>

                                        {/* Title */}
                                        <h3 className="text-xl font-light text-foreground group-hover:text-primary transition-colors duration-300 leading-snug line-clamp-2">
                                            {news.title}
                                        </h3>

                                        {/* Description */}
                                        {news.description && (
                                            <p className="text-sm text-muted-foreground font-light leading-relaxed line-clamp-3">
                                                {news.description}
                                            </p>
                                        )}

                                        {/* Read more indicator */}
                                        <div className="flex items-center gap-2 text-sm text-primary font-light pt-2">
                                            <span>기사 읽기</span>
                                            <ExternalLink className="size-4 group-hover:translate-x-1 transition-transform duration-300" />
                                        </div>
                                    </div>

                                    {/* Decorative corner accent */}
                                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-tl-full transform translate-x-12 translate-y-12 group-hover:translate-x-8 group-hover:translate-y-8 transition-transform duration-500" />
                                </article>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </section>
    );
}
