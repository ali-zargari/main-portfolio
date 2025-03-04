'use client';

import { useState, useEffect } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchIntensity?: number; // 0-1 scale
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

export default function GlitchText({ 
  text, 
  className = '', 
  glitchIntensity = 0.3,
  tag: Tag = 'div'
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  
  useEffect(() => {
    // Random glitch effect
    const triggerRandomGlitch = () => {
      if (Math.random() < glitchIntensity) {
        setIsGlitching(true);
        
        // Reset after a short duration
        setTimeout(() => {
          setIsGlitching(false);
        }, Math.random() * 200 + 50);
      }
    };
    
    // Set up interval for random glitches
    const intervalId = setInterval(triggerRandomGlitch, Math.random() * 5000 + 2000);
    
    return () => clearInterval(intervalId);
  }, [glitchIntensity]);
  
  return (
    <Tag 
      className={`relative ${isGlitching ? 'glitch' : ''} ${className}`}
      data-text={text}
    >
      {text}
      {isGlitching && (
        <>
          <span 
            className="absolute top-0 left-0 w-full h-full" 
            style={{ 
              clipPath: 'polygon(0 30%, 100% 30%, 100% 50%, 0 50%)',
              transform: 'translateX(-2px)',
              opacity: 0.8,
              color: 'var(--accent)'
            }}
          >
            {text}
          </span>
          <span 
            className="absolute top-0 left-0 w-full h-full" 
            style={{ 
              clipPath: 'polygon(0 60%, 100% 60%, 100% 75%, 0 75%)',
              transform: 'translateX(2px)',
              opacity: 0.8,
              color: 'var(--system-blue)'
            }}
          >
            {text}
          </span>
        </>
      )}
    </Tag>
  );
} 