
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { moodAPI } from '@/services'; // Updated import
import { useLanguage } from '@/contexts/LanguageContext';
import { Mood } from '@/types';

const MoodTracker: React.FC<{ onMoodLogged: () => void }> = ({ onMoodLogged }) => {
  const [moodValue, setMoodValue] = useState(2.5); // Neutral
  const [note, setNote] = useState('');
  const { toast } = useToast();
  const { language, t } = useLanguage();
  
  const handleMoodChange = (value: number[]) => {
    setMoodValue(value[0]);
  };
  
  const handleSubmit = async () => {
    const moodMap: Record<number, Mood> = {
      0: 'angry',
      1: 'anxious',
      2: 'sad',
      2.5: 'neutral',
      3: 'content',
      4: 'happy',
      5: 'joyful',
    };
    
    // Find the closest mood key
    const moodKeys = Object.keys(moodMap).map(Number);
    const closestMoodValue = moodKeys.reduce((prev, curr) => 
      Math.abs(curr - moodValue) < Math.abs(prev - moodValue) ? curr : prev
    );
    
    const mood = moodMap[closestMoodValue as keyof typeof moodMap];
    
    try {
      await moodAPI.addMoodEntry(mood, note);
      toast({
        title: t('mood.success'),
      });
      onMoodLogged();
    } catch (error) {
      console.error('Error logging mood:', error);
      toast({
        title: 'Error',
        description: 'Failed to log mood. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <div className="bg-card/60 backdrop-blur-md rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{t('mood.title')}</h2>
      <p className="text-muted-foreground mb-4">{t('mood.subtitle')}</p>
      
      <div className="mb-4">
        <Slider
          defaultValue={[moodValue]}
          max={5}
          step={0.1}
          aria-label="mood-slider"
          onValueChange={handleMoodChange}
        />
        <div className="flex justify-between text-sm text-muted-foreground mt-1">
          <span>{language === 'en' ? 'Angry' : 'गुस्सा'}</span>
          <span>{language === 'en' ? 'Sad' : 'उदास'}</span>
          <span>{language === 'en' ? 'Neutral' : 'तटस्थ'}</span>
          <span>{language === 'en' ? 'Happy' : 'खुश'}</span>
          <span>{language === 'en' ? 'Joyful' : 'आनंदित'}</span>
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="mood-note" className="block text-sm font-medium text-gray-700">{t('mood.note.label')}</label>
        <Textarea
          id="mood-note"
          placeholder={t('mood.note.placeholder')}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="mt-1 shadow-sm focus:ring-vyanamana-500 focus:border-vyanamana-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      
      <Button onClick={handleSubmit}>{t('mood.submit')}</Button>
    </div>
  );
};

export default MoodTracker;
