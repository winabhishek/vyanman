
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading = false }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { language } = useLanguage();
  
  // Placeholder suggestions to help users get started
  const placeholders = {
    en: [
      "How can I manage anxiety?",
      "I'm feeling stressed about work...",
      "What are some mindfulness techniques?",
      "How can I improve my sleep quality?",
      "I'm feeling down today..."
    ],
    hi: [
      "चिंता को कैसे प्रबंधित करें?",
      "मुझे काम के बारे में तनाव महसूस हो रहा है...",
      "कुछ माइंडफुलनेस तकनीक क्या हैं?",
      "मैं अपनी नींद की गुणवत्ता कैसे सुधार सकता हूं?",
      "मैं आज उदास महसूस कर रहा हूँ..."
    ]
  };
  
  // Randomly select a placeholder from the language-specific list
  const getRandomPlaceholder = () => {
    const list = language === 'en' ? placeholders.en : placeholders.hi;
    const index = Math.floor(Math.random() * list.length);
    return list[index];
  };
  
  const [placeholder, setPlaceholder] = useState(getRandomPlaceholder());
  
  // Change placeholder periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder(getRandomPlaceholder());
    }, 5000);
    
    return () => clearInterval(interval);
  }, [language]);
  
  // Auto-resize the textarea based on content, with a maximum height
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      
      // Calculate new height with a maximum limit
      const maxHeight = 150; // approximately 5 rows
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = Math.min(scrollHeight, maxHeight);
      
      textareaRef.current.style.height = `${newHeight}px`;
      
      // Add scrollbar if content exceeds max height
      textareaRef.current.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [message]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;
    
    onSendMessage(message.trim());
    setMessage(''); // Explicitly clear the input after sending
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.overflowY = 'hidden';
      textareaRef.current.focus(); // Refocus the textarea for better UX
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter without Shift key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleRecording = () => {
    // In a real implementation, this would start/stop voice recording
    if (!isRecording) {
      setIsRecording(true);
      // Mock recording for now
      setTimeout(() => {
        setIsRecording(false);
        // Sample voice-to-text result
        const mockText = language === 'en' 
          ? "I've been feeling anxious lately. Can you help me?" 
          : "मुझे हाल ही में चिंता महसूस हो रही है। क्या आप मुझे मदद कर सकते हैं?";
        setMessage(mockText);
      }, 2000);
    } else {
      setIsRecording(false);
    }
  };
  
  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="flex items-end gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex-1">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="resize-none min-h-[50px] pr-24 py-3 focus:border-amber-300 focus:ring-amber-300 dark:focus:border-amber-600 dark:focus:ring-amber-600 transition-all border rounded-md shadow-sm"
          disabled={isLoading || isRecording}
        />
        <div className="absolute bottom-1.5 right-1.5 flex space-x-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400"
            onClick={toggleRecording}
            disabled={isLoading}
          >
            {isRecording ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
            <span className="sr-only">
              {language === 'en' ? 'Voice input' : 'आवाज़ इनपुट'}
            </span>
          </Button>
          <Button
            type="submit"
            size="icon"
            className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white"
            disabled={!message.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">
              {language === 'en' ? 'Send message' : 'संदेश भेजें'}
            </span>
          </Button>
        </div>
      </div>
    </motion.form>
  );
};

export default ChatInput;
