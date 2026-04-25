const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");
const ACCESS_TOKEN_KEY = "student_shop_access_token";
const REFRESH_TOKEN_KEY = "student_shop_refresh_token";
const USER_KEY = "student_shop_user";
const STORAGE_MODE_KEY = "student_shop_storage_mode";

function getStorage(rememberMe = false) {
  return rememberMe ? window.localStorage : window.sessionStorage;
}

function getActiveStorage() {
  const mode = window.localStorage.getItem(STORAGE_MODE_KEY) || window.sessionStorage.getItem(STORAGE_MODE_KEY);
  return mode === "local" ? window.localStorage : window.sessionStorage;
}

async function parseResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || fallbackMessage || `Request failed (${response.status})`);
    error.fieldErrors = data.errors || {};
    throw error;
  }

  return data;
}

export async function signupUser(payload) {
  const response = await fetch(`${API_BASE_URL}/auth/signup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response, `Signup failed (${response.status})`);
}

export async function loginUser(payload) {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response, `Login failed (${response.status})`);
}

export async function fetchCurrentUser(accessToken) {
  const response = await fetch(`${API_BASE_URL}/auth/me/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return parseResponse(response, `Unable to fetch current user (${response.status})`);
}

export function persistAuthSession({ tokens, user, rememberMe }) {
  const targetStorage = getStorage(rememberMe);
  const otherStorage = rememberMe ? window.sessionStorage : window.localStorage;
  const mode = rememberMe ? "local" : "session";

  otherStorage.removeItem(ACCESS_TOKEN_KEY);
  otherStorage.removeItem(REFRESH_TOKEN_KEY);
  otherStorage.removeItem(USER_KEY);
  otherStorage.removeItem(STORAGE_MODE_KEY);

  targetStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
  targetStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
  targetStorage.setItem(USER_KEY, JSON.stringify(user));
  targetStorage.setItem(STORAGE_MODE_KEY, mode);
}

export function getStoredAccessToken() {
  return getActiveStorage().getItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser() {
  const rawUser = getActiveStorage().getItem(USER_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(STORAGE_MODE_KEY);
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(STORAGE_MODE_KEY);
}
