import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, LoginCredentials, RegisterData } from '@/types';
import { AuthService } from '@/services/AuthService';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const currentUser = AuthService.getCurrentUser();
    if (currentUser && AuthService.isAuthenticated()) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const { user } = await AuthService.login(credentials.email, credentials.password);
      setUser(user);
      toast.success('Welcome back!');
      return true;
    } catch (error) {
      toast.error('Invalid email or password');
      return false;
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    try {
      const { user } = await AuthService.register(data.name, data.email, data.password);
      setUser(user);
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      toast.error('Registration failed. Email might be taken.');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
    toast.info('Logged out successfully');
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
