
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const ThreeBreathingAnimation: React.FC<{ isPlaying?: boolean }> = ({ isPlaying = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const frameId = useRef<number | null>(null);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [counter, setCounter] = useState(4);

  useEffect(() => {
    if (!isPlaying) return;
    
    // Setup breathing animation cycle
    const interval = setInterval(() => {
      setPhase(current => {
        if (current === 'inhale') return 'hold';
        if (current === 'hold') return 'exhale';
        return 'inhale';
      });
      setCounter(4); // Reset counter for each phase
    }, 4000); // 4 seconds per phase

    // Counter decrement
    const counterInterval = setInterval(() => {
      setCounter(current => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(counterInterval);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup scene with a subtle ambient color
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfafafa);
    scene.fog = new THREE.FogExp2(0xfafafa, 0.05);
    sceneRef.current = scene;
    
    // Setup camera with a better field of view
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Setup renderer with better quality
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Enhanced lighting for better 3D effect
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x9b87f5, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0x33C3F0, 80);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);
    
    // Create breathing sphere with improved material
    const geometry = new THREE.SphereGeometry(1.5, 64, 64); // Higher polygon count for smoother appearance
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x9b87f5,
      transparent: true,
      opacity: 0.8,
      metalness: 0.2,
      roughness: 0.5,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
      emissive: 0x9b87f5,
      emissiveIntensity: 0.2,
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphereRef.current = sphere;
    
    // Animation loop
    let scale = 1;
    let targetScale = 1.2; // Initial target is to grow (inhale)
    let scaleSpeed = 0.003;
    
    const animate = () => {
      if (!sphereRef.current) return;
      
      // Adjust target scale based on breathing phase
      if (phase === 'inhale') {
        targetScale = 1.3;
        scaleSpeed = 0.005;
      } else if (phase === 'hold') {
        targetScale = sphereRef.current.scale.x; // Hold current size
        scaleSpeed = 0;
      } else if (phase === 'exhale') {
        targetScale = 0.8;
        scaleSpeed = 0.004;
      }
      
      // Smooth transition toward target scale
      if (Math.abs(scale - targetScale) > 0.01) {
        if (scale < targetScale) {
          scale += scaleSpeed;
        } else {
          scale -= scaleSpeed;
        }
      }
      
      sphereRef.current.scale.set(scale, scale, scale);
      
      // Subtle continuous rotation for more visual interest
      sphereRef.current.rotation.x += 0.002;
      sphereRef.current.rotation.y += 0.003;
      
      // Render scene
      if (sceneRef.current && cameraRef.current && rendererRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      
      frameId.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (frameId.current !== null) {
        cancelAnimationFrame(frameId.current);
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [phase]);

  // Get instruction text based on current phase
  const getInstructionText = () => {
    switch(phase) {
      case 'inhale': return 'Inhale slowly';
      case 'hold': return 'Hold your breath';
      case 'exhale': return 'Exhale completely';
      default: return '';
    }
  };

  return (
    <motion.div 
      ref={containerRef} 
      className="w-full h-64 md:h-96 relative rounded-xl overflow-hidden glass-card-premium shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-vyanamana-50/30 dark:to-vyanamana-900/30 pointer-events-none" />

      <motion.div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-center bg-black/20 backdrop-blur-sm p-4 rounded-lg">
          <motion.p 
            className="text-xl font-medium text-white"
            key={phase} // Force animation restart on phase change
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {getInstructionText()}
          </motion.p>
          <p className="text-4xl font-bold text-white mt-2">{counter}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ThreeBreathingAnimation;
