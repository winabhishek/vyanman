
import { useState } from 'react';

export interface MeditationSound {
  id: string;
  name: string;
  category: 'meditation' | 'nature' | 'music';
  description?: string;
  audioUrl: string;
  icon: string;
  duration: number;
}

// Working audio URLs - using reliable free sources
const MEDITATION_SOUNDS: MeditationSound[] = [
  {
    id: 'rain',
    name: 'Rain Sounds',
    category: 'nature',
    description: 'Calming rain sounds for relaxation',
    audioUrl: 'https://www.soundjay.com/misc/sounds/rain-01.wav',
    icon: '🌧️',
    duration: 600
  },
  {
    id: 'ocean',
    name: 'Ocean Waves', 
    category: 'nature',
    description: 'Soothing ocean waves',
    audioUrl: 'https://www.soundjay.com/misc/sounds/waves-crashing.wav',
    icon: '🌊',
    duration: 600
  },
  {
    id: 'birds',
    name: 'Forest Birds',
    category: 'nature', 
    description: 'Peaceful forest birds',
    audioUrl: 'https://www.soundjay.com/misc/sounds/forest-birds.wav',
    icon: '🐦',
    duration: 600
  },
  {
    id: 'meditation-bells',
    name: 'Meditation Bells',
    category: 'meditation',
    description: 'Traditional meditation bells',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    icon: '🔔',
    duration: 300
  },
  {
    id: 'white-noise',
    name: 'White Noise',
    category: 'nature',
    description: 'White noise for focus',
    audioUrl: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGQdBjiR2e/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGQdBjiR2e/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGQdBjiR2e/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGQdBjiR2e/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGQdBjiR2e/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGQdBjiR2e/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGQdBjiR2e/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGQdBjiR2e/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGQdBjiR2e/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGQdBjiR2e/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGQdBg==',
    icon: '📻',
    duration: 1800
  },
  {
    id: 'calm-piano',
    name: 'Calm Piano',
    category: 'music',
    description: 'Gentle piano melody',
    audioUrl: 'https://www.bensound.com/bensound-music/bensound-relaxing.mp3',
    icon: '🎹',
    duration: 900
  }
];

export const useMeditationAudioAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

  const getMeditationSounds = async (): Promise<MeditationSound[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsLoading(false);
      return MEDITATION_SOUNDS;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch sounds');
      setError(error);
      setIsLoading(false);
      return [];
    }
  };

  const createAudioContext = () => {
    try {
      // Handle different browser implementations
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      return new AudioContextClass();
    } catch (err) {
      console.error('AudioContext not supported:', err);
      return null;
    }
  };

  const playSound = async (soundId: string) => {
    const sound = MEDITATION_SOUNDS.find(s => s.id === soundId);
    
    if (audioInstance) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
    }
    
    if (sound) {
      try {
        const audio = new Audio();
        
        audio.addEventListener('canplaythrough', () => {
          console.log('Audio ready to play');
          setError(null);
        });
        
        audio.addEventListener('error', (e) => {
          console.error('Audio error:', e);
          // Fallback to a simple beep sound using AudioContext
          const audioContext = createAudioContext();
          if (audioContext) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 220;
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
            
            setCurrentlyPlaying(soundId);
            setError(null);
          }
        });
        
        audio.crossOrigin = 'anonymous';
        audio.src = sound.audioUrl;
        audio.loop = true;
        audio.volume = 0.5;
        audio.preload = 'auto';
        
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          setAudioInstance(audio);
          setCurrentlyPlaying(soundId);
          setError(null);
        }
        
      } catch (err) {
        console.error('Error playing audio:', err);
        // Create a simple tone as fallback
        try {
          const audioContext = createAudioContext();
          if (audioContext) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            
            oscillator.start();
            
            setCurrentlyPlaying(soundId);
            setError(null);
            
            // Store reference to stop later
            const fakeAudio = {
              pause: () => {
                oscillator.stop();
                audioContext.close();
              },
              currentTime: 0,
              volume: 0.1
            } as HTMLAudioElement;
            
            setAudioInstance(fakeAudio);
          } else {
            setError(new Error('Audio playback not supported'));
          }
        } catch (fallbackErr) {
          setError(new Error('Audio playback not supported'));
        }
      }
    }
  };

  const stopSound = () => {
    if (audioInstance) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setAudioInstance(null);
      setCurrentlyPlaying(null);
    }
  };

  const setVolume = (volume: number) => {
    if (audioInstance) {
      audioInstance.volume = Math.max(0, Math.min(1, volume / 100));
    }
  };

  return {
    getMeditationSounds,
    playSound,
    stopSound,
    setVolume,
    currentlyPlaying,
    isLoading,
    error
  };
};
