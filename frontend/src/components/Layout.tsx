import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

export function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '홈' },
    { path: '/gallery', label: '갤러리' },
    { path: '/exhibitions', label: '전시회' },
    { path: '/contact', label: '문의하기' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 z-50 shadow-sm">
        <div className="container mx-auto px-4 lg:px-6">
          <nav className="flex items-center justify-between h-20">
            {/* Logo/Brand */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Palette className="size-8 text-primary transition-transform group-hover:rotate-12" />
                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-foreground">
                  YH Art Lab
                </span>
                <span className="text-xs text-muted-foreground tracking-wide">
                  현대미술 갤러리
                </span>
              </div>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path ||
                  (item.path !== '/' && location.pathname.startsWith(item.path));

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-sm font-medium transition-all relative group ${
                      isActive
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </Link>
                );
              })}
              <Button variant="outline" size="sm" asChild className="ml-2">
                <Link to="/admin">관리자</Link>
              </Button>
            </div>

            {/* Mobile Menu Button - Could be expanded in future */}
            <div className="md:hidden">
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin">관리자</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 mt-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Palette className="size-6 text-primary" />
                <span className="font-bold text-lg">YH Art Lab</span>
              </div>
              <p className="text-sm text-muted-foreground">
                열정과 헌신으로 현대미술 작품을 선보입니다.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">바로가기</h3>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold mb-4">방문 안내</h3>
              <p className="text-sm text-muted-foreground">
                당신에게 말을 거는 예술을 발견하세요.<br />
                전시회에서 QR 코드를 스캔하여 자세한 정보를 확인하세요.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} YH Art Lab. All rights reserved. 모든 권리 보유.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}