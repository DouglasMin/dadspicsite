import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, onAutoLogout, removeAutoLogoutCallback, refreshSession } from '@/lib/auth';

export function useAuthGuard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();

        if (!mounted) return;

        if (!user) {
          setIsAuthenticated(false);
          navigate('/login');
          return;
        }

        // 사용자 정보 가져오기
        user.getUserAttributes((err, attributes) => {
          if (!mounted) return;

          if (!err && attributes) {
            const emailAttr = attributes.find(attr => attr.Name === 'email');
            if (emailAttr) {
              setUserEmail(emailAttr.Value);
            }
          }
          setIsAuthenticated(true);
        });
      } catch (error) {
        if (!mounted) return;
        console.error('인증 확인 실패:', error);
        setIsAuthenticated(false);
        navigate('/login');
      }
    };

    // 자동 로그아웃 콜백 등록
    const handleAutoLogout = () => {
      if (!mounted) return;
      setIsAuthenticated(false);
      navigate('/login');
    };

    onAutoLogout(handleAutoLogout);

    // 사용자 활동 감지를 위한 이벤트 리스너
    const handleUserActivity = () => {
      if (isAuthenticated) {
        refreshSession();
      }
    };

    // 다양한 사용자 활동 이벤트 감지
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    checkAuth();

    return () => {
      mounted = false;
      removeAutoLogoutCallback(handleAutoLogout);
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [navigate, isAuthenticated]);

  return {
    isAuthenticated,
    userEmail,
    isLoading: isAuthenticated === null
  };
}