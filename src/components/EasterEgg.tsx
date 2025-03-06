'use client';

import { useState, useEffect } from 'react';

const secretMessages = [
  {
    key: 'Escape',
    title: 'About Olympus',
    message: "Olympus is an advanced AI-powered smart home system integrating IoT, NLP, and computer vision for seamless, secure, and intelligent multi-room automation."
  },
  {
    key: 'KeyD',
    title: 'Technical Stack',
    message: "My projects leverage Python, TensorFlow, OpenCV, Flask, and various cloud technologies. I'm passionate about creating systems that solve real-world problems."
  },
  {
    key: 'KeyS',
    title: 'Skills Overview',
    message: "Programming: Python, Java, C++, JavaScript. AI & ML: TensorFlow, OpenCV, Deep Learning. Backend: FastAPI, Flask, PostgreSQL. IoT: ROS2, ESP32, NVIDIA Jetson."
  },
  {
    key: 'KeyO',
    title: 'Project Highlights',
    message: "SocialSync: AI-powered assistive tool for ASD therapy. Memento: IoT solution for memory impairment. Localization System: SLAM with Extended Kalman Filter."
  },
  {
    key: 'KeyC',
    title: 'Contact Information',
    message: "San Jose, CA • ali.zargari1@outlook.com • (510) 709-9478 • linkedin.com/in/zargari-ali"
  }
];

export default function EasterEgg() {
  const [activeSecret, setActiveSecret] = useState<typeof secretMessages[0] | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const secret = secretMessages.find(s => s.key === e.code);
      if (secret) {
        setActiveSecret(secret);
        setIsVisible(true);
        setFadeOut(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const secret = secretMessages.find(s => s.key === e.code);
      if (secret) {
        setFadeOut(true);
        setTimeout(() => {
          setIsVisible(false);
          setActiveSecret(null);
        }, 500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="bg-[#111] border border-[#333] p-6 max-w-md w-full cyber-card">
        <div className="text-[#94A3B8] text-xs mb-2 font-mono">INFO://{activeSecret?.title.toLowerCase().replace(/\s+/g, '_')}</div>
        <h3 className="text-[#9B59B6] text-xl mb-4 font-mono">{activeSecret?.title}</h3>
        <p className="text-[#ccc] font-mono text-sm leading-relaxed">
          {activeSecret?.message}
        </p>
        <div className="mt-6 text-[#555] text-xs">
          Release key to continue...
        </div>
      </div>
    </div>
  );
} 