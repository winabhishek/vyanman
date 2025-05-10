
import { Message, MoodEntry, UserProfile } from '../types';
import { User } from '@supabase/supabase-js';

export const toUserProfile = (user: User): UserProfile => {
  return {
    id: user.id,
    name: user.user_metadata?.name,
    email: user.email || '',
    isAnonymous: !user.email,
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.updated_at || user.created_at),
    preferredLanguage: (user.user_metadata?.preferred_language || 'en') as 'en' | 'hi',
    user_metadata: user.user_metadata
  };
};

export const toMessage = (dbMessage: any): Message => {
  return {
    id: dbMessage.id,
    content: dbMessage.content,
    sender: dbMessage.is_bot ? 'bot' : 'user',
    timestamp: new Date(dbMessage.created_at),
    sentiment: dbMessage.sentiment || { score: 3, label: 'neutral' },
  };
};

export const toMoodEntry = (dbMood: any): MoodEntry => {
  return {
    id: dbMood.id,
    userId: dbMood.user_id,
    mood: dbMood.mood_type as any,
    note: dbMood.note,
    timestamp: new Date(dbMood.created_at)
  };
};
