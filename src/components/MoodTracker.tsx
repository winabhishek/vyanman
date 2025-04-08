
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mood } from '@/types';
import { moodAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const moodEmojis: Record<Mood, { emoji: string; label: string }> = {
  joyful: { emoji: '😄', label: 'Joyful' },
  happy: { emoji: '😊', label: 'Happy' },
  content: { emoji: '🙂', label: 'Content' },
  neutral: { emoji: '😐', label: 'Neutral' },
  sad: { emoji: '😔', label: 'Sad' },
  anxious: { emoji: '😰', label: 'Anxious' },
  stressed: { emoji: '😫', label: 'Stressed' },
  angry: { emoji: '😠', label: 'Angry' },
  exhausted: { emoji: '😴', label: 'Exhausted' }
};

interface MoodTrackerProps {
  onMoodLogged?: () => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ onMoodLogged }) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [note, setNote] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const { toast } = useToast();
  
  const handleSelectMood = (mood: Mood) => {
    setSelectedMood(mood);
  };
  
  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    setIsLogging(true);
    
    try {
      await moodAPI.addMoodEntry(selectedMood, note);
      
      toast({
        title: "Mood logged successfully",
        description: `You're feeling ${moodEmojis[selectedMood].label.toLowerCase()}.`,
      });
      
      // Reset the form
      setSelectedMood(null);
      setNote('');
      
      // Notify parent component if needed
      if (onMoodLogged) {
        onMoodLogged();
      }
    } catch (error) {
      toast({
        title: "Failed to log mood",
        description: "There was an error logging your mood. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLogging(false);
    }
  };
  
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">How are you feeling?</h3>
          <p className="text-muted-foreground">
            Select the emoji that best represents your current mood.
          </p>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
          {Object.entries(moodEmojis).map(([mood, { emoji, label }]) => (
            <Button
              key={mood}
              variant={selectedMood === mood ? "default" : "outline"}
              className={`h-16 text-2xl flex flex-col justify-center items-center p-1 ${selectedMood === mood ? 'border-2 border-vyanamana-500' : ''}`}
              onClick={() => handleSelectMood(mood as Mood)}
            >
              <span>{emoji}</span>
              <span className="text-xs mt-1">{label}</span>
            </Button>
          ))}
        </div>
        
        {selectedMood && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Add a note (optional)</h4>
              <Textarea
                placeholder="What's contributing to your mood today?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
            
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={isLogging}
            >
              {isLogging ? 'Logging...' : 'Log Your Mood'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;
