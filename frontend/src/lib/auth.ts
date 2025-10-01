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

export interface AuthResult {
  success: boolean;
  message?: string;
  session?: CognitoUserSession;
  challengeName?: string;
  cognitoUser?: CognitoUser;
}

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
        resolve({ success: true, session });
      },
      onFailure: (err) => {
        resolve({ success: false, message: err.message || '비밀번호 변경에 실패했습니다' });
      },
    });
  });
};

export const signOut = (): void => {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
};

export const getCurrentUser = (): Promise<CognitoUser | null> => {
  return new Promise((resolve) => {
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
      resolve(cognitoUser);
    });
  });
};

export const getSession = (): Promise<CognitoUserSession | null> => {
  return new Promise((resolve) => {
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
      resolve(session);
    });
  });
};

export const getIdToken = async (): Promise<string | null> => {
  const session = await getSession();
  return session ? session.getIdToken().getJwtToken() : null;
};
