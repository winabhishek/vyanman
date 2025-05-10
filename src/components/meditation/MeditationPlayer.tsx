
import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { MeditationSound } from '@/services/meditationAPI';

interface MeditationPlayerProps {
  sound: MeditationSound | null;
  onClose: () => void;
}

const MeditationPlayer: React.FC<MeditationPlayerProps> = ({ sound, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (sound) {
      const audioElement = new Audio(sound.audioUrl);
      setAudio(audioElement);
      
      audioElement.addEventListener('timeupdate', () => {
        const percentage = (audioElement.currentTime / sound.duration) * 100;
        setProgress(percentage);
      });
      
      audioElement.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      
      return () => {
        audioElement.pause();
        audioElement.currentTime = 0;
      };
    }
  }, [sound]);

  useEffect(() => {
    if (audio) {
      if (isPlaying) {
        audio.play().catch(err => console.error("Error playing audio:", err));
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, audio]);
  
  useEffect(() => {
    if (audio) {
      audio.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted, audio]);
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
    if (isMuted && newVolume[0] > 0) {
      setIsMuted(false);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const calculateCurrentTime = () => {
    if (audio && sound) {
      return formatTime(audio.currentTime);
    }
    return "0:00";
  };
  
  const calculateTotalTime = () => {
    if (sound) {
      return formatTime(sound.duration);
    }
    return "0:00";
  };
  
  if (!sound) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-amber-800/90 to-orange-700/90 backdrop-blur-md shadow-lg border-t border-amber-500/20 p-4 z-50">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-full bg-amber-500 text-white hover:bg-amber-600"
              onClick={togglePlayPause}
            >
              {isPlaying ? <Pause /> : <Play />}
            </Button>
            <div>
              <h3 className="font-semibold text-white">{sound.name}</h3>
              <p className="text-sm text-amber-200">
                {calculateCurrentTime()} / {calculateTotalTime()}
              </p>
            </div>
          </div>
          
          <div className="flex-1 mx-8 hidden md:block">
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              disabled
              className="cursor-default"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={toggleMute}
              className="text-amber-100 hover:text-white"
            >
              {isMuted ? <VolumeX /> : <Volume2 />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              disabled={isMuted}
              className="w-24 md:w-32"
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
      </div>
    </div>
  );
};

export default MeditationPlayer;
