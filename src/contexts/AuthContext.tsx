
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  isAnonymous: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  continueAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In a real app, these would be API calls to your backend
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, return a mock user
  return {
    id: '123',
    name: 'Demo User',
    email: email,
    isAnonymous: false
  };
};

const mockSignup = async (name: string, email: string, password: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, return a mock user
  return {
    id: '123',
    name: name,
    email: email,
    isAnonymous: false
  };
};

const mockGuestLogin = async (): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, return a mock anonymous user
  return {
    id: `guest-${Math.random().toString(36).substring(7)}`,
    name: 'Guest User',
    email: '',
    isAnonymous: true
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check localStorage for saved user data or token
    const savedUser = localStorage.getItem('vyanamana-user');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedInUser = await mockLogin(email, password);
      setUser(loggedInUser);
      localStorage.setItem('vyanamana-user', JSON.stringify(loggedInUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const newUser = await mockSignup(name, email, password);
      setUser(newUser);
      localStorage.setItem('vyanamana-user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const continueAsGuest = async () => {
    setIsLoading(true);
    try {
      const guestUser = await mockGuestLogin();
      setUser(guestUser);
      localStorage.setItem('vyanamana-user', JSON.stringify(guestUser));
    } catch (error) {
      console.error('Guest login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // In a real app, you'd call your logout API
      localStorage.removeItem('vyanamana-user');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
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
