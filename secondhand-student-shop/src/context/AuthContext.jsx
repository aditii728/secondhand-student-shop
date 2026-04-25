import { createContext, useEffect, useRef, useState } from "react";
import {
  clearAuthSession,
  fetchCurrentUser,
  getAccessTokenExpiry,
  getStoredAccessToken,
  getStoredRefreshToken,
  getStoredUser,
  isTokenExpired,
  loginUser,
  persistAuthSession,
  refreshAccessToken,
  updateStoredTokens,
  updateStoredUser,
} from "../api/auth";

export const AuthContext = createContext(null);

const REFRESH_BUFFER_MS = 60 * 1000;

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [accessToken, setAccessToken] = useState(() => getStoredAccessToken());
  const refreshTimeoutRef = useRef(null);

  function clearRefreshTimeout() {
    if (refreshTimeoutRef.current) {
      window.clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  }

  function logout() {
    clearRefreshTimeout();
    clearAuthSession();
    setAccessToken(null);
    setCurrentUser(null);
  }

  async function runRefresh(refreshTokenOverride) {
    const refreshToken = refreshTokenOverride || getStoredRefreshToken();
    if (!refreshToken) {
      logout();
      return null;
    }

    try {
      const response = await refreshAccessToken(refreshToken);
      updateStoredTokens(response.tokens);
      setAccessToken(response.tokens.access);
      scheduleRefresh(response.tokens.access);
      return response.tokens.access;
    } catch {
      logout();
      return null;
    }
  }

  function scheduleRefresh(nextAccessToken) {
    clearRefreshTimeout();

    const expiryTime = getAccessTokenExpiry(nextAccessToken);
    if (!expiryTime) {
      return;
    }

    const delay = Math.max(expiryTime - Date.now() - REFRESH_BUFFER_MS, 0);
    refreshTimeoutRef.current = window.setTimeout(() => {
      runRefresh();
    }, delay);
  }

  async function syncCurrentUser(nextAccessToken) {
    try {
      const response = await fetchCurrentUser(nextAccessToken);
      updateStoredUser(response.user);
      setCurrentUser(response.user);
      return response.user;
    } catch {
      const refreshedAccessToken = await runRefresh();
      if (!refreshedAccessToken) {
        return null;
      }

      const response = await fetchCurrentUser(refreshedAccessToken);
      updateStoredUser(response.user);
      setCurrentUser(response.user);
      return response.user;
    }
  }

  async function login(credentials) {
    const response = await loginUser(credentials);
    persistAuthSession({
      tokens: response.tokens,
      user: response.user,
      rememberMe: credentials.rememberMe,
    });
    setAccessToken(response.tokens.access);
    setCurrentUser(response.user);
    scheduleRefresh(response.tokens.access);
    return response;
  }

  useEffect(() => {
    let isCancelled = false;

    async function initializeAuth() {
      const storedAccessToken = getStoredAccessToken();
      const storedRefreshToken = getStoredRefreshToken();
      const storedUser = getStoredUser();

      if (!storedAccessToken || !storedRefreshToken || !storedUser) {
        if (!isCancelled) {
          setIsAuthReady(true);
        }
        return;
      }

      try {
        const usableAccessToken = isTokenExpired(storedAccessToken, REFRESH_BUFFER_MS)
          ? await runRefresh(storedRefreshToken)
          : storedAccessToken;

        if (!usableAccessToken || isCancelled) {
          return;
        }

        setAccessToken(usableAccessToken);
        scheduleRefresh(usableAccessToken);
        await syncCurrentUser(usableAccessToken);
      } finally {
        if (!isCancelled) {
          setIsAuthReady(true);
        }
      }
    }

    initializeAuth();

    return () => {
      isCancelled = true;
      clearRefreshTimeout();
    };
  }, []);

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isAuthReady,
    accessToken,
    login,
    logout,
    refreshSession: runRefresh,
    syncCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
