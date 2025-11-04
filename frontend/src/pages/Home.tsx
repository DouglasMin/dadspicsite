import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { QrCode, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import FsLightbox from 'fslightbox-react';
import { api, type Artwork } from '@/lib/api';
import { RecentNews } from '@/components/RecentNews';

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
    <div className="min-h-screen bg-background">
      {/* Hero Section - Redesigned */}
      <section className="relative min-h-screen flex items-center bg-background overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card/30 to-background" />
        
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-screen py-20">
            {/* Left: Content */}
            <div className="space-y-10 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium text-primary tracking-wide">
                  의사에서 화가로의 여정
                </span>
              </div>

              {/* Main heading */}
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight tracking-tight">
                  생명을 그리는<br />
                  <span className="text-primary">예술가</span>
                </h1>
                
                <div className="w-20 h-1 bg-primary/50 lg:mx-0 mx-auto" />
              </div>

              {/* Description */}
              <div className="space-y-4 max-w-xl lg:mx-0 mx-auto">
                <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
                  30년간 백혈병 환자의 생명을 지켜온 혈액학 전문의,<br />
                  이제는 캔버스 위에서 생명의 이야기를 그립니다.
                </p>
                <p className="text-base text-muted-foreground/80 font-light leading-relaxed">
                  무균병실에서 목격한 인간의 존엄과 희망을<br />
                  아크릴 물감으로 담아냅니다.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate('/gallery')}
                  className="px-10 py-6 text-base font-light shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  작품 감상하기
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/exhibitions')}
                  className="px-10 py-6 text-base font-light border-2 hover:border-primary transition-all duration-300"
                >
                  전시 정보
                </Button>
              </div>

              {/* Quick stats */}
              <div className="flex gap-8 pt-8 lg:justify-start justify-center">
                <div>
                  <div className="text-3xl font-light text-primary mb-1">30+</div>
                  <div className="text-xs text-muted-foreground tracking-wide">Years</div>
                </div>
                <div className="w-px bg-border" />
                <div>
                  <div className="text-3xl font-light text-primary mb-1">2</div>
                  <div className="text-xs text-muted-foreground tracking-wide">Exhibitions</div>
                </div>
                <div className="w-px bg-border" />
                <div>
                  <div className="text-3xl font-light text-primary mb-1">2</div>
                  <div className="text-xs text-muted-foreground tracking-wide">Awards</div>
                </div>
              </div>
            </div>

            {/* Right: Logo composition */}
            <div className="relative flex items-center justify-center">
              {/* Main logo - 900x350 ratio preserved */}
              <div className="relative">
                <img 
                  src="/yh-art-lab-logo.png" 
                  alt="YH Art Lab" 
                  className="w-full max-w-md lg:max-w-lg xl:max-w-2xl h-auto opacity-95 drop-shadow-2xl"
                />

                {/* Decorative elements around logo */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full -z-10 blur-2xl animate-pulse" />
                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/5 rounded-full -z-10 blur-2xl" />
                <div className="absolute top-1/2 -right-12 w-24 h-24 bg-primary/5 rounded-full -z-10 blur-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
            <span className="text-xs text-muted-foreground font-light tracking-widest">SCROLL</span>
          </div>
        </div>
      </section>

      {/* About Artist Section - Redesigned */}
      <section className="relative py-32 bg-gradient-to-br from-card via-background to-card overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative">
          <div className="max-w-6xl mx-auto">
            {/* Header with quote */}
            <div className="text-center mb-20">
              <div className="inline-block mb-8">
                <div className="w-16 h-px bg-primary/50 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-tight mb-8">
                  피와 생명을 다루던 의사에서<br />
                  <span className="text-primary">색으로 삶을 그리는 작가로</span>
                </h2>
              </div>
              
              <p className="text-lg md:text-xl text-muted-foreground font-light italic max-w-3xl mx-auto leading-relaxed">
                "이제는 붓으로 생명을 이야기하고 있습니다"
              </p>
            </div>

            {/* Main content grid */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Left: Image with overlay info */}
              <div className="relative order-2 lg:order-1">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-2xl">
                  <img
                    src="/ddunddun2.png"
                    alt="민유홍 작가"
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-px bg-white/50" />
                        <span className="text-sm tracking-widest uppercase">Artist</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-light">민유홍</h3>
                      <p className="text-sm text-white/80 font-light">
                        세브란스병원 혈액종양내과 명예교수<br />
                        현대미술 작가
                      </p>
                    </div>
                  </div>

                  {/* QR Code badge */}
                  <div className="absolute top-6 right-6 p-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl">
                    <QrCode className="size-8 text-neutral-800" />
                  </div>
                </div>

                {/* Decorative accent */}
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-lg -z-10" />
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full -z-10" />
              </div>

              {/* Right: Story content */}
              <div className="space-y-8 order-1 lg:order-2">
                {/* Journey highlights */}
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-1 bg-primary/30 rounded-full" />
                    <div className="space-y-3">
                      <h3 className="text-xl font-light text-foreground">30년 백혈병 전문의</h3>
                      <p className="text-muted-foreground font-light leading-relaxed">
                        1991년부터 세브란스병원 혈액종양내과 교수로 재직하며 
                        대한혈액학회 이사장을 역임한 국내 대표 혈액암 전문가. 
                        생명의 최전선에서 완치의 기쁨과 이별의 슬픔을 함께하며 
                        생명의 본질을 고민했습니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-1 bg-primary/30 rounded-full" />
                    <div className="space-y-3">
                      <h3 className="text-xl font-light text-foreground">독학으로 시작한 예술</h3>
                      <p className="text-muted-foreground font-light leading-relaxed">
                        2022년 정년퇴임 후 집 식탁에서 시작한 그림이 
                        이제는 전업 작가의 길로. 무균병실 시리즈로 
                        제33회 대한민국 기독미술대전 특선, 
                        제5회 중앙미술대전 입상하며 작가로서 인정받기 시작했습니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-1 bg-primary/30 rounded-full" />
                    <div className="space-y-3">
                      <h3 className="text-xl font-light text-foreground">아크릴로 담는 생명의 온도</h3>
                      <p className="text-muted-foreground font-light leading-relaxed">
                        "물감이 빠르게 마르기 때문에 감정이 증발하기 전에 남길 수 있습니다." 
                        진료 현장에서 겪은 불안과 기쁨, 환자와의 정서적 교류를 
                        독창적인 조형 언어로 표현하며 회복과 치유의 메시지를 전합니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-4 pt-6">
                  <Button
                    size="lg"
                    onClick={() => navigate('/gallery')}
                    className="px-8 py-6 text-base font-light"
                  >
                    작품 감상하기
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/exhibitions')}
                    className="px-8 py-6 text-base font-light"
                  >
                    전시 일정
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
                  <div className="text-center">
                    <div className="text-3xl font-light text-primary mb-2">30+</div>
                    <div className="text-xs text-muted-foreground font-light tracking-wide">Years in medical field</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-light text-primary mb-2">2</div>
                    <div className="text-xs text-muted-foreground font-light tracking-wide">Solo Exhibitions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-light text-primary mb-2">2</div>
                    <div className="text-xs text-muted-foreground font-light tracking-wide">Awards</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artist Note Section - Minimal */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Section header */}
            <div className="mb-16">
              <div className="flex items-center gap-8 mb-8">
                <div className="w-12 h-px bg-border" />
                <h2 className="text-2xl md:text-3xl font-light text-foreground tracking-wide">
                  작가노트
                </h2>
                <div className="flex-1 h-px bg-border" />
              </div>
            </div>

            {/* Artist note content */}
            <div className="space-y-5 text-muted-foreground font-light leading-relaxed text-base">
              <p>
                꿈도 꾸지 않았습니다. 무얼 빈 캔버스에 그려 넣는다는 것을. 작가들의 작품 앞에 서 있었던 시간은 혹시 동료 의사들에 비해 조금 많았을지 모르겠지만, 그러나 전시장으로 들어가는 순간, 가슴 터질 듯한 긴장감과 기대는 매번 반복되고 중독되었던 기억이 있습니다. 작가들의 창의성, 투철한 주제의식, 구도와 색채를 아름답게 구현하기 위한 연단의 시간이 날카롭게 느껴지고, 그러면서 그림을 그려보면 어떨까 하는 막연한 선망이 차츰 자리 잡기 시작했던 것 같습니다.
              </p>

              <p>
                40여 년간 제 삶의 치열한 싸움터였고, 소명의 현장이었던 세브란스병원 혈액내과를 정년 퇴임하면서 미술에 대한 열정이 폭발해 스며들 수 있는 공간이 생긴 것 같았습니다. 마침 지인이 원천교회 2023년 비전의 경건에 이르도록 돕는다는 말씀을 전해주셨습니다. 말씀을 묵상하며, 그림면서 경건에 이르는 연단 훈련을 하는 것이 어떨까 하는 생각이 들었습니다. 캔버스 앞을 준비해 작품을 시작하였고, 담임목사님의 격려와 배려로 이렇게 개인전까지 열 수 있게 되었습니다. 글을 쓰는 지금도 실감이 나지 않습니다.
              </p>

              <p>
                주 예수 그리스도의 십자가를 믿고, 그 구원의 역사를 입으로 옮겼지만, 인격적인 체험이나 거듭남이 늘 부족했던 저입니다. 십자가를 아름답게 형상화해 복음의 내용을 상징적, 은유적으로 표현하면서 경건 훈련을 하는 자세로 그림을 그렸습니다. 아울러 혈액학 전문의로 늘 놀랍게 다가오는 하나님의 창조물인 골수와 조혈기능을 아름답게 표현해 보려 노력하였습니다. 다행히 화이트 교회 작업에 늘 칭찬을 아끼지 않으셔서 어마어마한 준비 과정의 외로움이 쉽게 끝내질 수 있었습니다.
              </p>

              <p>
                의대 졸업 후 인턴이 되어 첫 근무가 시작되기 전날, 그 큰 병원으로 걸어들어가던 그날의 두려움과 설렘을 기억합니다. 작가로서 이제 새 발걸음을 뗍니다. 지금까지 그려왔듯이 주님께서 늘 동행하시며 능력 주시고, 믿음 가운데 자유로움을 주시기를 간절히 기도드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent News Section */}
      <RecentNews />

      {/* Featured Artworks Section - Gallery Style */}
      <section className="py-24 bg-card/50">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Minimal section header */}
          <div className="mb-20">
            <div className="flex items-center gap-8 mb-8">
              <div className="w-12 h-px bg-border" />
              <h2 className="text-2xl md:text-3xl font-light text-foreground tracking-wide">
                Selected Works
              </h2>
              <div className="flex-1 h-px bg-border" />
            </div>
          </div>

          {/* Loading state */}
          {loadingArtworks ? (
            <div className="text-center py-20">
              <Loader2 className="size-12 animate-spin text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground font-light">작품을 불러오는 중...</p>
            </div>
          ) : featuredArtworks.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground font-light">아직 등록된 작품이 없습니다.</p>
            </div>
          ) : (
            <>
              {/* Masonry-style grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredArtworks.map((artwork, index) => (
                  <div
                    key={artwork.id}
                    className={`group cursor-pointer ${
                      index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                    } ${index === 2 ? 'lg:col-span-2' : ''}`}
                    onClick={() => navigate(`/artwork/${artwork.id}`)}
                  >
                    <div className="relative overflow-hidden bg-neutral-800/95 transition-all duration-700 hover:shadow-2xl border border-neutral-700/50 hover:border-primary/50">
                      <div className={`relative ${
                        index === 0 ? 'aspect-[4/3]' : 'aspect-[3/4]'
                      } overflow-hidden`}>
                        <img
                          src={artwork.imageUrl}
                          alt={artwork.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        
                        {/* Subtle overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                      </div>
                      
                      {/* Minimal info */}
                      <div className="p-6 bg-neutral-900/90 backdrop-blur-sm">
                        <div className="space-y-2">
                          <h3 className="text-lg font-light text-neutral-100 tracking-wide">
                            {artwork.title}
                          </h3>
                          <p className="text-sm text-neutral-400 font-light">
                            {artwork.year} • {artwork.medium}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Minimal CTA */}
              <div className="text-center mt-20">
                <div className="inline-flex items-center gap-4">
                  <div className="w-8 h-px bg-border" />
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/gallery')}
                    className="text-muted-foreground hover:text-primary font-light tracking-wide px-0"
                  >
                    View All Works
                  </Button>
                  <div className="w-8 h-px bg-border" />
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Final CTA Section - Minimal */}
      <section className="py-24 bg-background border-t border-border/50">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="w-16 h-px bg-primary/50 mx-auto" />
            
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
              예술 여행을<br />
              시작해보세요
            </h2>
            
            <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
              각각의 작품이 전하는 고유한 이야기와 감정을 발견하는 특별한 경험이 기다립니다.
            </p>

            <div className="pt-8">
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/gallery')}
                className="px-12 py-4 text-base font-light border-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                갤러리 입장하기
              </Button>
            </div>
          </div>
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