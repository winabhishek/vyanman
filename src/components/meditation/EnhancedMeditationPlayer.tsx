import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, X, RotateCcw, Music } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MeditationSound } from '@/services/meditationAPI';
import { useToast } from '@/hooks/use-toast';

interface EnhancedMeditationPlayerProps {
  sound: MeditationSound | null;
  onClose: () => void;
}

const EnhancedMeditationPlayer: React.FC<EnhancedMeditationPlayerProps> = ({ sound, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [audioError, setAudioError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [oscillator, setOscillator] = useState<{
    osc: OscillatorNode;
    ctx: AudioContext;
  } | null>(null);

  const { toast } = useToast();

  // Load and setup audio
  useEffect(() => {
    if (sound && !fallbackMode) {
      setIsLoading(true);
      setAudioError(false);
      
      const audio = new Audio();
      
      const handleCanPlay = () => {
        setIsLoading(false);
        setAudioError(false);
        console.log(`✅ Audio loaded: ${sound.name}`);
        toast({
          title: "Audio Ready",
          description: `${sound.name} is ready to play`,
        });
      };

      const handleError = () => {
        console.warn(`❌ Audio failed for ${sound.name}, switching to fallback tone`);
        setIsLoading(false);
        setAudioError(true);
        setFallbackMode(true);
        
        toast({
          title: "Using Fallback Audio",
          description: `Playing relaxation tone instead of ${sound.name}`,
          variant: "destructive"
        });
      };

      const handleTimeUpdate = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
      };

      // Add timeout for loading
      const loadTimeout = setTimeout(() => {
        if (audio.networkState === HTMLMediaElement.NETWORK_LOADING) {
          handleError();
        }
      }, 5000);

      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      
      audio.crossOrigin = 'anonymous';
      audio.preload = 'auto';
      audio.volume = (isMuted ? 0 : volume) / 100;
      audio.src = sound.audioUrl;

      setAudioElement(audio);

      return () => {
        clearTimeout(loadTimeout);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
      };
    }
  }, [sound, fallbackMode, volume, isMuted]);

  // Create relaxation tone as fallback
  const createRelaxationTone = (): { osc: OscillatorNode, ctx: AudioContext } | null => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      
      const oscillatorNode = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      oscillatorNode.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Set meditation frequency based on mood
      const moodFrequencies: { [key: string]: number } = {
        'calm': 174,
        'peaceful': 285,
        'refreshed': 396,
        'energetic': 417,
        'focused': 528,
        'mindful': 639,
        'spiritual': 741,
        'transcendent': 852,
        'serene': 963,
        'concentrated': 40,
        'alert': 10,
        'deep': 6
      };

      const frequency = moodFrequencies[sound?.mood || 'calm'] || 440;
      oscillatorNode.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillatorNode.type = 'sine';

      // Add low-pass filter for warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, audioContext.currentTime);

      // Set volume
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime((isMuted ? 0 : volume) / 300, audioContext.currentTime + 0.5);

      return { osc: oscillatorNode, ctx: audioContext };
    } catch (err) {
      console.error('Failed to create audio context:', err);
      return null;
    }
  };

  // Handle fallback tone playback
  useEffect(() => {
    if (fallbackMode && isPlaying) {
      const tone = createRelaxationTone();
      if (tone) {
        tone.osc.start();
        setOscillator(tone);
      }
    } else if (oscillator && !isPlaying) {
      try {
        oscillator.osc.stop();
        oscillator.ctx.close();
      } catch (err) {
        console.log('Oscillator already stopped');
      }
      setOscillator(null);
    }

    return () => {
      if (oscillator) {
        try {
          oscillator.osc.stop();
          oscillator.ctx.close();
        } catch (err) {
          console.log('Cleanup: Oscillator already stopped');
        }
      }
    };
  }, [fallbackMode, isPlaying]);

  // Handle regular audio playback
  useEffect(() => {
    if (audioElement && !fallbackMode) {
      if (isPlaying) {
        audioElement.play().catch(err => {
          console.error('Play failed:', err);
          setAudioError(true);
        });
      } else {
        audioElement.pause();
      }
    }
  }, [isPlaying, audioElement, fallbackMode]);

  // Update volume
  useEffect(() => {
    if (audioElement && !fallbackMode) {
      audioElement.volume = (isMuted ? 0 : volume) / 100;
    }
  }, [volume, isMuted, audioElement, fallbackMode]);

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

  const handleRetry = () => {
    setFallbackMode(false);
    setAudioError(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateCurrentTime = (): string => {
    if (fallbackMode) return '0:00';
    return audioElement ? formatTime(audioElement.currentTime) : '0:00';
  };

  const calculateTotalTime = (): string => {
    if (fallbackMode) return '∞';
    return audioElement && audioElement.duration ? formatTime(audioElement.duration) : '0:00';
  };

  if (!sound) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-md glass-card-premium border-amber-500/30">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-0 right-0 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="text-4xl mb-2">{sound.icon}</div>
          <CardTitle className="text-xl">{sound.name}</CardTitle>
          <CardDescription>{sound.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {audioError && (
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertDescription className="flex items-center justify-between">
                <span>Using relaxation tone instead</span>
                <Button variant="outline" size="sm" onClick={handleRetry}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Play/Pause Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              className="h-16 w-16 rounded-full premium-button"
              onClick={togglePlayPause}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              className="w-full [&>span]:bg-amber-500"
              disabled={fallbackMode}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{calculateCurrentTime()}</span>
              <span>{calculateTotalTime()}</span>
            </div>
          </div>

          {/* Volume Controls */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="flex-1 [&>span]:bg-amber-500"
              />
              <span className="text-sm text-muted-foreground w-8">{volume}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <div className="w-full text-center text-xs text-muted-foreground">
            {fallbackMode ? (
              <div className="flex items-center justify-center gap-1">
                <Music className="h-3 w-3" />
                <span>Playing {sound.mood} relaxation tone</span>
              </div>
            ) : (
              <span>Category: {sound.category}</span>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default EnhancedMeditationPlayer;