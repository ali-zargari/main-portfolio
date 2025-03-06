'use client';

import { useState, useEffect } from 'react';

export default function WarningModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasVisited, setHasVisited] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Animation styles
  const modalStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(-50px)',
    transition: 'opacity 0.3s ease, transform 0.3s ease'
  };

  useEffect(() => {
    setIsClient(true);
    
    // Check if user has visited before
    const visited = localStorage.getItem('hasVisitedBefore');
    if (!visited) {
      setHasVisited(false);
      setIsVisible(true);
      
      // Simulate loading
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setShowContent(true);
            return 100;
          }
          return prev + Math.floor(Math.random() * 5) + 1;
        });
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, []);

  const handleProceed = () => {
    localStorage.setItem('hasVisitedBefore', 'true');
    setIsVisible(false);
  };

  if (!isClient) return null;
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div 
        style={modalStyle}
        className="bg-[#111] border border-[#333] p-6 max-w-md w-full relative overflow-hidden rounded-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#94A3B8] to-[#9B59B6]">Ali Zargari</div>
          <div className="text-xs font-mono opacity-70">Software Engineer</div>
        </div>
        
        {!showContent ? (
          <div className="space-y-4 py-4">
            <div className="text-sm mb-2">Loading portfolio...</div>
            <div 
              className="h-1 w-full mt-2 mb-4 rounded-full overflow-hidden"
            >
              <div 
                className="bg-gradient-to-r from-[#94A3B8] to-[#9B59B6] h-full"
                style={{ width: `${loadingProgress}%`, transition: 'width 0.5s ease-in-out' }}
              ></div>
            </div>
            <div className="text-xs opacity-70">{loadingProgress}% complete</div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <h2 className="text-xl font-bold mb-2">Welcome</h2>
            <p className="text-sm leading-relaxed">
              Thank you for visiting my portfolio. Here you'll find my work in software engineering, 
              AI, and IoT systems. I specialize in creating intelligent solutions that solve real-world problems.
            </p>
            <div className="flex justify-end">
              <button 
                onClick={handleProceed}
                className="bg-gradient-to-r from-[#94A3B8] to-[#9B59B6] hover:opacity-90 text-white px-6 py-2 transition-all duration-300 text-sm font-medium"
              >
                Enter Portfolio
              </button>
            </div>
          </div>
        )}
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#94A3B8] to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#9B59B6] to-transparent opacity-50"></div>
      </div>
    </div>
  );
} 