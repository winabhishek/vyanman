
import { supabase } from '../supabaseClient';
import { User, UserProfile } from '../types';

export const authAPI = {
  // Login with email and password
  login: async (email: string, password: string): Promise<User> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Register a new user
  register: async (name: string, email: string, password: string, preferredLanguage: 'en' | 'hi' = 'en'): Promise<User> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            preferred_language: preferredLanguage
          }
        }
      });
      
      if (error) throw error;
      
      return data.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Continue as guest
  loginAsGuest: async (preferredLanguage: 'en' | 'hi' = 'en'): Promise<User> => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) throw error;
      
      return data.user;
    } catch (error) {
      console.error('Anonymous login error:', error);
      throw error;
    }
  },
  
  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      return data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
  
  // Update user profile
  updateUserProfile: async (userId: string, updates: Partial<UserProfile>): Promise<User> => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: updates.name,
          preferred_language: updates.preferredLanguage
        }
      });
      
      if (error) throw error;
      
      return data.user;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  },
  
  // Logout
  logout: async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
};
