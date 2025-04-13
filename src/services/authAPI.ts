import { User, UserProfile } from '../types';

// Mock delay function to simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authAPI = {
  // Login with email and password
  login: async (email: string, password: string): Promise<User> => {
    await delay(1000);
    
    // In a real app, this would be a call to your backend
    if (email && password) {
      const user: User = {
        id: 'user-123',
        name: email.split('@')[0],
        email,
        isAnonymous: false,
        preferredLanguage: 'en',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Store user in localStorage for session persistence
      localStorage.setItem('vyanamana-user', JSON.stringify(user));
      
      return user;
    }
    
    throw new Error('Invalid credentials');
  },
  
  // Register a new user
  register: async (name: string, email: string, password: string, preferredLanguage: 'en' | 'hi' = 'en'): Promise<User> => {
    await delay(1000);
    
    // In a real app, this would be a call to your backend
    if (name && email && password) {
      const user: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        isAnonymous: false,
        preferredLanguage,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Store user in localStorage for session persistence
      localStorage.setItem('vyanamana-user', JSON.stringify(user));
      
      return user;
    }
    
    throw new Error('Invalid registration data');
  },
  
  // Continue as guest
  loginAsGuest: async (preferredLanguage: 'en' | 'hi' = 'en'): Promise<User> => {
    await delay(500);
    
    const guestUser: User = {
      id: `guest-${Date.now()}`,
      name: 'Anonymous User',
      email: '',
      isAnonymous: true,
      preferredLanguage,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Store user in localStorage for session persistence
    localStorage.setItem('vyanamana-user', JSON.stringify(guestUser));
    
    return guestUser;
  },
  
  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    await delay(300);
    
    const storedUser = localStorage.getItem('vyanamana-user');
    return storedUser ? JSON.parse(storedUser) : null;
  },
  
  // Update user profile
  updateUserProfile: async (userId: string, updates: Partial<User>): Promise<User> => {
    await delay(800);
    
    const storedUser = localStorage.getItem('vyanamana-user');
    if (!storedUser) {
      throw new Error('User not found');
    }
    
    const user: User = JSON.parse(storedUser);
    
    if (user.id !== userId) {
      throw new Error('Unauthorized');
    }
    
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date()
    };
    
    localStorage.setItem('vyanamana-user', JSON.stringify(updatedUser));
    
    return updatedUser;
  },
  
  // Logout
  logout: async (): Promise<void> => {
    await delay(500);
    localStorage.removeItem('vyanamana-user');
    // In a real app, this would also invalidate tokens, etc.
  }
};
