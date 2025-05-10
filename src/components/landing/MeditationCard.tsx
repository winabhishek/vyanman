
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Activity, Music, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import BreathingCircle from '@/components/BreathingCircle';
import { useMeditationAudioAPI } from '@/services/meditationAPI';

interface MeditationCardProps {
  isMusicPlaying: boolean;
  toggleMusic: (e: React.MouseEvent) => void;
}

const MeditationCard: React.FC<MeditationCardProps> = ({ isMusicPlaying, toggleMusic }) => {
  const { playSound, stopSound } = useMeditationAudioAPI();
  
  useEffect(() => {
    // Play or stop the meditation music based on the isMusicPlaying state
    if (isMusicPlaying) {
      playSound('piano'); // Default to calm piano
    } else {
      stopSound();
    }
    
    // Clean up on unmount
    return () => {
      stopSound();
    };
  }, [isMusicPlaying]);

  return (
    <Link to="/meditation">
      <Card className="h-full backdrop-blur-lg bg-white/70 dark:bg-gray-800/50 border border-amber-100 dark:border-amber-900/50 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-amber-700 dark:text-amber-300">
            <Activity className="mr-2 h-5 w-5" />
            Meditation & Breathing
          </CardTitle>
          <CardDescription>Relax with guided breathing exercises</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center my-4">
            <BreathingCircle />
          </div>
          <div className="flex justify-center my-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800"
              onClick={(e) => {
                e.preventDefault();
                toggleMusic(e);
              }}
            >
              {isMusicPlaying ? (
                <>
                  <VolumeX className="h-4 w-4" />
                  Pause Music
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4" />
                  Play Calm Music
                </>
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="ghost" className="w-full justify-center group-hover:text-amber-600 dark:group-hover:text-amber-300">
            Begin Meditation
            <Music className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default MeditationCard;
