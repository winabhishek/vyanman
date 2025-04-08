
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import MoodTracker from '@/components/MoodTracker';
import { Message } from '@/types';
import { chatAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

const Chat: React.FC = () => {
  const { isAuthenticated, continueAsGuest } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  
  // Fetch existing messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const fetchedMessages = await chatAPI.getMessages();
        if (fetchedMessages.length === 0) {
          // Add a welcome message if there are no messages
          const welcomeMessage: Message = {
            id: 'welcome',
            content: "Hello! I'm Vyānamana, your mental wellbeing companion. How are you feeling today?",
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages([welcomeMessage]);
        } else {
          setMessages(fetchedMessages);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };
    
    if (isAuthenticated) {
      loadMessages();
    }
  }, [isAuthenticated]);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = async (content: string) => {
    if (!isAuthenticated) {
      // If not authenticated, continue as guest and then send message
      try {
        await continueAsGuest();
      } catch (error) {
        console.error('Error continuing as guest:', error);
        return;
      }
    }
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const botResponse = await chatAPI.sendMessage(content);
      setMessages(prev => [...prev, botResponse]);
      
      // Suggest mood tracking if appropriate
      const moodKeywords = ['feeling', 'mood', 'emotions', 'stress', 'anxious', 'happy', 'sad'];
      const shouldSuggestMoodTracking = moodKeywords.some(keyword => 
        content.toLowerCase().includes(keyword)
      );
      
      if (shouldSuggestMoodTracking && !showMoodTracker) {
        // Show mood tracker after a delay
        setTimeout(() => {
          setShowMoodTracker(true);
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMoodLogged = () => {
    // Hide mood tracker after logging
    setShowMoodTracker(false);
    
    // Add a follow-up message
    const followUpMessage: Message = {
      id: `bot-${Date.now()}`,
      content: "Thanks for logging your mood! Tracking regularly can help you notice patterns in how you feel. Is there anything specific about your mood you'd like to discuss?",
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, followUpMessage]);
  };
  
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col h-[calc(100vh-16rem)]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold font-heading">Chat with Vyānamana</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/mood-tracker')}
            className="flex items-center gap-2"
          >
            View Mood History
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 border rounded-lg mb-4 bg-card">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <p className="text-muted-foreground mb-4">
                Start chatting with Vyānamana, your mental wellbeing companion.
              </p>
              <p className="text-sm text-muted-foreground">
                Your conversations are private and secure.
              </p>
            </div>
          ) : (
            <>
              {messages.map(message => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
              
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="chat-bubble-bot">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="sticky bottom-0 bg-background pt-2">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          
          {messages.length > 10 && (
            <div className="flex justify-center mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (messagesEndRef.current) {
                    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-2"
              >
                <ArrowUp className="h-4 w-4" />
                Scroll to bottom
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {showMoodTracker && (
        <div className="mt-8">
          <MoodTracker onMoodLogged={handleMoodLogged} />
        </div>
      )}
    </div>
  );
};

export default Chat;
