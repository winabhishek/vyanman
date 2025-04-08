
import React from 'react';
import MoodTracker from '@/components/MoodTracker';
import MoodHistory from '@/components/MoodHistory';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const MoodTrackerPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold font-heading">Mood Tracker</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/chat')}
          className="flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          Back to Chat
        </Button>
      </div>
      
      <div className="space-y-10">
        <section>
          <MoodTracker />
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Your Mood History</h2>
          <MoodHistory />
        </section>
      </div>
    </div>
  );
};

export default MoodTrackerPage;
