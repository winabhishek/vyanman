
// This file would normally contain actual API calls to our backend
// For now, we'll use mock data and localStorage

import { Message, MoodEntry, Mood, User } from '../types';

// Mock delay function to simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to detect language (very basic implementation)
const detectLanguage = (text: string): 'en' | 'hi' => {
  // Simple detection based on Unicode ranges for Devanagari script
  const hindiPattern = /[\u0900-\u097F]/;
  return hindiPattern.test(text) ? 'hi' : 'en';
};

export const chatAPI = {
  // Get all messages for the current user
  getMessages: async (): Promise<Message[]> => {
    await delay(500);
    const storedMessages = localStorage.getItem('vyanamana-messages');
    return storedMessages ? JSON.parse(storedMessages) : [];
  },

  // Send a message and get a response
  sendMessage: async (content: string, language?: string): Promise<Message> => {
    await delay(1000);
    
    // Auto-detect language if not specified
    const detectedLanguage = language || detectLanguage(content);
    
    // This would be a call to your backend which would then call OpenAI/Gemini API
    // For now, we'll generate a simple response based on the language
    const botResponses = {
      en: [
        "I understand how you're feeling. Would you like to talk more about that?",
        "Thank you for sharing that with me. How long have you been feeling this way?",
        "That sounds challenging. What helps you cope when you feel like this?",
        "I'm here to listen. Would you like to explore some techniques that might help?",
        "Your feelings are valid. It takes courage to express them.",
        "I hear you. Sometimes just talking about our feelings can help us process them better.",
        "Would you like to try a quick mindfulness exercise to help center yourself?",
        "It sounds like you're going through a lot. Remember to be kind to yourself during this time.",
        "Have you spoken to anyone else about how you're feeling?",
        "I'm glad you reached out today. Is there anything specific you'd like support with?",
      ],
      hi: [
        "मैं समझता हूं कि आप कैसा महसूस कर रहे हैं। क्या आप इस बारे में अधिक बात करना चाहेंगे?",
        "मुझे अपनी बात बताने के लिए धन्यवाद। आप कब से ऐसा महसूस कर रहे हैं?",
        "यह चुनौतीपूर्ण लगता है। जब आप ऐसा महसूस करते हैं तो आपको क्या मदद करता है?",
        "मैं सुनने के लिए यहां हूं। क्या आप कुछ तकनीकों का पता लगाना चाहेंगे जो मदद कर सकती हैं?",
        "आपकी भावनाएं वैध हैं। उन्हें व्यक्त करने के लिए साहस की आवश्यकता होती है।",
        "मैं आपकी बात सुन रहा हूं। कभी-कभी अपनी भावनाओं के बारे में बात करने से हमें उन्हें बेहतर तरीके से समझने में मदद मिल सकती है।",
        "क्या आप खुद को केंद्रित करने में मदद के लिए एक त्वरित माइंडफुलनेस अभ्यास करना चाहेंगे?",
        "ऐसा लगता है कि आप बहुत कुछ से गुजर रहे हैं। इस समय अपने प्रति दयालु रहना याद रखें।",
        "क्या आपने अपनी भावनाओं के बारे में किसी और से बात की है?",
        "मुझे खुशी है कि आपने आज संपर्क किया। क्या कोई विशेष बात है जिसके लिए आप समर्थन चाहते हैं?",
      ]
    };
    
    // Enhanced response selection with some basic context awareness
    let currentLanguageResponses = botResponses[detectedLanguage as keyof typeof botResponses] || botResponses.en;
    
    // Improved sentiment analysis (in a real app, this would come from an AI model)
    // Let's add some basic keyword detection for sentiment
    const lowMoodKeywords = ['sad', 'depressed', 'unhappy', 'anxious', 'worried', 'stress', 'दुखी', 'चिंतित', 'परेशान', 'तनाव'];
    const positiveMoodKeywords = ['happy', 'joy', 'good', 'great', 'better', 'खुश', 'आनंद', 'अच्छा', 'बेहतर'];
    
    const hasLowMoodKeywords = lowMoodKeywords.some(keyword => content.toLowerCase().includes(keyword));
    const hasPositiveMoodKeywords = positiveMoodKeywords.some(keyword => content.toLowerCase().includes(keyword));
    
    const sentimentScore = hasLowMoodKeywords ? Math.random() * 1.5 : 
                          hasPositiveMoodKeywords ? 3 + Math.random() * 2 : 
                          Math.random() * 5; // 0-5 scale
    
    const mockSentiment = {
      score: sentimentScore,
      label: sentimentScore < 2.5 ? 'negative' : 'positive'
    };
    
    const userMessage: Message = {
      id: `user-msg-${Date.now()}`,
      content: content,
      sender: 'user',
      timestamp: new Date(),
      sentiment: mockSentiment
    };
    
    // Select response with slight preference for response type based on sentiment
    let responseIndex: number;
    if (mockSentiment.label === 'negative') {
      // For negative sentiment, prefer more empathetic responses (first half of the array)
      responseIndex = Math.floor(Math.random() * (currentLanguageResponses.length / 2));
    } else {
      // For positive sentiment, can use any response
      responseIndex = Math.floor(Math.random() * currentLanguageResponses.length);
    }
    
    const botMessage: Message = {
      id: `bot-msg-${Date.now() + 1}`,
      content: currentLanguageResponses[responseIndex],
      sender: 'bot',
      timestamp: new Date(Date.now() + 1000), // 1 second later
      language: detectedLanguage
    };
    
    // Save to localStorage
    const storedMessages = localStorage.getItem('vyanamana-messages');
    const messages = storedMessages ? JSON.parse(storedMessages) : [];
    messages.push(userMessage, botMessage);
    localStorage.setItem('vyanamana-messages', JSON.stringify(messages));
    
    return botMessage;
  }
};

