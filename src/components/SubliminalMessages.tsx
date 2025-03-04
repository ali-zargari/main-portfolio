'use client';

import { useState, useEffect } from 'react';

const messages = [
  "Innovation.",
  "Engineering.",
  "AI.",
  "IoT.",
  "Vision.",
  "Systems.",
  "Development.",
  "Automation.",
  "Intelligence.",
  "Solutions."
];

export default function SubliminalMessages() {
  const [currentMessage, setCurrentMessage] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    // Change message and position randomly
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setCurrentMessage(messages[randomIndex]);
      
      // Random position within viewport
      const x = Math.floor(Math.random() * (window.innerWidth - 200));
      const y = Math.floor(Math.random() * (window.innerHeight - 100));
      setPosition({ x, y });
      
      // Show message
      setVisible(true);
      
      // Hide after a short time
      setTimeout(() => {
        setVisible(false);
      }, 1500);
    }, 5000); // Less frequent appearances

    // Trigger on scroll for more randomness
    const handleScroll = () => {
      if (Math.random() > 0.8) { // Only trigger sometimes (less frequently)
        const randomIndex = Math.floor(Math.random() * messages.length);
        setCurrentMessage(messages[randomIndex]);
        
        const x = Math.floor(Math.random() * (window.innerWidth - 200));
        const y = Math.floor(Math.random() * (window.innerHeight - 100));
        setPosition({ x, y });
        
        // Show message
        setVisible(true);
        
        // Hide after a short time
        setTimeout(() => {
          setVisible(false);
        }, 1500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isClient]);

  // Don't render anything during SSR
  if (!isClient) return null;

  return (
    <div 
      style={{ 
        opacity: visible ? 0.15 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.9)',
        left: position.x, 
        top: position.y,
        position: 'fixed',
        zIndex: 5,
        pointerEvents: 'none',
        fontSize: '1.5rem',
        fontWeight: 200,
        color: 'rgba(255, 255, 255, 0.8)',
        textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
        fontFamily: 'monospace',
        transition: 'opacity 0.3s ease, transform 0.3s ease'
      }}
      aria-hidden="true"
    >
      {currentMessage}
    </div>
  );
} 