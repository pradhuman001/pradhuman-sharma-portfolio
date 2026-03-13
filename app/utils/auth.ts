export interface AuthUser {
  email: string;
  loggedIn: boolean;
  name?: string;
  photo?: string;
  bio?: string;
}

const AUTH_STORAGE_KEY = "portfolioai_auth";

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawAuth = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawAuth) {
    return null;
  }

  try {
    const parsedAuth = JSON.parse(rawAuth) as AuthUser;
    return parsedAuth.loggedIn ? parsedAuth : null;
  } catch {
    return null;
  }
}

export function saveAuthUser(user: AuthUser): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearAuthUser(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
}
