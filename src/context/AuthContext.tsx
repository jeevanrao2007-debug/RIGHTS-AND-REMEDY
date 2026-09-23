import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, type AppUser } from '../services/auth';

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  isFirebaseConfigured: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<AppUser>;
  signUpWithEmail: (email: string, pass: string) => Promise<AppUser>;
  signInWithGoogle: () => Promise<AppUser>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = authService.subscribe((updatedUser) => {
      setUser(updatedUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isFirebaseConfigured: authService.isConfigured(),
    signInWithEmail: async (e, p) => {
      setIsLoading(true);
      try {
        return await authService.signInWithEmail(e, p);
      } finally {
        setIsLoading(false);
      }
    },
    signUpWithEmail: async (e, p) => {
      setIsLoading(true);
      try {
        return await authService.signUpWithEmail(e, p);
      } finally {
        setIsLoading(false);
      }
    },
    signInWithGoogle: async () => {
      setIsLoading(true);
      try {
        return await authService.signInWithGoogle();
      } finally {
        setIsLoading(false);
      }
    },
    signOut: async () => {
      setIsLoading(true);
      try {
        await authService.signOut();
      } finally {
        setIsLoading(false);
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
