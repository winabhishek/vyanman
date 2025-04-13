
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
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
        
        // Use setTimeout to avoid Supabase deadlocks
        if (session?.user && event === 'SIGNED_IN') {
          setTimeout(() => {
            toast.success(`Welcome, ${session.user.email}`);
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
      // Create user in Supabase
      const { error: signUpError, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
          }
        }
      });
      
      if (signUpError) {
        throw signUpError;
      }
      
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
    // For guest login, we're not using Supabase auth
    // This just simulates a guest session using local state
    setIsLoading(true);
    try {
      const guestUser = {
        id: `guest-${Math.random().toString(36).substring(7)}`,
        email: '',
        user_metadata: {
          name: 'Guest User',
        },
      } as User;
      
      // Set local guest state
      setUser(guestUser);
      setIsLoading(false);

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
