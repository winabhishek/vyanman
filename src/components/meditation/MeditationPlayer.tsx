
import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, X, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MeditationSound } from '@/services/meditationAPI';
import { useToast } from '@/hooks/use-toast';

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
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (sound && !fallbackMode) {
      setIsLoading(true);
      setAudioError(null);
      
      const audioElement = new Audio();
      
      const handleCanPlay = () => {
        console.log('Audio ready to play');
        setIsLoading(false);
        setAudioError(null);
      };
      
      const handleError = (e: any) => {
        console.error('Audio loading error:', e);
        setIsLoading(false);
        setAudioError('Unable to load audio. Switching to relaxation tone.');
        setFallbackMode(true);
        
        toast({
          title: "Audio Mode",
          description: "Using relaxation tone instead of external audio.",
          variant: "default",
        });
      };
      
      const handleTimeUpdate = () => {
        if (sound.duration > 0) {
          const percentage = (audioElement.currentTime / sound.duration) * 100;
          setProgress(percentage);
        }
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
      };
      
      audioElement.addEventListener('canplay', handleCanPlay);
      audioElement.addEventListener('canplaythrough', handleCanPlay);
      audioElement.addEventListener('error', handleError);
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
      audioElement.addEventListener('ended', handleEnded);
      
      audioElement.crossOrigin = 'anonymous';
      audioElement.src = sound.audioUrl;
      audioElement.loop = true;
      audioElement.preload = 'auto';
      audioElement.volume = volume / 100;
      
      // Set timeout for loading
      const loadTimeout = setTimeout(() => {
        if (audioElement.readyState < 2) {
          handleError('Loading timeout');
        }
      }, 5000);
      
      setAudio(audioElement);
      
      return () => {
        clearTimeout(loadTimeout);
        audioElement.pause();
        audioElement.currentTime = 0;
        audioElement.removeEventListener('canplay', handleCanPlay);
        audioElement.removeEventListener('canplaythrough', handleCanPlay);
        audioElement.removeEventListener('error', handleError);
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        audioElement.removeEventListener('ended', handleEnded);
      };
    }
  }, [sound, volume, fallbackMode]);

  const createRelaxationTone = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Create a soothing 220Hz tone (A3 note)
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.type = 'sine';
      
      // Set volume
      gainNode.gain.setValueAtTime(isMuted ? 0 : (volume / 100) * 0.1, ctx.currentTime);
      
      osc.start();
      
      setOscillator(osc);
      setAudioContext(ctx);
      
      return { osc, ctx };
    } catch (err) {
      console.error('Error creating audio context:', err);
      setAudioError('Audio not supported in this browser');
      return null;
    }
  };

  useEffect(() => {
    if (fallbackMode) {
      if (isPlaying && !oscillator) {
        createRelaxationTone();
      } else if (!isPlaying && oscillator) {
        oscillator.stop();
        audioContext?.close();
        setOscillator(null);
        setAudioContext(null);
      }
    } else if (audio) {
      if (isPlaying) {
        audio.play().catch(err => {
          console.error("Error playing audio:", err);
          setAudioError('Playback failed. Switching to relaxation tone.');
          setFallbackMode(true);
          setIsPlaying(false);
        });
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, audio, fallbackMode]);
  
  useEffect(() => {
    if (fallbackMode && oscillator && audioContext) {
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      gainNode.gain.setValueAtTime(isMuted ? 0 : (volume / 100) * 0.1, audioContext.currentTime);
    } else if (audio) {
      audio.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted, audio, fallbackMode, oscillator, audioContext]);
  
  const togglePlayPause = () => {
    if (audioError && !fallbackMode) {
      setAudioError(null);
      setFallbackMode(true);
    }
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
    setAudioError(null);
    setIsPlaying(false);
    if (oscillator) {
      oscillator.stop();
      audioContext?.close();
      setOscillator(null);
      setAudioContext(null);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const calculateCurrentTime = () => {
    if (audio && sound && !isNaN(audio.currentTime)) {
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
        {audioError && (
          <Alert className="mb-4 bg-orange-100/90 border-orange-300">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-orange-800 flex items-center justify-between">
              <span>{audioError}</span>
              {!fallbackMode && (
                <Button size="sm" variant="outline" onClick={handleRetry} className="ml-2">
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              className={`h-10 w-10 rounded-full text-white hover:bg-amber-600 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              } ${fallbackMode ? 'bg-orange-500 hover:bg-orange-600' : 'bg-amber-500'}`}
              onClick={togglePlayPause}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause />
              ) : (
                <Play />
              )}
            </Button>
            <div>
              <h3 className="font-semibold text-white flex items-center gap-2">
                {sound.name}
                {fallbackMode && <span className="text-xs bg-orange-500 px-2 py-1 rounded">Tone Mode</span>}
              </h3>
              <p className="text-sm text-amber-200">
                {fallbackMode ? 'Relaxation Tone' : `${calculateCurrentTime()} / ${calculateTotalTime()}`}
                {isLoading && <span className="ml-2">Loading...</span>}
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
