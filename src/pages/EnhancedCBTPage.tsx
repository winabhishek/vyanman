
import React from 'react';
import { motion } from 'framer-motion';
import EnhancedCBTExercise from '@/components/enhanced/EnhancedCBTExercise';
import { useLanguage } from '@/contexts/LanguageContext';

const EnhancedCBTPage: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-heading gradient-heading mb-4">
          {language === 'en' ? 'AI-Enhanced Cognitive Behavioral Therapy' : 'AI-संवर्धित संज्ञानात्मक व्यवहार थेरेपी'}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {language === 'en' 
            ? 'Use these AI-powered exercises to identify, challenge, and change unhelpful thought patterns with personalized guidance.' 
            : 'व्यक्तिगत मार्गदर्शन के साथ अनुपयोगी विचार पैटर्न की पहचान करने, उन्हें चुनौती देने और उन्हें बदलने के लिए इन AI-संचालित अभ्यासों का उपयोग करें।'}
        </p>
      </motion.div>
      
      <EnhancedCBTExercise />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-12 max-w-3xl mx-auto p-6 glass-card bg-card/30 backdrop-blur-sm rounded-lg"
      >
        <h2 className="text-xl font-heading gradient-heading mb-4">
          {language === 'en' ? 'About AI-Enhanced CBT' : 'AI-संवर्धित CBT के बारे में'}
        </h2>
        <p className="mb-4">
          {language === 'en' 
            ? 'Our AI-enhanced Cognitive Behavioral Therapy combines traditional CBT techniques with artificial intelligence to provide personalized insights and suggestions. This approach helps you better understand your thought patterns and develop more effective coping strategies.' 
            : 'हमारी AI-संवर्धित संज्ञानात्मक व्यवहार थेरेपी पारंपरिक CBT तकनीकों को कृत्रिम बुद्धिमत्ता के साथ जोड़ती है ताकि व्यक्तिगत अंतर्दृष्टि और सुझाव प्रदान किए जा सकें।'}
        </p>
        <p>
          {language === 'en' 
            ? 'The AI assistant analyzes your thoughts and provides specific suggestions for cognitive distortions and rational responses, making your CBT practice more effective and personalized.' 
            : 'AI सहायक आपके विचारों का विश्लेषण करता है और संज्ञानात्मक विकृतियों और तार्किक प्रतिक्रियाओं के लिए विशिष्ट सुझाव प्रदान करता है।'}
        </p>
      </motion.div>
    </div>
  );
};

export default EnhancedCBTPage;
