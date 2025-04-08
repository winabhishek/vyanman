
// This file would normally contain actual API calls to our backend
// For now, we'll use mock data and localStorage

import { Message, MoodEntry, Mood, User } from '../types';

// Mock delay function to simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const chatAPI = {
  // Get all messages for the current user
  getMessages: async (): Promise<Message[]> => {
    await delay(500);
    const storedMessages = localStorage.getItem('vyanamana-messages');
    return storedMessages ? JSON.parse(storedMessages) : [];
  },

  // Send a message and get a response
  sendMessage: async (content: string, language: string = 'en'): Promise<Message> => {
    await delay(1000);
    
    // This would be a call to your backend which would then call OpenAI API
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
    
    const currentLanguageResponses = botResponses[language as keyof typeof botResponses] || botResponses.en;
    const randomResponse = currentLanguageResponses[Math.floor(Math.random() * currentLanguageResponses.length)];
    
    // Mock sentiment analysis (in a real app, this would come from the backend)
    const mockSentiment = {
      score: Math.random() * 5, // 0-5 scale
      label: Math.random() > 0.5 ? 'positive' : 'negative'
    };
    
    const userMessage: Message = {
      id: `user-msg-${Date.now()}`,
      content: content,
      sender: 'user',
      timestamp: new Date(),
      sentiment: mockSentiment
    };
    
    const botMessage: Message = {
      id: `bot-msg-${Date.now() + 1}`,
      content: randomResponse,
      sender: 'bot',
      timestamp: new Date(Date.now() + 1000), // 1 second later
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
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return user;
    }
    
    throw new Error('Invalid credentials');
  },
  
  // Register a new user
  register: async (name: string, email: string, password: string): Promise<User> => {
    await delay(1000);
    
    // In a real app, this would be a call to your backend
    if (name && email && password) {
      const user = {
        id: `user-${Date.now()}`,
        name,
        email,
        isAnonymous: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return user;
    }
    
    throw new Error('Invalid registration data');
  },
  
  // Continue as guest
  loginAsGuest: async (): Promise<User> => {
    await delay(500);
    
    const guestUser = {
      id: `guest-${Date.now()}`,
      name: 'Anonymous User',
      email: '',
      isAnonymous: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return guestUser;
  },
  
  // Logout
  logout: async (): Promise<void> => {
    await delay(500);
    // In a real app, this would involve clearing tokens, etc.
  }
};
