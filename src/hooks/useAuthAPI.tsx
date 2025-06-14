
import { useState } from 'react';
import { UserProfile } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
}

export const useAuthAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const login = async (credentials: AuthCredentials): Promise<UserProfile | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Attempting login with Supabase...', credentials.email);
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });
      
      if (authError) {
        console.error('Supabase auth error:', authError);
        throw new Error(authError.message);
      }
      
      if (!data.user) {
        throw new Error('No user data returned');
      }
      
      // Create user profile from Supabase user data
      const user: UserProfile = {
        id: data.user.id,
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
        email: data.user.email || '',
        isAnonymous: data.user.is_anonymous || false,
        createdAt: new Date(data.user.created_at),
        updatedAt: new Date(data.user.updated_at || data.user.created_at)
      };
      
      setIsLoading(false);
      toast({
        title: "Login successful!",
        description: `Welcome back, ${user.name}!`,
      });
      
      return user;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Login failed');
      console.error('Login error:', error);
      setError(error);
      setIsLoading(false);
      
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
      
      return null;
    }
  };

  const register = async (credentials: AuthCredentials): Promise<UserProfile | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Attempting registration with Supabase...', credentials.email);
      
      const { data, error: authError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name || credentials.email.split('@')[0]
          }
        }
      });
      
      if (authError) {
        console.error('Supabase registration error:', authError);
        throw new Error(authError.message);
      }
      
      if (!data.user) {
        throw new Error('No user data returned');
      }
      
      // Create user profile from Supabase user data
      const user: UserProfile = {
        id: data.user.id,
        name: credentials.name || data.user.email?.split('@')[0] || 'User',
        email: data.user.email || '',
        isAnonymous: false,
        createdAt: new Date(data.user.created_at),
        updatedAt: new Date(data.user.updated_at || data.user.created_at)
      };
      
      setIsLoading(false);
      toast({
        title: "Registration successful!",
        description: `Welcome to Vyanman, ${user.name}!`,
      });
      
      return user;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Registration failed');
      console.error('Registration error:', error);
      setError(error);
      setIsLoading(false);
      
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive"
      });
      
      return null;
    }
  };

  const logout = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Attempting logout...');
      
      const { error: authError } = await supabase.auth.signOut();
      
      if (authError) {
        console.error('Supabase logout error:', authError);
        throw new Error(authError.message);
      }
      
      setIsLoading(false);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Logout failed');
      console.error('Logout error:', error);
      setError(error);
      setIsLoading(false);
      
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive"
      });
      
      return false;
    }
  };

  const getCurrentUser = async (): Promise<UserProfile | null> => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Get user error:', error);
        return null;
      }
      
      if (!user) {
        return null;
      }
      
      return {
        id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        isAnonymous: user.is_anonymous || false,
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at || user.created_at)
      };
    } catch (err) {
      console.error('Get current user error:', err);
      return null;
    }
  };

  const loginAsGuest = async (): Promise<UserProfile | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Attempting anonymous login...');
      
      const { data, error: authError } = await supabase.auth.signInAnonymously();
      
      if (authError) {
        console.error('Anonymous login error:', authError);
        throw new Error(authError.message);
      }
      
      if (!data.user) {
        throw new Error('No user data returned');
      }
      
      const user: UserProfile = {
        id: data.user.id,
        name: 'Guest User',
        email: '',
        isAnonymous: true,
        createdAt: new Date(data.user.created_at),
        updatedAt: new Date(data.user.updated_at || data.user.created_at)
      };
      
      setIsLoading(false);
      toast({
        title: "Guest session started",
        description: "You can now explore Vyanman as a guest.",
      });
      
      return user;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Guest login failed');
      console.error('Guest login error:', error);
      setError(error);
      setIsLoading(false);
      
      toast({
        title: "Guest login failed",
        description: error.message,
        variant: "destructive"
      });
      
      return null;
    }
  };

  return {
    login,
    register,
    logout,
    getCurrentUser,
    loginAsGuest,
    isLoading,
    error
  };
};
