import { Link, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';

export function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { path: '/', label: '홈', latin: 'Home' },
    { path: '/gallery', label: '갤러리', latin: 'Gallery' },
    { path: '/exhibitions', label: '전시회', latin: 'Exhibitions' },
    { path: '/contact', label: '문의하기', latin: 'Contact' },
  ];

  const isActivePath = (path: string) =>
    location.pathname === path ||
    (path !== '/' && location.pathname.startsWith(path));

  // A sentinel at the top of the document tells the header when it has left
  // the page's own top edge — cheaper and smoother than a scroll listener.
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(([entry]) =>
      setScrolled(!entry.isIntersecting)
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen flex-col">
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-px w-full"
      />

      {/* Header — transparent over the top of the page, hairline once scrolled */}
      <header
        className="site-header fixed top-0 right-0 left-0 z-50"
        data-stuck={scrolled || mobileMenuOpen}
      >
        <div className="shell">
          <nav
            className="flex h-20 items-center justify-between"
            aria-label="주 메뉴"
          >
            <Link
              to="/"
              className="group shrink-0 transition-opacity duration-200 ease-out hover:opacity-65"
            >
              <img
                src="/yh-art-lab-logo.png"
                alt="YH Art Lab"
                className="h-9 w-auto sm:h-11"
              />
            </Link>

            <div className="hidden items-center gap-10 md:flex lg:gap-14">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  data-active={isActivePath(item.path)}
                  aria-current={isActivePath(item.path) ? 'page' : undefined}
                  className="nav-link text-meta font-medium tracking-[0.06em]"
                >
                  {item.label}
                </Link>
              ))}

              <span className="h-3 w-px bg-rule" aria-hidden="true" />

              <Link
                to="/admin"
                className="nav-link label-sm !text-[0.625rem]"
              >
                Admin
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="pressable -mr-2 p-2 text-ink md:hidden"
              aria-label="메뉴"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </nav>
        </div>

        {mobileMenuOpen && (
          <div className="menu-panel border-t border-rule-soft bg-paper md:hidden">
            <div className="shell py-8">
              <nav className="flex flex-col" aria-label="모바일 메뉴">
                {navItems.map((item, index) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="menu-item flex items-baseline justify-between border-b border-rule-soft py-4 last:border-b-0"
                    style={
                      { '--reveal-delay': `${index * 30}ms` } as CSSProperties
                    }
                  >
                    <span
                      className={`font-serif text-h3 ${
                        isActivePath(item.path) ? 'text-ink' : 'text-ink-soft'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="label-sm">{item.latin}</span>
                  </Link>
                ))}

                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="menu-item label-sm pt-6"
                  style={
                    {
                      '--reveal-delay': `${navItems.length * 30}ms`,
                    } as CSSProperties
                  }
                >
                  Admin
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      {/* Footer — colophon */}
      <footer className="border-t border-rule bg-wall-shade">
        <div className="shell py-[var(--space-block)]">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-10 lg:gap-16">
            {/* Brand */}
            <div>
              <img
                src="/yh-art-lab-logo.png"
                alt="YH Art Lab"
                className="h-8 w-auto"
              />

              {/* TODO :  아빠 작가 introduction page 만들기*/}

              {/* <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-md">
                현대미술의 새로운 시각을 제시하며, 예술과 기술의 조화를 통해
                관람객들에게 특별한 경험을 선사합니다.
              </p> */}
            </div>

            {/* Navigation */}
            <div>
              <h3 className="label-sm">Navigation</h3>
              <ul className="mt-5 space-y-3">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-meta text-ink-soft transition-colors duration-200 ease-out hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="label-sm">Visit</h3>
              <div className="mt-5 space-y-4">
                <p className="text-meta leading-relaxed text-ink-soft">
                  QR 코드를 스캔하여
                  <br />
                  작품의 이야기를 발견하세요
                </p>
                <Link to="/contact" className="arrow-link text-meta">
                  문의하기
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-[var(--space-block)] flex flex-col items-start justify-between gap-4 border-t border-rule pt-8 sm:flex-row sm:items-center">
            <p className="text-[0.6875rem] tracking-[0.08em] text-ink-faint">
              © {new Date().getFullYear()} YH Art Lab. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <span className="h-px w-8 bg-rule" aria-hidden="true" />
              <span className="label-sm">YH Art Gallery</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
