
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '../types';
import { supabase } from '../supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { toast } from "sonner";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  continueAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast: uiToast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false); // Always reset loading after auth state change
        
        // Use setTimeout to avoid Supabase deadlocks
        if (session?.user) {
          setTimeout(() => {
            if (event === 'SIGNED_IN') {
              toast.success(`Welcome back, ${session.user.email}`);
            } else if (event === 'TOKEN_REFRESHED') {
              console.log('Token refreshed successfully');
            }
          }, 0);
        }
        
        // Handle email verification completion
        if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
          setTimeout(() => {
            toast.success(`Account verified successfully! Welcome to Vyanman.`);
            // Redirect to main app after verification
            if (window.location.pathname === '/') {
              window.location.href = '/chat';
            }
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      // Session will be handled by onAuthStateChange
    } catch (error: any) {
      uiToast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Create user in Supabase with proper redirect URL
      const { error: signUpError } = await supabase.auth.signUp({ 
        email, 
        password,
          options: {
            data: {
              name,
            },
            emailRedirectTo: `https://vyanman.in/auth/callback`
          }
      });
      
      if (signUpError) {
        throw signUpError;
      }
      
      // Show success message for email confirmation
      uiToast({
        title: "Account created!",
        description: "Please check your email and click the verification link to complete your registration.",
      });
      
      // Session will be handled by onAuthStateChange
    } catch (error: any) {
      uiToast({
        title: "Signup failed",
        description: error.message || "Please try again with different credentials.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const continueAsGuest = async () => {
    setIsLoading(true);
    try {
      // Create a temporary guest user
      const guestUser = {
        id: `guest_${Date.now()}`,
        email: 'guest@example.com',
        aud: 'authenticated',
        role: 'authenticated',
        created_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        phone_confirmed_at: null,
        confirmation_sent_at: null,
        recovery_sent_at: null,
        email_change_sent_at: null,
        new_email: null,
        invited_at: null,
        action_link: null,
        email_change: null,
        phone_change: null,
        phone: null,
        confirmed_at: new Date().toISOString(),
        email_change_confirm_status: 0,
        phone_change_confirm_status: 0,
        banned_until: null,
        user_metadata: { name: 'Guest User' },
        app_metadata: {},
        identities: [],
        factors: [],
        is_anonymous: true
      };
      
      const guestSession = {
        access_token: 'guest_token',
        refresh_token: 'guest_refresh',
        expires_in: 3600,
        expires_at: Date.now() / 1000 + 3600,
        token_type: 'bearer',
        user: guestUser
      };

      setSession(guestSession as any);
      setUser(guestUser as any);

      toast.info("You're browsing as a guest", {
        description: "Create an account to save your progress"
      });
      
      return;
    } catch (error: any) {
      uiToast({
        title: "Failed to continue as guest",
        description: "Please try again later.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Session will be handled by onAuthStateChange
      toast.info("You've been logged out");
    } catch (error: any) {
      uiToast({
        title: "Logout failed",
        description: error.message || "An error occurred while logging out.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        session,
        user, 
        isLoading, 
        isAuthenticated: !!user, 
        login, 
        signup, 
        continueAsGuest, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
