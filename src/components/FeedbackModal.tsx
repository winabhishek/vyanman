
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ThumbsUp } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send feedback to your server
    console.log('Feedback submitted:', feedback);
    
    // Show success message
    setSubmitted(true);
    
    // Reset and close after delay
    setTimeout(() => {
      setFeedback('');
      setSubmitted(false);
      onClose();
    }, 2000);
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50 w-full max-w-md p-6"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", bounce: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Share Your Feedback</h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  We'd love to hear your thoughts on Vyānamana. Your feedback helps us improve!
                </p>
                
                <div className="mb-4">
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Your feedback here..."
                    className="w-full resize-none h-32"
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    className="mr-2"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600"
                  >
                    Submit
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            ) : (
              <motion.div 
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-300 mb-4">
                  <ThumbsUp className="h-8 w-8" />
                </div>
                <p className="text-lg font-medium">Thank you for your feedback!</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">We appreciate your input.</p>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
