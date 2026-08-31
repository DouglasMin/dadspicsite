import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { QrCode, Loader2, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import FsLightbox from 'fslightbox-react';
import { api, type Artwork } from '@/lib/api';
import { RecentNews } from '@/components/RecentNews';
import { SectionHeading } from '@/components/SectionHeading';
import { ArtworkCard } from '@/components/ArtworkCard';
import { Reveal } from '@/components/Reveal';

const HERO_STATS = [
  { value: '30+', label: 'Years' },
  { value: '2', label: 'Exhibitions' },
  { value: '2', label: 'Awards' },
];

const ABOUT_STATS = [
  { value: '30+', label: 'Years in medical field' },
  { value: '2', label: 'Solo Exhibitions' },
  { value: '2', label: 'Awards' },
];

const JOURNEY = [
  {
    heading: '30년 백혈병 전문의',
    body: '1991년부터 세브란스병원 혈액종양내과 교수로 재직하며 대한혈액학회 이사장을 역임한 국내 대표 혈액암 전문가. 생명의 최전선에서 완치의 기쁨과 이별의 슬픔을 함께하며 생명의 본질을 고민했습니다.',
  },
  {
    heading: '독학으로 시작한 예술',
    body: '2022년 정년퇴임 후 집 식탁에서 시작한 그림이 이제는 전업 작가의 길로. 무균병실 시리즈로 제33회 대한민국 기독미술대전 특선, 제5회 중앙미술대전 입상하며 작가로서 인정받기 시작했습니다.',
  },
  {
    heading: '아크릴로 담는 생명의 온도',
    body: '"물감이 빠르게 마르기 때문에 감정이 증발하기 전에 남길 수 있습니다." 진료 현장에서 겪은 불안과 기쁨, 환자와의 정서적 교류를 독창적인 조형 언어로 표현하며 회복과 치유의 메시지를 전합니다.',
  },
];

/** Four works, four different widths — the wall is never a row of cards. */
const FEATURED_HANG = [
  'md:col-start-1 md:col-span-7',
  'md:col-start-9 md:col-span-4 md:mt-[clamp(2rem,7vw,7rem)]',
  'md:col-start-2 md:col-span-4',
  'md:col-start-7 md:col-span-5 md:mt-[clamp(1.5rem,4vw,4rem)]',
];

export function Home() {
  const navigate = useNavigate();
  const [lightboxController, _setLightboxController] = useState({
    toggler: false,
    slide: 1
  });
  const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([]);
  const [loadingArtworks, setLoadingArtworks] = useState(true);

  useEffect(() => {
    const fetchFeaturedArtworks = async () => {
      try {
        const artworks = await api.getArtworks();
        // Get the 4 most recent artworks
        const sorted = artworks
          .filter(artwork => artwork.imageUrl) // Only artworks with images
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4);
        setFeaturedArtworks(sorted);
      } catch (err) {
        console.error('Failed to fetch featured artworks:', err);
        setFeaturedArtworks([]);
      } finally {
        setLoadingArtworks(false);
      }
    };

    fetchFeaturedArtworks();
  }, []);

  // const openLightboxOnSlide = (number: number) => {
  //   setLightboxController({
  //     toggler: !lightboxController.toggler,
  //     slide: number
  //   });
  // };

  return (
    <div className="min-h-screen bg-wall">
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="shell relative">
        <div className="grid min-h-[calc(100svh-5rem)] items-center gap-x-[var(--gutter)] gap-y-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-20 lg:py-24">
          {/* Left: the statement */}
          <div>
            <div className="flex items-center gap-4">
              <span className="h-px w-8 bg-ink" aria-hidden="true" />
              <span className="label-sm text-ink-soft">
                의사에서 화가로의 여정
              </span>
            </div>

            <h1 className="font-serif text-display mt-8 tracking-[-0.02em]">
              <span className="block font-light text-ink-soft">생명을 그리는</span>
              <span className="block font-normal text-ink">예술가</span>
            </h1>

            <div
              className="mt-10 h-px w-16 bg-ink"
              aria-hidden="true"
            />

            <div className="mt-10 max-w-xl space-y-5">
              <p className="text-lede text-ink">
                30년간 백혈병 환자의 생명을 지켜온 혈액학 전문의,<br />
                이제는 캔버스 위에서 생명의 이야기를 그립니다.
              </p>
              <p className="text-body text-ink-soft">
                무균병실에서 목격한 인간의 존엄과 희망을<br />
                아크릴 물감으로 담아냅니다.
              </p>
            </div>

            <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/gallery')}
                className="pressable text-meta h-12 rounded-none px-8 font-normal"
              >
                작품 감상하기
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/exhibitions')}
                className="pressable text-meta h-12 rounded-none border-ink px-8 font-normal text-ink hover:bg-ink hover:text-paper"
              >
                전시 정보
              </Button>
            </div>

            <dl className="mt-14 flex flex-wrap items-end gap-x-10 gap-y-6 border-t border-rule pt-8">
              {HERO_STATS.map((stat) => (
                <div key={stat.label}>
                  <dd className="font-serif text-h2 leading-none font-light text-ink">
                    {stat.value}
                  </dd>
                  <dt className="label-sm mt-2.5">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          {/* Right: the mark */}
          <div className="flex items-center justify-center lg:justify-end">
            <img
              src="/yh-art-lab-logo.png"
              alt="YH Art Lab"
              fetchPriority="high"
              className="w-full max-w-md lg:max-w-lg xl:max-w-xl"
            />
          </div>
        </div>

        {/* Scroll cue */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex">
          <span className="scroll-cue" aria-hidden="true" />
          <span className="label-sm !text-[0.625rem]">Scroll</span>
        </div>
      </section>

      {/* ─── 01 The Artist ────────────────────────────────────────────── */}
      <section className="border-t border-rule bg-wall-shade py-[var(--space-section)]">
        <div className="shell">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="index-num shrink-0">01</span>
              <span className="h-px flex-1 bg-rule" aria-hidden="true" />
              <span className="label-sm shrink-0">The Artist</span>
            </div>

            <h2 className="font-serif text-h1 mt-8 max-w-4xl leading-tight tracking-[-0.01em]">
              <span className="block font-light text-ink-soft">
                피와 생명을 다루던 의사에서
              </span>
              <span className="block font-normal text-ink">
                색으로 삶을 그리는 작가로
              </span>
            </h2>

            <p className="font-serif mt-10 max-w-2xl text-[clamp(1.125rem,1rem+0.6vw,1.5rem)] leading-relaxed text-ink-soft">
              <span className="text-ink-faint" aria-hidden="true">“</span>
              이제는 붓으로 생명을 이야기하고 있습니다
              <span className="text-ink-faint" aria-hidden="true">”</span>
            </p>
          </Reveal>

          <div className="mt-[var(--space-section)] grid items-start gap-x-[var(--gutter)] gap-y-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-x-20">
            {/* Portrait */}
            <Reveal className="order-2 lg:order-1">
              <div className="relative overflow-hidden">
                <div className="aspect-[4/5]">
                  <img
                    src="/dad.jpeg"
                    alt="민유홍 작가"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div
                  className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 to-transparent"
                  aria-hidden="true"
                />

                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-white/60" aria-hidden="true" />
                    <span className="label-sm !text-white/80">Artist</span>
                  </div>
                  <h3 className="font-serif mt-4 text-2xl font-normal md:text-3xl">
                    민유홍
                  </h3>
                  <p className="text-meta mt-2 text-white/80">
                    세브란스병원 혈액종양내과 명예교수<br />
                    현대미술 작가
                  </p>
                </div>

                <div className="absolute top-5 right-5 bg-paper/95 p-3 backdrop-blur-sm">
                  <QrCode className="size-7 text-ink" />
                </div>
              </div>
            </Reveal>

            {/* Journey */}
            <div className="order-1 lg:order-2">
              <ol className="border-t border-rule">
                {JOURNEY.map((entry, index) => (
                  <li key={entry.heading} className="border-b border-rule">
                    <Reveal delay={index * 60}>
                      <div className="grid grid-cols-[2.5rem_1fr] gap-x-4 py-7">
                        <span className="index-num pt-1.5">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h3 className="font-serif text-h3 font-normal text-ink">
                            {entry.heading}
                          </h3>
                          <p className="text-body mt-3 text-ink-soft">
                            {entry.body}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ol>

              <Reveal>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <Button
                    size="lg"
                    onClick={() => navigate('/gallery')}
                    className="pressable text-meta h-12 rounded-none px-8 font-normal"
                  >
                    작품 감상하기
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/exhibitions')}
                    className="pressable text-meta h-12 rounded-none border-ink px-8 font-normal text-ink hover:bg-ink hover:text-paper"
                  >
                    전시 일정
                  </Button>
                </div>

                <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-rule pt-8">
                  {ABOUT_STATS.map((stat) => (
                    <div key={stat.label}>
                      <dd className="font-serif text-h2 leading-none font-light text-ink">
                        {stat.value}
                      </dd>
                      <dt className="label-sm mt-2.5 !tracking-[0.12em]">
                        {stat.label}
                      </dt>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 02 작가노트 ──────────────────────────────────────────────── */}
      <section className="border-t border-rule py-[var(--space-section)]">
        <div className="shell">
          <Reveal>
            <SectionHeading index="02" kicker="Artist's Note" title="작가노트" />
          </Reveal>
        </div>

        <div className="mx-auto mt-[var(--space-block)] max-w-[46rem] px-[var(--gutter)]">
          <Reveal>
            <p className="font-serif text-lede text-ink">
              꿈도 꾸지 않았습니다. 무얼 빈 캔버스에 그려 넣는다는 것을. 작가들의 작품 앞에 서 있었던 시간은 혹시 동료 의사들에 비해 조금 많았을지 모르겠지만, 그러나 전시장으로 들어가는 순간, 가슴 터질 듯한 긴장감과 기대는 매번 반복되고 중독되었던 기억이 있습니다. 작가들의 창의성, 투철한 주제의식, 구도와 색채를 아름답게 구현하기 위한 연단의 시간이 날카롭게 느껴지고, 그러면서 그림을 그려보면 어떨까 하는 막연한 선망이 차츰 자리 잡기 시작했던 것 같습니다.
            </p>
          </Reveal>

          <Reveal delay={60}>
            <p className="font-serif text-body mt-7 text-ink-soft">
              40여 년간 제 삶의 치열한 싸움터였고, 소명의 현장이었던 세브란스병원 혈액내과를 정년 퇴임하면서 미술에 대한 열정이 폭발해 스며들 수 있는 공간이 생긴 것 같았습니다. 마침 지인이 원천교회 2023년 비전의 경건에 이르도록 돕는다는 말씀을 전해주셨습니다. 말씀을 묵상하며, 그림면서 경건에 이르는 연단 훈련을 하는 것이 어떨까 하는 생각이 들었습니다. 캔버스 앞을 준비해 작품을 시작하였고, 담임목사님의 격려와 배려로 이렇게 개인전까지 열 수 있게 되었습니다. 글을 쓰는 지금도 실감이 나지 않습니다.
            </p>
          </Reveal>

          <Reveal delay={60}>
            <p className="font-serif text-body mt-7 text-ink-soft">
              주 예수 그리스도의 십자가를 믿고, 그 구원의 역사를 입으로 옮겼지만, 인격적인 체험이나 거듭남이 늘 부족했던 저입니다. 십자가를 아름답게 형상화해 복음의 내용을 상징적, 은유적으로 표현하면서 경건 훈련을 하는 자세로 그림을 그렸습니다. 아울러 혈액학 전문의로 늘 놀랍게 다가오는 하나님의 창조물인 골수와 조혈기능을 아름답게 표현해 보려 노력하였습니다. 다행히 화이트 교회 작업에 늘 칭찬을 아끼지 않으셔서 어마어마한 준비 과정의 외로움이 쉽게 끝내질 수 있었습니다.
            </p>
          </Reveal>

          <Reveal delay={60}>
            <p className="font-serif text-body mt-7 text-ink-soft">
              의대 졸업 후 인턴이 되어 첫 근무가 시작되기 전날, 그 큰 병원으로 걸어들어가던 그날의 두려움과 설렘을 기억합니다. 작가로서 이제 새 발걸음을 뗍니다. 지금까지 그려왔듯이 주님께서 늘 동행하시며 능력 주시고, 믿음 가운데 자유로움을 주시기를 간절히 기도드립니다.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── 03 Recent News ───────────────────────────────────────────── */}
      <div className="border-t border-rule">
        <RecentNews />
      </div>

      {/* ─── 04 Selected Works ────────────────────────────────────────── */}
      <section className="border-t border-rule bg-wall-shade py-[var(--space-section)]">
        <div className="shell">
          <Reveal>
            <SectionHeading
              index="04"
              kicker="From the Gallery"
              title="Selected Works"
            />
          </Reveal>

          {loadingArtworks ? (
            <div className="py-24 text-center">
              <Loader2 className="mx-auto mb-5 size-8 animate-spin text-ink-faint" />
              <p className="text-meta text-ink-soft">작품을 불러오는 중...</p>
            </div>
          ) : featuredArtworks.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-body text-ink-soft">아직 등록된 작품이 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="mt-[var(--space-block)] grid grid-cols-1 items-start gap-x-[var(--gutter)] gap-y-[clamp(3.5rem,2rem+5vw,6rem)] md:grid-cols-12">
                {featuredArtworks.map((artwork, index) => (
                  <div
                    key={artwork.id}
                    className={FEATURED_HANG[index % FEATURED_HANG.length]}
                  >
                    <Reveal delay={(index % 2) * 60}>
                      <ArtworkCard
                        artwork={artwork}
                        to={`/artwork/${artwork.id}`}
                        size={index === 0 ? 'lg' : 'md'}
                      />
                    </Reveal>
                  </div>
                ))}
              </div>

              <Reveal>
                <div className="mt-[var(--space-section)] border-t border-rule pt-8">
                  <button
                    type="button"
                    onClick={() => navigate('/gallery')}
                    className="arrow-link pressable text-meta"
                  >
                    View All Works
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </Reveal>
            </>
          )}
        </div>
      </section>

      {/* ─── Closing ──────────────────────────────────────────────────── */}
      <section className="border-t border-rule py-[var(--space-section)]">
        <div className="shell">
          <Reveal>
            <div className="grid gap-x-[var(--gutter)] gap-y-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-x-20">
              <div>
                <h2 className="font-serif text-h1 font-light tracking-[-0.01em] text-ink">
                  예술 여행을<br />
                  시작해보세요
                </h2>
                <p className="text-body mt-8 max-w-xl text-ink-soft">
                  각각의 작품이 전하는 고유한 이야기와 감정을 발견하는 특별한 경험이 기다립니다.
                </p>
              </div>

              <div className="lg:text-right">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/gallery')}
                  className="pressable text-meta h-12 rounded-none border-ink px-10 font-normal text-ink hover:bg-ink hover:text-paper"
                >
                  갤러리 입장하기
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Lightbox - Always render to avoid hooks issues */}
      {featuredArtworks.length > 0 && (
        <FsLightbox
          toggler={lightboxController.toggler}
          sources={featuredArtworks.map(artwork => artwork.imageUrl)}
          slide={lightboxController.slide}
          type="image"
        />
      )}
    </div>
  );
}
