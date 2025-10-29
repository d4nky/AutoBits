import { UserProfile, AuthResponse } from "@shared/api";

const AUTH_TOKEN_KEY = "jobmarketplace_auth_token";
const AUTH_USER_KEY = "jobmarketplace_auth_user";

export async function signup(data: {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address: string;
  userType: "user" | "business";
  businessName?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
}): Promise<AuthResponse> {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Signup failed");
  }

  const result: AuthResponse = await response.json();

  if (result.token) {
    localStorage.setItem(AUTH_TOKEN_KEY, result.token);
  }
  if (result.user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(result.user));
  }

  return result;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Login failed");
  }

  const result: AuthResponse = await response.json();

  if (result.token) {
    localStorage.setItem(AUTH_TOKEN_KEY, result.token);
  }
  if (result.user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(result.user));
  }

  return result;
}

export function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getCurrentUser(): UserProfile | null {
  const userStr = localStorage.getItem(AUTH_USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export async function getCurrentUserFromServer(): Promise<UserProfile | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      logout();
      return null;
    }

    const data = await response.json();
    if (data.user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
      return data.user;
    }
    return null;
  } catch (error) {
    logout();
    return null;
  }
}
