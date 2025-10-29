import { useState, useEffect, useCallback } from "react";
import { UserProfile } from "@shared/api";
import {
  getToken,
  getCurrentUser,
  logout as logoutUtil,
  getCurrentUserFromServer,
} from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(() => getCurrentUser());
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        const currentUser = await getCurrentUserFromServer();
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const logout = useCallback(() => {
    logoutUtil();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateUser = useCallback((newUser: UserProfile) => {
    setUser(newUser);
    localStorage.setItem("jobmarketplace_auth_user", JSON.stringify(newUser));
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    updateUser,
  };
}
