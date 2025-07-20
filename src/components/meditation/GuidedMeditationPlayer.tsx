import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';

interface GuidedMeditationPlayerProps {
  meditation: {
    id: string;
    title: string;
    description: string;
    duration: string;
    category: string;
    imageUrl: string;
    mood: string;
    transcript: string;
  } | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onClose: () => void;
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number[]) => void;
  onMute: () => void;
}

const GuidedMeditationPlayer: React.FC<GuidedMeditationPlayerProps> = ({
  meditation,
  isPlaying,
  onPlayPause,
  onClose,
  volume,
  isMuted,
  onVolumeChange,
  onMute
}) => {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Simulate meditation progress
  useEffect(() => {
    if (!isPlaying || !meditation) return;

    const durationInSeconds = parseInt(meditation.duration) * 60; // Convert minutes to seconds
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 1;
        setProgress((newTime / durationInSeconds) * 100);
        
        if (newTime >= durationInSeconds) {
          onPlayPause(); // Stop when complete
          setCurrentTime(0);
          setProgress(0);
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, meditation, onPlayPause]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getTotalDuration = () => {
    if (!meditation) return "0:00";
    return meditation.duration.includes('min') 
      ? meditation.duration 
      : `${meditation.duration}:00`;
  };

  if (!meditation) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-amber-800/95 to-orange-700/95 backdrop-blur-md shadow-lg border-t border-amber-500/20 p-4 z-50"
    >
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              className="h-12 w-12 rounded-full bg-amber-500 text-white hover:bg-amber-600 shadow-lg"
              onClick={onPlayPause}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <div>
              <h3 className="font-semibold text-white text-lg">{meditation.title}</h3>
              <p className="text-sm text-amber-200">
                {formatTime(currentTime)} / {getTotalDuration()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={onMute}
              className="text-amber-100 hover:text-white"
            >
              {isMuted ? <VolumeX /> : <Volume2 />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={onVolumeChange}
              disabled={isMuted}
              className="w-24 md:w-32 [&>span]:bg-amber-500"
            />
            <Button
              size="sm"
              variant="ghost"
              className="text-amber-100 hover:text-white"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-amber-900/30 rounded-full h-2 mb-3">
          <div 
            className="bg-gradient-to-r from-amber-400 to-orange-400 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Meditation Transcript */}
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-amber-100 text-sm italic max-w-2xl mx-auto">
              "{meditation.transcript}"
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default GuidedMeditationPlayer;