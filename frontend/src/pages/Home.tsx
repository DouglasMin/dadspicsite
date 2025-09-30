import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { QrCode, Calendar, Mail, Palette, Eye, Users } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        {/* Decorative Bird - floating in top right */}
        <div className="absolute top-8 right-8 lg:top-12 lg:right-16 z-0 pointer-events-none">
          <img
            src="/ddunddun1.png"
            alt=""
            className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 opacity-80 hover:opacity-100 transition-all duration-500 animate-[float_6s_ease-in-out_infinite]"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}
          />
        </div>

        <div className="container mx-auto px-4 lg:px-6 py-24 md:py-32 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Palette className="size-4" />
              현대미술 갤러리
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                YH Art Lab
              </span>
              에 오신 것을 환영합니다
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              엄선된 현대미술 작품 컬렉션을 둘러보세요. 전시회에서 QR 코드를 스캔하여
              각 작품에 담긴 이야기를 발견해 보세요.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => navigate('/gallery')}
                className="text-base px-8 h-12"
              >
                <Eye className="mr-2 size-5" />
                갤러리 둘러보기
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/exhibitions')}
                className="text-base px-8 h-12"
              >
                <Calendar className="mr-2 size-5" />
                전시회 보기
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              새로운 방식으로 예술을 경험하세요
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              전통적인 예술 감상과 현대 기술의 완벽한 조화를 발견하세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <QrCode className="size-7 text-primary" />
                </div>
                <CardTitle className="text-xl">QR 코드 접근</CardTitle>
                <CardDescription className="text-base">
                  작품의 QR 코드를 스캔하여 모바일 기기에서 즉시 상세 정보를 확인하세요
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="size-7 text-primary" />
                </div>
                <CardTitle className="text-xl">전시회</CardTitle>
                <CardDescription className="text-base">
                  날짜, 장소, 주요 작품과 함께 현재 및 예정된 전시회를 확인하세요
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="size-7 text-primary" />
                </div>
                <CardTitle className="text-xl">문의하기</CardTitle>
                <CardDescription className="text-base">
                  작품 문의, 구매 또는 전시 기회에 대해 알아보려면 연락주세요
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 text-center">
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Palette className="size-8 text-primary" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-foreground">100+</div>
              <div className="text-muted-foreground text-lg">작품</div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Eye className="size-8 text-primary" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-foreground">10K+</div>
              <div className="text-muted-foreground text-lg">방문자</div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Users className="size-8 text-primary" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-foreground">20+</div>
              <div className="text-muted-foreground text-lg">전시회</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            둘러볼 준비가 되셨나요?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            엄선된 현대미술 작품 컬렉션을 통한 여정을 시작하세요
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/gallery')}
            className="text-base px-8 h-12"
          >
            갤러리 방문하기
          </Button>
        </div>
      </section>
    </div>
  );
}