
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'app.name': 'Vyānamana',
    'app.tagline': 'Breathe. Reflect. Heal.',
    'chat.placeholder': 'Type your message here...',
    'chat.send': 'Send',
    'mood.title': 'How are you feeling?',
    'mood.subtitle': 'Select the emoji that best represents your current mood.',
    'mood.note.label': 'Add a note (optional)',
    'mood.note.placeholder': "What's contributing to your mood today?",
    'mood.submit': 'Log Your Mood',
    'mood.success': 'Mood logged successfully',
    'mood.history': 'Your Mood History',
    'mood.nodata': 'No mood entries yet. Start logging your mood to see your history.',
    'profile.title': 'Your Profile',
    'profile.mood.history': 'Mood History',
    'profile.stats': 'Your Stats',
    'nav.chat': 'Chat',
    'nav.mood': 'Mood Tracker',
    'nav.profile': 'Profile',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.logout': 'Logout',
    'theme.toggle': 'Toggle theme',
    'language.toggle': 'Switch to Hindi',
    'welcome.title': 'Your Digital Companion for Mental Wellbeing',
    'welcome.subtitle': 'Vyānamana is here to listen, support, and guide you through your mental health journey.',
    'welcome.cta.start': 'Start Chatting',
    'welcome.cta.account': 'Create Account',
  },
  hi: {
    'app.name': 'व्यानमन',
    'app.tagline': 'साँस लें। प्रतिबिंबित करें। आरोग्य पाएं।',
    'chat.placeholder': 'अपना संदेश यहां लिखें...',
    'chat.send': 'भेजें',
    'mood.title': 'आप कैसा महसूस कर रहे हैं?',
    'mood.subtitle': 'वह इमोजी चुनें जो आपके वर्तमान मूड का सबसे अच्छा प्रतिनिधित्व करता है।',
    'mood.note.label': 'एक नोट जोड़ें (वैकल्पिक)',
    'mood.note.placeholder': 'आज आपके मूड में क्या योगदान दे रहा है?',
    'mood.submit': 'अपना मूड लॉग करें',
    'mood.success': 'मूड सफलतापूर्वक लॉग किया गया',
    'mood.history': 'आपका मूड इतिहास',
    'mood.nodata': 'अभी तक कोई मूड एंट्री नहीं। अपना इतिहास देखने के लिए अपना मूड लॉग करना शुरू करें।',
    'profile.title': 'आपका प्रोफ़ाइल',
    'profile.mood.history': 'मूड इतिहास',
    'profile.stats': 'आपके आंकड़े',
    'nav.chat': 'चैट',
    'nav.mood': 'मूड ट्रैकर',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.login': 'लॉगिन',
    'nav.signup': 'साइन अप',
    'nav.logout': 'लॉगआउट',
    'theme.toggle': 'थीम बदलें',
    'language.toggle': 'Switch to English',
    'welcome.title': 'मानसिक स्वास्थ्य के लिए आपका डिजिटल साथी',
    'welcome.subtitle': 'व्यानमन आपकी मानसिक स्वास्थ्य यात्रा में सुनने, समर्थन करने और मार्गदर्शन करने के लिए यहां है।',
    'welcome.cta.start': 'चैटिंग शुरू करें',
    'welcome.cta.account': 'अकाउंट बनाएं',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get saved language preference or default to English
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('vyanamana-language');
    return (savedLanguage as Language) || 'en';
  });

  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem('vyanamana-language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
