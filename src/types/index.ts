
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sentiment?: SentimentAnalysis;
}

export interface SentimentAnalysis {
  score: number; // Raw score from sentiment analysis (usually between -1 and 1 or 0 to 5)
  label: string; // The sentiment label (e.g., "positive", "negative", "neutral")
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
  name: string;
  email: string;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  name: string; // Generated name based on the first message
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
