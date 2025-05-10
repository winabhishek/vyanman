
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
    audioUrl: 'https://assets.mixkit.co/sfx/download/mixkit-gentle-rain-loop-1248.wav',
    icon: '🌧️',
    duration: 600
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    category: 'nature',
    description: 'Soothing ocean waves for meditation',
    audioUrl: 'https://assets.mixkit.co/sfx/download/mixkit-sea-waves-loop-1196.wav',
    icon: '🌊',
    duration: 600
  },
  {
    id: 'birds',
    name: 'Forest Birds',
    category: 'nature',
    description: 'Peaceful forest birds chirping',
    audioUrl: 'https://assets.mixkit.co/sfx/download/mixkit-forest-birds-ambience-1210.wav',
    icon: '🐦',
    duration: 600
  },
  {
    id: 'meditation-bells',
    name: 'Meditation Bells',
    category: 'meditation',
    description: 'Traditional meditation bells to mark intervals',
    audioUrl: 'https://assets.mixkit.co/sfx/download/mixkit-tibetan-bell-singing-bowl-691.wav',
    icon: '🔔',
    duration: 300
  },
  {
    id: 'flute',
    name: 'Bamboo Flute',
    category: 'music',
    description: 'Relaxing bamboo flute music',
    audioUrl: 'https://assets.mixkit.co/sfx/download/mixkit-relaxing-garden-ambience-1455.wav',
    icon: '🎵',
    duration: 900
  },
  {
    id: 'piano',
    name: 'Calm Piano',
    category: 'music',
    description: 'Gentle piano melody for relaxation',
    audioUrl: 'https://assets.mixkit.co/sfx/download/mixkit-sad-piano-tune-2839.wav',
    icon: '🎹',
    duration: 900
  },
  {
    id: 'om-chant',
    name: 'Om Chanting',
    category: 'meditation',
    description: 'Traditional om chanting for deep meditation',
    audioUrl: 'https://assets.mixkit.co/sfx/download/mixkit-tibetan-bell-wavy-1220.wav',
    icon: '🕉️',
    duration: 600
  },
  {
    id: 'white-noise',
    name: 'White Noise',
    category: 'nature',
    description: 'White noise for focus and concentration',
    audioUrl: 'https://assets.mixkit.co/sfx/download/mixkit-empty-radio-interference-noise-630.wav',
    icon: '📻',
    duration: 1800
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

  const playSound = (soundId: string) => {
    const sound = MEDITATION_SOUNDS.find(s => s.id === soundId);
    
    // Stop any currently playing sound
    if (audioInstance) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
    }
    
    if (sound) {
      const audio = new Audio(sound.audioUrl);
      audio.loop = true;
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        setError(new Error('Failed to play audio'));
      });
      
      setAudioInstance(audio);
      setCurrentlyPlaying(soundId);
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
      audioInstance.volume = volume / 100;
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
