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

export interface User {
  id: string;
  name?: string;
  email: string;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  preferredLanguage?: 'en' | 'hi';
  user_metadata?: {
    name?: string;
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
