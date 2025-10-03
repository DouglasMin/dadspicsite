import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { QrCode } from 'lucide-react';
import { useState } from 'react';
import FsLightbox from 'fslightbox-react';

export function Home() {
  const navigate = useNavigate();
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: 1
  });

  // 예시 작품 데이터
  const featuredArtworks = [
    {
      id: 1,
      title: "작품 1",
      image: "/example_pics/examplepic1.JPG",
      year: "2024",
      medium: "캔버스에 아크릴"
    },
    {
      id: 2,
      title: "작품 2", 
      image: "/example_pics/examplepic2.JPG",
      year: "2024",
      medium: "캔버스에 유화"
    },
    {
      id: 3,
      title: "작품 3",
      image: "/example_pics/examplepic3.JPG", 
      year: "2023",
      medium: "혼합 매체"
    },
    {
      id: 4,
      title: "작품 4",
      image: "/example_pics/examplepic4.JPG",
      year: "2023", 
      medium: "캔버스에 아크릴"
    }
  ];

  const openLightboxOnSlide = (number: number) => {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: number
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section - Minimalist Gallery Style */}
      <section className="relative min-h-screen flex items-center justify-center bg-white">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#000_1px,_transparent_0)] bg-[length:24px_24px]" />
        </div>

        {/* Floating decorative element */}
        <div className="absolute top-16 right-16 opacity-60 pointer-events-none hidden lg:block">
          <img
            src="/ddunddun1.png"
            alt=""
            className="w-32 h-32 object-contain animate-[float_8s_ease-in-out_infinite]"
            style={{ filter: 'grayscale(20%) opacity(0.7)' }}
          />
        </div>

        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Minimal badge */}
            <div className="inline-block px-6 py-2 border border-neutral-200 rounded-full text-sm font-light tracking-wide text-neutral-600 bg-white/80 backdrop-blur-sm">
              Contemporary Art Gallery
            </div>

            {/* Large, elegant heading with logo */}
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-6 md:gap-8">
                <img 
                  src="/yh-logo-no-background.png" 
                  alt="YH" 
                  className="h-32 md:h-48 lg:h-56 w-auto"
                />
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight text-neutral-900">
                  Art
                </h1>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-extralight tracking-tight text-neutral-600">
                  Lab
                </h1>
              </div>
              
              <div className="w-24 h-px bg-neutral-300 mx-auto" />
            </div>

            {/* Refined description */}
            <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed font-light">
              현대미술의 새로운 시각을 제시하는 공간입니다.<br />
              각 작품이 전하는 고유한 이야기를 발견해보세요.
            </p>

            {/* Minimal CTA */}
            <div className="pt-8">
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/gallery')}
                className="px-12 py-4 text-base font-light border-neutral-300 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300"
              >
                작품 둘러보기
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-neutral-400 to-transparent" />
        </div>
      </section>

      {/* About Section - Minimal */}
      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <div className="w-12 h-px bg-neutral-400 mb-6" />
                  <h2 className="text-3xl md:text-4xl font-light text-neutral-900 leading-tight">
                    예술과 기술의<br />
                    새로운 만남
                  </h2>
                </div>
                
                <div className="space-y-6 text-neutral-600 font-light leading-relaxed">
                  <p>
                    YH Art Lab은 현대미술의 경계를 넓혀가는 실험적 공간입니다. 
                    전통적인 갤러리 경험에 디지털 기술을 접목하여, 
                    관람객들에게 더욱 깊이 있는 예술적 경험을 제공합니다.
                  </p>
                  <p>
                    각 작품에 부착된 QR 코드를 통해 작가의 이야기, 창작 과정, 
                    그리고 작품에 담긴 의미를 모바일 기기에서 바로 확인할 수 있습니다.
                  </p>
                </div>

                <div className="flex items-center gap-6 pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/exhibitions')}
                    className="text-neutral-600 hover:text-neutral-900 font-light px-0"
                  >
                    전시 일정 보기
                  </Button>
                  <div className="w-px h-6 bg-neutral-300" />
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/contact')}
                    className="text-neutral-600 hover:text-neutral-900 font-light px-0"
                  >
                    문의하기
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-[4/5] bg-neutral-200 overflow-hidden">
                  <img
                    src="/ddunddun2.png"
                    alt="Gallery space"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white shadow-lg flex items-center justify-center">
                  <QrCode className="size-8 text-neutral-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artworks Section - Gallery Style */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Minimal section header */}
          <div className="mb-20">
            <div className="flex items-center gap-8 mb-8">
              <div className="w-12 h-px bg-neutral-300" />
              <h2 className="text-2xl md:text-3xl font-light text-neutral-900 tracking-wide">
                Selected Works
              </h2>
              <div className="flex-1 h-px bg-neutral-300" />
            </div>
          </div>

          {/* Masonry-style grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredArtworks.map((artwork, index) => (
              <div
                key={artwork.id}
                className={`group cursor-pointer ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                } ${index === 2 ? 'lg:col-span-2' : ''}`}
                onClick={() => openLightboxOnSlide(index + 1)}
              >
                <div className="relative overflow-hidden bg-neutral-100 transition-all duration-700 hover:shadow-2xl">
                  <div className={`relative ${
                    index === 0 ? 'aspect-[4/3]' : 'aspect-[3/4]'
                  } overflow-hidden`}>
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                  </div>
                  
                  {/* Minimal info */}
                  <div className="p-6 bg-white">
                    <div className="space-y-2">
                      <h3 className="text-lg font-light text-neutral-900 tracking-wide">
                        {artwork.title}
                      </h3>
                      <p className="text-sm text-neutral-500 font-light">
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
              <div className="w-8 h-px bg-neutral-300" />
              <Button
                variant="ghost"
                onClick={() => navigate('/gallery')}
                className="text-neutral-600 hover:text-neutral-900 font-light tracking-wide px-0"
              >
                View All Works
              </Button>
              <div className="w-8 h-px bg-neutral-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Minimal */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="w-16 h-px bg-neutral-600 mx-auto" />
            
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              예술 여행을<br />
              시작해보세요
            </h2>
            
            <p className="text-lg text-neutral-300 font-light leading-relaxed max-w-2xl mx-auto">
              각각의 작품이 전하는 고유한 이야기와 감정을 발견하는 특별한 경험이 기다립니다.
            </p>

            <div className="pt-8">
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/gallery')}
                className="px-12 py-4 text-base font-light border-neutral-600 text-white hover:bg-white hover:text-neutral-900 transition-all duration-300"
              >
                갤러리 입장하기
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <FsLightbox
        toggler={lightboxController.toggler}
        sources={featuredArtworks.map(artwork => artwork.image)}
        slide={lightboxController.slide}
      />
    </div>
  );
}