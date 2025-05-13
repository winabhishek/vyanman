
import React from 'react';
import { motion } from 'framer-motion';
import CBTExercise from '@/components/CBTExercise';
import { useLanguage } from '@/contexts/LanguageContext';

const CBTPage: React.FC = () => {
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
          {language === 'en' ? 'Cognitive Behavioral Therapy' : 'संज्ञानात्मक व्यवहार थेरेपी'}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {language === 'en' 
            ? 'Use these structured exercises to identify, challenge, and change unhelpful thought patterns.' 
            : 'अनुपयोगी विचार पैटर्न की पहचान करने, उन्हें चुनौती देने और उन्हें बदलने के लिए इन संरचित अभ्यासों का उपयोग करें।'}
        </p>
      </motion.div>
      
      <CBTExercise />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-12 max-w-3xl mx-auto p-6 glass-card bg-card/30 backdrop-blur-sm rounded-lg"
      >
        <h2 className="text-xl font-heading gradient-heading mb-4">
          {language === 'en' ? 'About CBT' : 'CBT के बारे में'}
        </h2>
        <p className="mb-4">
          {language === 'en' 
            ? 'Cognitive Behavioral Therapy (CBT) is a psychotherapy approach that helps you identify and challenge unhelpful thoughts and beliefs, understand the behavior and motivation that follows from them, and develop practical strategies to achieve better mental health.' 
            : 'संज्ञानात्मक व्यवहार थेरेपी (CBT) एक मनोचिकित्सा दृष्टिकोण है जो आपको अनुपयोगी विचारों और मान्यताओं की पहचान करने और उन्हें चुनौती देने, उनके बाद होने वाले व्यवहार और प्रेरणा को समझने, और बेहतर मानसिक स्वास्थ्य प्राप्त करने के लिए व्यावहारिक रणनीतियों को विकसित करने में मदद करता है।'}
        </p>
        <p>
          {language === 'en' 
            ? 'Regular practice of these exercises can help reduce symptoms of anxiety, depression, and other mental health conditions.' 
            : 'इन अभ्यासों का नियमित अभ्यास चिंता, अवसाद और अन्य मानसिक स्वास्थ्य स्थितियों के लक्षणों को कम करने में मदद कर सकता है।'}
        </p>
      </motion.div>
    </div>
  );
};

export default CBTPage;
