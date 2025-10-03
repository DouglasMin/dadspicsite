import { Link, Outlet, useLocation } from 'react-router-dom';

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
      {/* Header - Minimal Gallery Style */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 lg:px-12">
          <nav className="flex items-center justify-between h-20">
            {/* Logo/Brand - Minimal */}
            <Link to="/" className="group flex items-center gap-4">
              <img 
                src="/yh-logo-no-background.png" 
                alt="YH" 
                className="h-12 w-auto transition-opacity group-hover:opacity-70"
              />
              <span className="text-xl font-light tracking-wide text-neutral-900 hidden sm:inline">
                Art Lab
              </span>
            </Link>

            {/* Navigation - Minimal */}
            <div className="hidden md:flex items-center gap-12">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path ||
                  (item.path !== '/' && location.pathname.startsWith(item.path));

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-sm font-light tracking-wide transition-all duration-300 relative ${
                      isActive
                        ? 'text-neutral-900'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <div className="absolute -bottom-1 left-0 w-full h-px bg-neutral-900" />
                    )}
                  </Link>
                );
              })}
              
              <div className="w-px h-4 bg-neutral-300" />
              
              <Link
                to="/admin"
                className="text-xs font-light tracking-wider text-neutral-400 hover:text-neutral-600 transition-colors uppercase"
              >
                Admin
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Link
                to="/admin"
                className="text-xs font-light tracking-wider text-neutral-400 hover:text-neutral-600 transition-colors uppercase"
              >
                Admin
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      {/* Footer - Minimal */}
      <footer className="bg-background border-t border-border py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src="/yh-logo-no-background.png" 
                  alt="YH" 
                  className="h-8 w-auto"
                />
                <span className="font-light text-xl tracking-wide text-neutral-900">
                  Art Lab
                </span>
              </div>
              <p className="text-sm text-neutral-600 font-light leading-relaxed max-w-md">
                현대미술의 새로운 시각을 제시하며, 예술과 기술의 조화를 통해 
                관람객들에게 특별한 경험을 선사합니다.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="font-light text-neutral-900 mb-4 tracking-wide">Navigation</h3>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors font-light"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-light text-neutral-900 mb-4 tracking-wide">Visit</h3>
              <div className="space-y-3 text-sm text-neutral-500 font-light">
                <p>QR 코드를 스캔하여<br />작품의 이야기를 발견하세요</p>
                <Link
                  to="/contact"
                  className="inline-block text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  문의하기 →
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-neutral-400 font-light tracking-wide">
              © {new Date().getFullYear()} YH Art Lab. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <div className="w-8 h-px bg-neutral-300" />
              <span className="text-xs text-neutral-400 font-light tracking-wider">
                Contemporary Art Gallery
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}