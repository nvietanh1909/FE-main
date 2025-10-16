import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useUser } from '@/hooks/useUser';
import type { UserProfile } from '@/services/UserService';

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const userHook = useUser();

  // Auto-refresh user data on app start
  useEffect(() => {
    if (!userHook.user && !userHook.loading) {
      userHook.refreshUser();
    }
  }, []);

  return (
    <UserContext.Provider value={userHook}>
      {children}
    </UserContext.Provider>
  );
};