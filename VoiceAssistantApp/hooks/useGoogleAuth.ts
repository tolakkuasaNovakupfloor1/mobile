import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from '../config';
import { saveTokens, loadTokens, clearTokens, AuthTokens } from '../services/StorageService';

// This is necessary for the auth session to work on web.
WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [tokens, setTokens] = React.useState<AuthTokens | null>(null);
  const [userInfo, setUserInfo] = React.useState<any>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    scopes: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/gmail.readonly'],
  });

  // Load stored tokens on initial mount
  React.useEffect(() => {
    const getStoredTokens = async () => {
      const storedTokens = await loadTokens();
      if (storedTokens) {
        setTokens(storedTokens);
      }
    };
    getStoredTokens();
  }, []);

  // Handle the response from Google's auth screen
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication) {
        const newTokens = {
            accessToken: authentication.accessToken,
            refreshToken: authentication.refreshToken ?? null,
            expiresIn: authentication.expiresIn ?? null,
        };
        setTokens(newTokens);
        saveTokens(newTokens); // Save tokens securely
      }
    }
  }, [response]);

  // Fetch user info when we have an access token
  React.useEffect(() => {
    const getUserInfo = async () => {
      if (tokens?.accessToken) {
        try {
          const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
          });
          const user = await res.json();
          setUserInfo(user);
        } catch (e) {
          console.error("Failed to fetch user info", e);
        }
      }
    };
    getUserInfo();
  }, [tokens]);

  const logout = async () => {
    // Note: Google doesn't have a reliable single-sign-out endpoint.
    // The best we can do is clear our local tokens.
    await clearTokens();
    setTokens(null);
    setUserInfo(null);
  };

  return {
    isLoggedIn: !!tokens,
    userInfo,
    login: () => promptAsync(),
    logout,
    tokens,
  };
};
