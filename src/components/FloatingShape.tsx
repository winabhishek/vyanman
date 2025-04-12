
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FloatingShapeProps {
  size?: number;
  className?: string;
}

const FloatingShape: React.FC<FloatingShapeProps> = ({ size = 180, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Add mousemove effect when component mounts
    const container = containerRef.current;
    if (!container) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / 25;
      const y = (e.clientY - top - height / 2) / 25;
      
      container.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      initial={{ y: 0 }}
      animate={{ y: [-10, 10, -10] }}
      transition={{ 
        repeat: Infinity, 
        duration: 6,
        ease: "easeInOut"
      }}
      style={{ 
        width: size,
        height: size,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease'
      }}
    >
      {/* Cube */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-1/2 h-1/2 opacity-90 relative"
          style={{ 
            transform: 'rotateX(45deg) rotateZ(45deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Front face */}
          <div 
            className="absolute w-full h-full bg-gradient-to-tr from-vyanamana-400 to-vyanamana-600 rounded-lg shadow-lg"
            style={{ transform: 'translateZ(40px)' }}
          />
          
          {/* Back face */}
          <div 
            className="absolute w-full h-full bg-gradient-to-bl from-vyanamana-300 to-vyanamana-500 rounded-lg shadow-lg"
            style={{ transform: 'translateZ(-40px)' }}
          />
          
          {/* Right face */}
          <div 
            className="absolute w-full h-full bg-gradient-to-r from-vyanamana-500 to-vyanamana-700 rounded-lg shadow-lg origin-right"
            style={{ transform: 'rotateY(90deg) translateZ(40px)' }}
          />
          
          {/* Left face */}
          <div 
            className="absolute w-full h-full bg-gradient-to-l from-vyanamana-500 to-vyanamana-200 rounded-lg shadow-lg origin-left"
            style={{ transform: 'rotateY(-90deg) translateZ(40px)' }}
          />
          
          {/* Top face */}
          <div 
            className="absolute w-full h-full bg-gradient-to-t from-vyanamana-400 to-vyanamana-200 rounded-lg shadow-lg origin-top"
            style={{ transform: 'rotateX(90deg) translateZ(40px)' }}
          />
          
          {/* Bottom face */}
          <div 
            className="absolute w-full h-full bg-gradient-to-b from-vyanamana-600 to-vyanamana-800 rounded-lg shadow-lg origin-bottom"
            style={{ transform: 'rotateX(-90deg) translateZ(40px)' }}
          />
        </div>
      </div>
      
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-vyanamana-300 opacity-60"
          initial={{ 
            x: (Math.random() - 0.5) * size,
            y: (Math.random() - 0.5) * size,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{ 
            x: (Math.random() - 0.5) * size,
            y: (Math.random() - 0.5) * size,
          }}
          transition={{ 
            repeat: Infinity, 
            repeatType: "reverse",
            duration: 3 + Math.random() * 3,
            ease: "easeInOut"
          }}
          style={{ 
            width: 6 + Math.random() * 8, 
            height: 6 + Math.random() * 8 
          }}
        />
      ))}
    </motion.div>
  );
};

export default FloatingShape;
