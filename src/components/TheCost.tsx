'use client';

import { useState, useEffect } from 'react';

export default function TheCost() {
  const [visible, setVisible] = useState(false);
  const costs = ["Sleep", "Certainty", "Time", "Comfort"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typing, setTyping] = useState(true);
  const [text, setText] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 5000); // Show after 5 seconds on page

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;

    let timeout: NodeJS.Timeout;
    
    if (typing && currentIndex < costs.length) {
      if (text.length < costs[currentIndex].length) {
        timeout = setTimeout(() => {
          setText(costs[currentIndex].substring(0, text.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => {
          setTyping(false);
        }, 1000);
      }
    } else if (!typing && text.length > 0) {
      timeout = setTimeout(() => {
        setText(text.substring(0, text.length - 1));
      }, 50);
    } else if (!typing && text.length === 0) {
      timeout = setTimeout(() => {
        const nextIndex = (currentIndex + 1) % costs.length;
        setCurrentIndex(nextIndex);
        setTyping(true);
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [visible, typing, text, currentIndex, costs]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-10 right-10 z-30 opacity-30 hover:opacity-100 transition-opacity duration-500">
      <div className="bg-black bg-opacity-70 p-4 border-l border-accent">
        <div className="text-xs text-accent mb-2 font-mono">THE COST</div>
        <div className="font-mono text-sm text-foreground h-6">
          {text}
          <span className="animate-pulse">|</span>
        </div>
        <div className="text-xs text-foreground mt-2 font-mono opacity-50">
          But never purpose.
        </div>
      </div>
    </div>
  );
} 