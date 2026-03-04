"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, firstName?: string, lastName?: string) => void;
  register: (email: string, password: string, firstName: string, lastName: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "meridian-auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, [user, isHydrated]);

  const login = useCallback(
    (email: string, _password: string, firstName?: string, lastName?: string) => {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        try {
          setUser(JSON.parse(stored));
          return;
        } catch {}
      }
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        firstName: firstName || email.split("@")[0],
        lastName: lastName || "",
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
    },
    []
  );

  const register = useCallback(
    (email: string, _password: string, firstName: string, lastName: string) => {
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        firstName,
        lastName,
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
