import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser, signOut, getIdToken } from '@/lib/auth';
import { api, type Artwork, type Exhibition } from '@/lib/api';
import { Palette, Image, Calendar, LogOut, Loader2 } from 'lucide-react';

export function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const [stats, setStats] = useState({
    totalArtworks: 0,
    ongoingExhibitions: 0,
    availableArtworks: 0
  });

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const user = await getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    // Get user attributes
    user.getUserAttributes(async (err, attributes) => {
      if (!err && attributes) {
        const emailAttr = attributes.find(attr => attr.Name === 'email');
        if (emailAttr) {
          setUserEmail(emailAttr.Value);
        }
      }

      // Set up API token and load stats
      const token = await getIdToken();
      if (token) {
        api.setToken(token);
        await loadStats();
      }
      
      setLoading(false);
    });
  };

  const loadStats = async () => {
    try {
      const [artworks, exhibitions] = await Promise.all([
        api.getArtworks(),
        api.getExhibitions()
      ]);

      const now = new Date();
      const ongoingExhibitions = exhibitions.filter(exhibition => {
        const start = new Date(exhibition.startDate);
        const end = new Date(exhibition.endDate);
        return now >= start && now <= end;
      }).length;

      const availableArtworks = artworks.filter(artwork => 
        artwork.status === 'available'
      ).length;

      setStats({
        totalArtworks: artworks.length,
        ongoingExhibitions,
        availableArtworks
      });
    } catch (error) {
      console.error('통계 로딩 실패:', error);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Palette className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">YH Art Studio 관리자</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{userEmail}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">관리자 대시보드</h1>
          <p className="text-muted-foreground">
            작품과 전시회를 관리하세요
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/artworks')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                작품 관리
              </CardTitle>
              <CardDescription>
                작품을 추가, 수정, 삭제할 수 있습니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                작품 관리하기
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/exhibitions')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                전시회 관리
              </CardTitle>
              <CardDescription>
                전시회를 추가, 수정, 삭제할 수 있습니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                전시회 관리하기
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                갤러리로 이동
              </CardTitle>
              <CardDescription>
                공개된 갤러리 페이지를 확인합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate('/gallery')}>
                갤러리 보기
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">통계</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>총 작품 수</CardDescription>
                <CardTitle className="text-3xl">
                  {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.totalArtworks}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>진행 중인 전시회</CardDescription>
                <CardTitle className="text-3xl">
                  {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.ongoingExhibitions}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>판매 가능 작품</CardDescription>
                <CardTitle className="text-3xl">
                  {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.availableArtworks}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
