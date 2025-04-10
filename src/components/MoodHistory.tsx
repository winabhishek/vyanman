import React from 'react';
import { MoodEntry } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { moodAPI } from '@/services'; // Updated import

interface MoodHistoryProps {
  moodEntries: MoodEntry[];
}

const MoodHistory: React.FC<MoodHistoryProps> = ({ moodEntries }) => {
  if (!moodEntries || moodEntries.length === 0) {
    return <p>No mood entries yet. Start logging your mood to see your history.</p>;
  }
  
  return (
    <div className="space-y-4">
      {moodEntries.map(entry => (
        <div key={entry.id} className="border rounded-md p-4">
          <p className="font-bold">{entry.mood}</p>
          {entry.note && <p className="text-sm italic">{entry.note}</p>}
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MoodHistory;
