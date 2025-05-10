
import { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

export type Session = SupabaseSession;
export type User = SupabaseUser;

// Re-export existing types
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sentiment?: SentimentAnalysis;
  language?: 'en' | 'hi';
}

export interface SentimentAnalysis {
  score: number;
  label: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  mood: Mood;
  note?: string;
  timestamp: Date;
}

export type Mood = 
  | 'joyful'
  | 'happy'
  | 'content'
  | 'neutral'
  | 'sad'
  | 'anxious'
  | 'stressed'
  | 'angry'
  | 'exhausted';

// Use composition instead of extending SupabaseUser to avoid conflicts
export interface UserProfile {
  id: string;
  name?: string;
  email: string;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  preferredLanguage?: 'en' | 'hi';
  user_metadata?: {
    name?: string;
    preferred_language?: 'en' | 'hi';
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  name: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
