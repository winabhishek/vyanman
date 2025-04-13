import { useState } from 'react';
import { UserProfile } from '@/types';

export interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
}

export const useAuthAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const login = async (credentials: AuthCredentials): Promise<UserProfile | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Sending login request to /api/auth/login', credentials.email);
      
      // In a real implementation, this would be a fetch call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials)
      // });
      // if (!response.ok) throw new Error('Login failed');
      // const data = await response.json();
      
      // Simulate API response delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock response
      const user: UserProfile = {
        id: 'user-123',
        name: credentials.email.split('@')[0],
        email: credentials.email,
        isAnonymous: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Store in localStorage for persistence
      localStorage.setItem('vyanamana-user', JSON.stringify(user));
      
      setIsLoading(false);
      return user;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      setIsLoading(false);
      return null;
    }
  };

  const register = async (credentials: AuthCredentials): Promise<UserProfile | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Sending register request to /api/auth/register', credentials.email);
      
      // In a real implementation, this would be a fetch call
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials)
      // });
      // if (!response.ok) throw new Error('Registration failed');
      // const data = await response.json();
      
      // Simulate API response delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const user: UserProfile = {
        id: `user-${Date.now()}`,
        name: credentials.name || credentials.email.split('@')[0],
        email: credentials.email,
        isAnonymous: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Store in localStorage for persistence
      localStorage.setItem('vyanamana-user', JSON.stringify(user));
      
      setIsLoading(false);
      return user;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      setIsLoading(false);
      return null;
    }
  };

  const logout = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Sending logout request to /api/auth/logout');
      
      // In a real implementation, this would be a fetch call
      // const response = await fetch('/api/auth/logout', { method: 'POST' });
      // if (!response.ok) throw new Error('Logout failed');
      
      // Simulate API response delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from localStorage
      localStorage.removeItem('vyanamana-user');
      
      setIsLoading(false);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      setIsLoading(false);
      return false;
    }
  };

  const getCurrentUser = async (): Promise<UserProfile | null> => {
    // Check localStorage for existing user
    const storedUser = localStorage.getItem('vyanamana-user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  return {
    login,
    register,
    logout,
    getCurrentUser,
    isLoading,
    error
  };
};
