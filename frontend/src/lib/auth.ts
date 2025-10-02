import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
};

const userPool = new CognitoUserPool(poolData);

// 세션 타임아웃 설정 (3분 = 180초)
const SESSION_TIMEOUT = 3 * 60 * 1000; // 3분을 밀리초로
const SESSION_KEY = 'yh_art_session_timestamp';
const AUTO_LOGOUT_KEY = 'yh_art_auto_logout';

// 세션 타임아웃 체크를 위한 타이머
let sessionTimer: ReturnType<typeof setTimeout> | null = null;
let logoutCallbacks: (() => void)[] = [];

export interface AuthResult {
  success: boolean;
  message?: string;
  session?: CognitoUserSession;
  challengeName?: string;
  cognitoUser?: CognitoUser;
}

// 세션 타임스탬프 업데이트
const updateSessionTimestamp = (): void => {
  localStorage.setItem(SESSION_KEY, Date.now().toString());
};

// 세션 만료 체크
const isSessionExpired = (): boolean => {
  const timestamp = localStorage.getItem(SESSION_KEY);
  if (!timestamp) return true;

  const sessionAge = Date.now() - parseInt(timestamp);
  return sessionAge > SESSION_TIMEOUT;
};

// 자동 로그아웃 콜백 등록
export const onAutoLogout = (callback: () => void): void => {
  logoutCallbacks.push(callback);
};

// 자동 로그아웃 콜백 제거
export const removeAutoLogoutCallback = (callback: () => void): void => {
  logoutCallbacks = logoutCallbacks.filter(cb => cb !== callback);
};

// 자동 로그아웃 실행
const executeAutoLogout = (): void => {
  localStorage.setItem(AUTO_LOGOUT_KEY, 'true');
  signOut();
  logoutCallbacks.forEach(callback => callback());
};

// 세션 타이머 시작
const startSessionTimer = (): void => {
  clearSessionTimer();
  updateSessionTimestamp();

  sessionTimer = setTimeout(() => {
    executeAutoLogout();
  }, SESSION_TIMEOUT);
};

// 세션 타이머 정리
const clearSessionTimer = (): void => {
  if (sessionTimer) {
    clearTimeout(sessionTimer);
    sessionTimer = null;
  }
};

// 세션 활동 갱신 (사용자 활동 시 호출)
export const refreshSession = (): void => {
  // 세션이 만료되지 않았고 현재 사용자가 있는 경우에만 타이머 갱신
  if (!isSessionExpired() && userPool.getCurrentUser()) {
    startSessionTimer();
  }
};

// 자동 로그아웃 여부 확인
export const wasAutoLoggedOut = (): boolean => {
  const autoLogout = localStorage.getItem(AUTO_LOGOUT_KEY);
  if (autoLogout === 'true') {
    localStorage.removeItem(AUTO_LOGOUT_KEY);
    return true;
  }
  return false;
};

export const signIn = (email: string, password: string): Promise<AuthResult> => {
  return new Promise((resolve) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session) => {
        startSessionTimer(); // 로그인 성공 시 세션 타이머 시작
        resolve({ success: true, session });
      },
      onFailure: (err) => {
        resolve({ success: false, message: err.message || '로그인에 실패했습니다' });
      },
      newPasswordRequired: () => {
        resolve({
          success: false,
          message: '새 비밀번호가 필요합니다',
          challengeName: 'NEW_PASSWORD_REQUIRED',
          cognitoUser
        });
      },
    });
  });
};

export const completeNewPassword = (
  cognitoUser: CognitoUser,
  newPassword: string
): Promise<AuthResult> => {
  return new Promise((resolve) => {
    cognitoUser.completeNewPasswordChallenge(newPassword, {}, {
      onSuccess: (session) => {
        startSessionTimer(); // 비밀번호 변경 성공 시 세션 타이머 시작
        resolve({ success: true, session });
      },
      onFailure: (err) => {
        resolve({ success: false, message: err.message || '비밀번호 변경에 실패했습니다' });
      },
    });
  });
};

export const signOut = (): void => {
  clearSessionTimer(); // 세션 타이머 정리
  localStorage.removeItem(SESSION_KEY); // 세션 타임스탬프 제거

  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
};

export const getCurrentUser = (): Promise<CognitoUser | null> => {
  return new Promise((resolve) => {
    // 먼저 세션 만료 체크
    if (isSessionExpired()) {
      executeAutoLogout();
      resolve(null);
      return;
    }

    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      resolve(null);
      return;
    }

    cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session || !session.isValid()) {
        resolve(null);
        return;
      }

      // 세션이 유효하면 타이머 갱신
      startSessionTimer();
      resolve(cognitoUser);
    });
  });
};

export const getSession = (): Promise<CognitoUserSession | null> => {
  return new Promise((resolve) => {
    // 먼저 세션 만료 체크
    if (isSessionExpired()) {
      executeAutoLogout();
      resolve(null);
      return;
    }

    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      resolve(null);
      return;
    }

    cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session || !session.isValid()) {
        resolve(null);
        return;
      }

      // 세션이 유효하면 타이머 갱신
      startSessionTimer();
      resolve(session);
    });
  });
};

export const getIdToken = async (): Promise<string | null> => {
  const session = await getSession();
  return session ? session.getIdToken().getJwtToken() : null;
};
