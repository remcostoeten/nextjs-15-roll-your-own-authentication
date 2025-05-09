'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { UserSession } from './session';

interface UserContextType {
  user: NonNullable<UserSession> | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

interface UserProviderProps {
  user: NonNullable<UserSession> | null;
  children: ReactNode;
}

export function UserProvider({ user, children }: UserProviderProps) {
  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
} 