export const moodAPI = {
  // Get all mood entries for the current user
  getMoodEntries: async (): Promise<MoodEntry[]> => {
    await delay(500);
    const storedMoods = localStorage.getItem('vyanamana-moods');
    return storedMoods ? JSON.parse(storedMoods) : [];
  },
  
  // Add a new mood entry
  addMoodEntry: async (mood: Mood, note?: string): Promise<MoodEntry> => {
    await delay(500);
    
    const newEntry: MoodEntry = {
      id: `mood-${Date.now()}`,
      userId: 'current-user', // In a real app, this would be the actual user ID
      mood,
      note,
      timestamp: new Date()
    };
    
    // Save to localStorage
    const storedMoods = localStorage.getItem('vyanamana-moods');
    const moods = storedMoods ? JSON.parse(storedMoods) : [];
    moods.push(newEntry);
    localStorage.setItem('vyanamana-moods', JSON.stringify(moods));
    
    return newEntry;
  },
  
  // Get mood analytics (new method)
  getMoodAnalytics: async (): Promise<{
    averageMood: number;
    moodCounts: Record<Mood, number>;
    mostFrequentMood: Mood;
  }> => {
    await delay(700);
    
    const storedMoods = localStorage.getItem('vyanamana-moods');
    const moods: MoodEntry[] = storedMoods ? JSON.parse(storedMoods) : [];
    
    if (moods.length === 0) {
      return {
        averageMood: 2.5, // Neutral
        moodCounts: {
          joyful: 0,
          happy: 0,
          content: 0,
          neutral: 0,
          sad: 0,
          anxious: 0,
          stressed: 0,
          angry: 0,
          exhausted: 0
        },
        mostFrequentMood: 'neutral'
      };
    }
    
    // Calculate mood counts
    const moodCounts: Record<Mood, number> = {
      joyful: 0,
      happy: 0,
      content: 0,
      neutral: 0,
      sad: 0,
      anxious: 0,
      stressed: 0,
      angry: 0,
      exhausted: 0
    };
    
    moods.forEach(entry => {
      moodCounts[entry.mood]++;
    });
    
    // Calculate most frequent mood
    const mostFrequentMood = Object.entries(moodCounts)
      .reduce((max, [mood, count]) => count > max.count ? { mood: mood as Mood, count } : max, { mood: 'neutral' as Mood, count: 0 })
      .mood;
    
    // Calculate average mood (simple implementation)
    const moodValues: Record<Mood, number> = {
      joyful: 5,
      happy: 4,
      content: 3.5,
      neutral: 2.5,
      sad: 1.5,
      anxious: 1,
      stressed: 1,
      angry: 0.5,
      exhausted: 1
    };
    
    const totalMoodValue = moods.reduce((sum, entry) => sum + moodValues[entry.mood], 0);
    const averageMood = totalMoodValue / moods.length;
    
    return {
      averageMood,
      moodCounts,
      mostFrequentMood
    };
  }
};

export const authAPI = {
  // Login with email and password
  login: async (email: string, password: string): Promise<User> => {
    await delay(1000);
    
    // In a real app, this would be a call to your backend
    if (email && password) {
      const user = {
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
  register: async (name: string, email: string, password: string, preferredLanguage: string = 'en'): Promise<User> => {
    await delay(1000);
    
    // In a real app, this would be a call to your backend
    if (name && email && password) {
      const user = {
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
  loginAsGuest: async (preferredLanguage: string = 'en'): Promise<User> => {
    await delay(500);
    
    const guestUser = {
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
