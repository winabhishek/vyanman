
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface ThoughtRecord {
  id: string;
  situation: string;
  thought: string;
  emotion: string;
  evidence: string;
  alternativeThought: string;
  createdAt: Date;
}

const CBTExercise: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState<number>(1);
  const [thoughtRecord, setThoughtRecord] = useState<Partial<ThoughtRecord>>({
    situation: '',
    thought: '',
    emotion: '',
    evidence: '',
    alternativeThought: ''
  });
  
  const handleInputChange = (field: keyof ThoughtRecord, value: string) => {
    setThoughtRecord(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const nextStep = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Save the completed thought record
      const newRecord: ThoughtRecord = {
        ...thoughtRecord as ThoughtRecord,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      
      // Save to localStorage for now
      const savedRecords = localStorage.getItem('cbt-records');
      const records = savedRecords ? JSON.parse(savedRecords) : [];
      records.push(newRecord);
      localStorage.setItem('cbt-records', JSON.stringify(records));
      
      toast({
        title: language === 'en' ? 'Exercise Completed' : 'अभ्यास पूरा हुआ',
        description: language === 'en' 
          ? 'Your thought record has been saved.' 
          : 'आपका विचार रिकॉर्ड सहेज लिया गया है।',
      });
      
      // Reset form
      setThoughtRecord({
        situation: '',
        thought: '',
        emotion: '',
        evidence: '',
        alternativeThought: ''
      });
      setStep(1);
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <CardTitle>{language === 'en' ? 'Identify the Situation' : 'परिस्थिति की पहचान करें'}</CardTitle>
            <CardDescription>
              {language === 'en' 
                ? 'Describe a situation that triggered negative emotions or thoughts.' 
                : 'उस स्थिति का वर्णन करें जिसने नकारात्मक भावनाओं या विचारों को ट्रिगर किया।'}
            </CardDescription>
            <Textarea 
              placeholder={language === 'en' ? 'Describe what happened...' : 'वर्णन करें कि क्या हुआ...'}
              value={thoughtRecord.situation}
              onChange={(e) => handleInputChange('situation', e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <CardTitle>{language === 'en' ? 'Identify Automatic Thoughts' : 'स्वचालित विचारों की पहचान करें'}</CardTitle>
            <CardDescription>
              {language === 'en' 
                ? 'What thoughts went through your mind in this situation?' 
                : 'इस स्थिति में आपके मन में क्या विचार आए?'}
            </CardDescription>
            <Textarea 
              placeholder={language === 'en' ? 'Write your thoughts...' : 'अपने विचार लिखें...'}
              value={thoughtRecord.thought}
              onChange={(e) => handleInputChange('thought', e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <CardTitle>{language === 'en' ? 'Identify Emotions' : 'भावनाओं की पहचान करें'}</CardTitle>
            <CardDescription>
              {language === 'en' 
                ? 'What emotions did you feel? Rate their intensity (0-100%)' 
                : 'आपने कौन सी भावनाएँ महसूस कीं? उनकी तीव्रता को रेट करें (0-100%)'}
            </CardDescription>
            <Textarea 
              placeholder={language === 'en' ? 'Describe your emotions...' : 'अपनी भावनाओं का वर्णन करें...'}
              value={thoughtRecord.emotion}
              onChange={(e) => handleInputChange('emotion', e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <CardTitle>{language === 'en' ? 'Challenge Your Thoughts' : 'अपने विचारों को चुनौती दें'}</CardTitle>
            <CardDescription>
              {language === 'en' 
                ? 'What evidence supports or contradicts your thoughts?' 
                : 'कौन से प्रमाण आपके विचारों का समर्थन या खंडन करते हैं?'}
            </CardDescription>
            <Textarea 
              placeholder={language === 'en' ? 'List evidence for and against...' : 'पक्ष और विपक्ष में सबूतों की सूची बनाएं...'}
              value={thoughtRecord.evidence}
              onChange={(e) => handleInputChange('evidence', e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <CardTitle>{language === 'en' ? 'Develop Alternative Thoughts' : 'वैकल्पिक विचार विकसित करें'}</CardTitle>
            <CardDescription>
              {language === 'en' 
                ? 'What's a more balanced or helpful way to think about the situation?' 
                : 'स्थिति के बारे में सोचने का एक अधिक संतुलित या सहायक तरीका क्या है?'}
            </CardDescription>
            <Textarea 
              placeholder={language === 'en' ? 'Write alternative thoughts...' : 'वैकल्पिक विचार लिखें...'}
              value={thoughtRecord.alternativeThought}
              onChange={(e) => handleInputChange('alternativeThought', e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <Card className="glass-card bg-card/30 backdrop-blur-sm border-vyanman-300/20">
        <CardHeader>
          <CardTitle className="text-xl font-heading gradient-heading">
            {language === 'en' ? 'Cognitive Behavioral Therapy Exercise' : 'संज्ञानात्मक व्यवहार थेरेपी अभ्यास'}
          </CardTitle>
          <CardDescription>
            {language === 'en' 
              ? 'This exercise helps you identify and challenge negative thoughts.' 
              : 'यह अभ्यास आपको नकारात्मक विचारों की पहचान करने और उन्हें चुनौती देने में मदद करता है।'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4, 5].map((stepNumber) => (
                <div 
                  key={stepNumber}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm 
                    ${step >= stepNumber 
                      ? 'bg-vyanman-500 text-black' 
                      : 'bg-muted/50 text-muted-foreground'}`}
                >
                  {stepNumber}
                </div>
              ))}
            </div>
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-vyanman-500 transition-all" 
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
          
          {renderStepContent()}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={step === 1}
          >
            {language === 'en' ? 'Previous' : 'पिछला'}
          </Button>
          <Button 
            onClick={nextStep}
            className="bg-vyanman-500 hover:bg-vyanman-600"
          >
            {step === 5 
              ? (language === 'en' ? 'Complete' : 'पूर्ण करें') 
              : (language === 'en' ? 'Next' : 'अगला')}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CBTExercise;
