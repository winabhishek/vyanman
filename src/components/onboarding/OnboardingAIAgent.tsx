
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, User } from 'lucide-react';

interface OnboardingAIAgentProps {
  onNext: () => void;
  onPrevious: () => void;
}

const OnboardingAIAgent: React.FC<OnboardingAIAgentProps> = ({ onNext, onPrevious }) => {
  const [currentConversation, setCurrentConversation] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState(0);

  const conversations = [
    {
      title: "Anxiety Support",
      messages: [
        { type: 'user', text: "I'm feeling really anxious about tomorrow's presentation..." },
        { type: 'ai', text: "I understand how nerve-wracking presentations can be. Let's try a 2-minute breathing exercise together. Would that help?" },
        { type: 'user', text: "Yes, that sounds good." },
        { type: 'ai', text: "Perfect! Let's start with 4 deep breaths. Breathe in for 4 counts, hold for 4, then exhale for 6..." }
      ]
    },
    {
      title: "Daily Check-in",
      messages: [
        { type: 'user', text: "I've been feeling low energy lately." },
        { type: 'ai', text: "Thank you for sharing that with me. Low energy can have many causes. How has your sleep been recently?" },
        { type: 'user', text: "Not great, maybe 5-6 hours a night." },
        { type: 'ai', text: "Sleep is crucial for energy levels. Let me suggest a gentle evening routine that might help improve your sleep quality." }
      ]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (visibleMessages < conversations[currentConversation].messages.length) {
        setVisibleMessages(visibleMessages + 1);
      } else {
        // Switch to next conversation
        setTimeout(() => {
          if (currentConversation < conversations.length - 1) {
            setCurrentConversation(currentConversation + 1);
            setVisibleMessages(0);
          }
        }, 2000);
      }
    }, 1500);

    return () => clearInterval(timer);
  }, [currentConversation, visibleMessages, conversations]);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-vyanamana-500 to-vyanamana-700 flex items-center justify-center shadow-2xl"
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 20px rgba(255, 184, 0, 0.3)",
                "0 0 40px rgba(255, 184, 0, 0.5)",
                "0 0 20px rgba(255, 184, 0, 0.3)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Bot className="w-12 h-12 text-white" />
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-bold gradient-heading mb-4">
            Meet Your AI Companion
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience empathetic conversations in both English and Hindi
          </p>
        </motion.div>

        {/* Chat Simulation */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-vyanamana-500">
                  {conversations[currentConversation].title}
                </h3>
              </div>
              
              <div className="space-y-4 min-h-[400px]">
                <AnimatePresence>
                  {conversations[currentConversation].messages.slice(0, visibleMessages).map((message, index) => (
                    <motion.div
                      key={`${currentConversation}-${index}`}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' 
                            ? 'bg-vyanamana-500' 
                            : 'bg-gradient-to-br from-gray-600 to-gray-700'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className={`rounded-2xl px-4 py-3 ${
                          message.type === 'user'
                            ? 'bg-vyanamana-500 text-white'
                            : 'bg-muted/50 text-foreground'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.text}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Highlight */}
        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="space-y-2">
            <div className="text-2xl">🇮🇳</div>
            <h4 className="font-semibold">Bilingual Support</h4>
            <p className="text-sm text-muted-foreground">English & Hindi conversations</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl">🕒</div>
            <h4 className="font-semibold">24/7 Availability</h4>
            <p className="text-sm text-muted-foreground">Always here when you need us</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl">🎯</div>
            <h4 className="font-semibold">Personalized Care</h4>
            <p className="text-sm text-muted-foreground">Tailored to your unique needs</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OnboardingAIAgent;
