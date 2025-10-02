import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signIn, completeNewPassword, wasAutoLoggedOut } from '@/lib/auth';
import { Palette, ArrowLeft, Home } from 'lucide-react';
import type { CognitoUser } from 'amazon-cognito-identity-js';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const [cognitoUser, setCognitoUser] = useState<CognitoUser | null>(null);
  const [showAutoLogoutMessage, setShowAutoLogoutMessage] = useState(false);

  useEffect(() => {
    // 자동 로그아웃 메시지 확인
    if (wasAutoLoggedOut()) {
      setShowAutoLogoutMessage(true);
      // 5초 후 메시지 숨김
      setTimeout(() => setShowAutoLogoutMessage(false), 5000);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.success) {
        navigate('/admin');
      } else if (result.challengeName === 'NEW_PASSWORD_REQUIRED') {
        setNeedsPasswordChange(true);
        setCognitoUser(result.cognitoUser || null);
      } else {
        setError(result.message || '로그인에 실패했습니다');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    if (newPassword.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다');
      return;
    }

    if (!cognitoUser) {
      setError('사용자 정보를 찾을 수 없습니다');
      return;
    }

    setLoading(true);

    try {
      const result = await completeNewPassword(cognitoUser, newPassword);

      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.message || '비밀번호 변경에 실패했습니다');
      }
    } catch (err) {
      setError('비밀번호 변경 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 상단 네비게이션 */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 lg:px-6">
          <nav className="flex items-center justify-between h-16">
            {/* 로고 */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Palette className="size-6 text-primary transition-transform group-hover:rotate-12" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                YH Art Lab
              </span>
            </Link>

            {/* 네비게이션 링크 */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  홈으로
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/gallery" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  갤러리
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* 메인 로그인 영역 */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* 자동 로그아웃 메시지 */}
          {showAutoLogoutMessage && (
            <div className="mb-6 p-3 text-sm text-amber-800 bg-amber-50 rounded-lg border border-amber-200">
              <span className="font-medium">세션이 만료되어 로그아웃되었습니다</span>
            </div>
          )}

          <div className="flex items-center justify-center mb-8">
            <Palette className="h-12 w-12 text-primary" />
            <span className="ml-3 text-3xl font-bold text-primary">YH Art Studio</span>
          </div>

          <Card>
          <CardHeader>
            <CardTitle>{needsPasswordChange ? '비밀번호 변경' : '관리자 로그인'}</CardTitle>
            <CardDescription>
              {needsPasswordChange
                ? '첫 로그인입니다. 새 비밀번호를 설정해주세요'
                : '관리자 계정으로 로그인하여 작품과 전시회를 관리하세요'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!needsPasswordChange ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your-email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? '로그인 중...' : '로그인'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">새 비밀번호</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="최소 8자, 대소문자, 숫자, 특수문자 포함"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? '변경 중...' : '비밀번호 변경'}
                </Button>
              </form>
            )}
          </CardContent>
          </Card>

          {/* 하단 안내 */}
          <div className="mt-6 text-center">
            <Link to="/gallery" className="text-sm text-primary hover:underline">
              갤러리 둘러보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
