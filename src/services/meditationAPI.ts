
import { useState } from 'react';

export interface MeditationSound {
  id: string;
  name: string;
  category: 'meditation' | 'nature' | 'music';
  description?: string;
  audioUrl: string;
  icon: string;
  duration: number; // in seconds
}

const MEDITATION_SOUNDS: MeditationSound[] = [
  {
    id: 'rain',
    name: 'Rain Sounds',
    category: 'nature',
    description: 'Calming rain sounds for relaxation and sleep',
    audioUrl: 'https://www.soundjay.com/misc/sounds/rain-01.mp3',
    icon: '🌧️',
    duration: 600
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    category: 'nature',
    description: 'Soothing ocean waves for meditation',
    audioUrl: 'https://www.soundjay.com/misc/sounds/waves-crashing.mp3',
    icon: '🌊',
    duration: 600
  },
  {
    id: 'birds',
    name: 'Forest Birds',
    category: 'nature',
    description: 'Peaceful forest birds chirping',
    audioUrl: 'https://www.soundjay.com/misc/sounds/forest-birds.mp3',
    icon: '🐦',
    duration: 600
  },
  {
    id: 'meditation-bells',
    name: 'Meditation Bells',
    category: 'meditation',
    description: 'Traditional meditation bells to mark intervals',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
    icon: '🔔',
    duration: 300
  },
  {
    id: 'white-noise',
    name: 'White Noise',
    category: 'nature',
    description: 'White noise for focus and concentration',
    audioUrl: 'https://www.soundjay.com/misc/sounds/white-noise.mp3',
    icon: '📻',
    duration: 1800
  },
  {
    id: 'piano',
    name: 'Calm Piano',
    category: 'music',
    description: 'Gentle piano melody for relaxation',
    audioUrl: 'https://www.bensound.com/bensound-music/bensound-relaxing.mp3',
    icon: '🎹',
    duration: 900
  },
  {
    id: 'nature-ambient',
    name: 'Nature Ambient',
    category: 'nature', 
    description: 'Peaceful nature sounds mix',
    audioUrl: 'https://www.bensound.com/bensound-music/bensound-zen.mp3',
    icon: '🌿',
    duration: 600
  },
  {
    id: 'om-chant',
    name: 'Om Chanting',
    category: 'meditation',
    description: 'Traditional om chanting for deep meditation',
    audioUrl: 'https://www.soundjay.com/misc/sounds/om-chanting.mp3',
    icon: '🕉️',
    duration: 600
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
      // Simulate API fetch delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsLoading(false);
      return MEDITATION_SOUNDS;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch meditation sounds');
      setError(error);
      setIsLoading(false);
      return [];
    }
  };

  const playSound = async (soundId: string) => {
    const sound = MEDITATION_SOUNDS.find(s => s.id === soundId);
    
    // Stop any currently playing sound
    if (audioInstance) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
    }
    
    if (sound) {
      try {
        const audio = new Audio();
        
        // Add error handling for audio loading
        audio.addEventListener('error', (e) => {
          console.error('Audio loading error:', e);
          setError(new Error('Failed to load audio. Trying alternative source...'));
          
          // Fallback to a working audio source
          const fallbackAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dyu2ciBHWP1/LNeSsFJnXF8N+QQgocVrHx6K1aEgg2h9dqeigCAHCd8VUGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dyu2ciBHWP1/LNeSsFJnXF8N+QQgocVrHx6K1aEgg2h9dqeigCAHCd8VUGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dyu2ciBHWP1/LNeSsFJnXF8N+QQgocVrHx6K1aEgg2h9dqeigCAHCd8VUGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dyu2ciBHWP1/LNeSsFJnXF8N+QQgocVrHx6K1aEgg2h9dqeigCAHCd8VU=');
          fallbackAudio.loop = true;
          fallbackAudio.volume = 0.3;
          fallbackAudio.play().catch(err => console.error('Fallback audio error:', err));
          setAudioInstance(fallbackAudio);
        });
        
        // Set the audio source
        audio.src = sound.audioUrl;
        audio.loop = true;
        audio.volume = 0.5;
        audio.preload = 'auto';
        
        // Try to play
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          setAudioInstance(audio);
          setCurrentlyPlaying(soundId);
          setError(null);
        }
        
      } catch (err) {
        console.error('Error playing audio:', err);
        setError(new Error('Audio playback failed. Please check your browser settings.'));
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
