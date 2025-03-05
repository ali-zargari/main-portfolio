'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WarningModal from '@/components/WarningModal';
import SubliminalMessages from '@/components/SubliminalMessages';
import EasterEgg from '@/components/EasterEgg';
import Navigation from '@/components/Navigation';
import TheCost from '@/components/TheCost';
import dynamic from 'next/dynamic';

const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), { ssr: false });

// GitHub Contributions Component
function GitHubContributions() {
  const [contributionData, setContributionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const fetchContributions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/github-contributions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'ali-zargari' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setContributionData(data);
      setDebugInfo(`Fetched ${data.totalContributions} contributions for ali-zargari`);
    } catch (err) {
      setError((err as Error).message);
      console.error('Error fetching contributions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  // Function to determine the color based on contribution count
  const getContributionColor = (count: number) => {
    if (count === 0) return 'bg-[#161b22]';
    if (count <= 3) return 'bg-[#0e4429]';
    if (count <= 6) return 'bg-[#006d32]';
    if (count <= 9) return 'bg-[#26a641]';
    return 'bg-[#39d353]';
  };

  // Create month labels for the last year
  const generateMonthLabels = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    const lastYearMonths = [];
    
    for (let i = 0; i < 12; i++) {
      const d = new Date(today);
      d.setMonth(today.getMonth() - 11 + i);
      lastYearMonths.push({
        name: months[d.getMonth()],
        index: d.getMonth()
      });
    }
    
    return lastYearMonths;
  };

  if (loading) {
    return (
      <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-6 max-w-5xl mx-auto">
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse flex space-x-2">
            <div className="h-2 w-2 bg-[#39d353] rounded-full"></div>
            <div className="h-2 w-2 bg-[#39d353] rounded-full"></div>
            <div className="h-2 w-2 bg-[#39d353] rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-6 max-w-5xl mx-auto">
        <div className="text-red-500">Error: {error}</div>
        <button 
          onClick={fetchContributions} 
          className="mt-4 bg-[#238636] text-white px-4 py-2 rounded-md hover:bg-[#2ea043] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!contributionData) {
    return null;
  }

  // Days of the week for display
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Generate a proper contribution grid
  const generateContributionGrid = () => {
    // Create mapping of date strings to contribution counts
    const dateMap = new Map();
    if (contributionData && contributionData.weeks) {
      contributionData.weeks.forEach((week: any) => {
        week.contributionDays.forEach((day: any) => {
          dateMap.set(day.date, day.contributionCount);
        });
      });
    }

    // Calculate the start and end dates
    const today = new Date();
    const endDate = new Date(today);
    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1);
    startDate.setDate(startDate.getDate() + 1); // Start from the day after one year ago

    // Generate all days in the last year
    const days = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: new Date(d),
        dateStr,
        count: dateMap.get(dateStr) || 0,
        dayOfWeek: d.getDay()
      });
    }

    // Group days by week (starting from Sunday)
    const weeks = [];
    let currentWeek: any[] = [];
    
    // Handle first partial week - fill with null for days before startDate
    const firstDayOfWeek = startDate.getDay();
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        currentWeek.push(null);
      }
    }
    
    // Add all days to weeks
    days.forEach(day => {
      currentWeek.push(day);
      if (day.dayOfWeek === 6) { // Saturday
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });
    
    // Add the last partial week if there are any remaining days
    if (currentWeek.length > 0) {
      weeks.push([...currentWeek]);
    }
    
    return { weeks, monthLabels: generateMonthLabels() };
  };

  const { weeks, monthLabels } = generateContributionGrid();

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-6 max-w-5xl mx-auto backdrop-blur-sm shadow-xl relative overflow-hidden group">
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#9B59B6]/0 via-[#9B59B6]/5 to-[#9B59B6]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      
      <div className="flex flex-col mb-8">
        <div className="flex justify-between items-center border-b border-[#30363d] pb-4 mb-4">
          <h3 className="text-xl font-bold text-[#9B59B6] font-mono">
            GITHUB CONTRIBUTIONS
          </h3>
          <a 
            href="https://github.com/ali-zargari" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-white/70 hover:text-white transition-colors duration-300 text-sm font-mono"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            @ali-zargari
          </a>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-white/80 font-mono text-sm">
            {contributionData.totalContributions} contributions in the last year
          </div>
        </div>
      </div>
      
      {contributionData.simulatedData && (
        <div className="mb-8 p-3 border border-[#9B59B6]/30 bg-[#9B59B6]/10 rounded-md">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9B59B6] mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-[#9B59B6] font-medium">Using simulated data</p>
              <p className="text-white/70 text-sm mt-1">
                {contributionData.error || 'GitHub API token not configured'}
              </p>
              <div className="mt-4">
                <button 
                  onClick={() => fetchContributions()} 
                  className="text-xs bg-[#9B59B6] hover:bg-[#9B59B6]/80 text-white px-3 py-1 rounded-sm transition-colors font-mono"
                >
                  TRY AGAIN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debug info */}
      {!contributionData.simulatedData && debugInfo && (
        <div className="mb-4 p-2 bg-black/30 rounded text-xs text-white/70 font-mono">
          {debugInfo}
        </div>
      )}

      {/* Contribution Graph */}
      <div className="overflow-x-auto">
        <div className="min-w-[750px]">
          {/* Month labels */}
          <div className="flex mb-2 pl-10">
            {monthLabels.map((month, i) => (
              <div key={i} className="flex-1 text-center text-xs text-white/50 font-mono">
                {month.name}
              </div>
            ))}
          </div>

          {/* Grid with days and contribution cells */}
          <div className="flex">
            {/* Day labels */}
            <div className="pr-2">
              {[1, 2, 3, 4, 5, 6, 0].map((dayIndex) => (
                <div key={dayIndex} className="h-[11px] text-xs text-white/50 flex items-center font-mono" style={{ marginTop: dayIndex === 0 ? '0' : '2px', marginBottom: dayIndex === 6 ? '0' : '2px' }}>
                  {daysOfWeek[dayIndex]}
                </div>
              ))}
            </div>
            
            {/* Contribution grid */}
            <div className="flex-1 grid grid-flow-col auto-cols-fr gap-[3px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {Array(7).fill(0).map((_, dayIndex) => {
                    const day = week[dayIndex];
                    return (
                      <div 
                        key={dayIndex}
                        className={`w-[10px] h-[10px] rounded-sm ${day ? getContributionColor(day.count) : 'bg-transparent'} hover:ring-1 hover:ring-[#9B59B6]/50 transition-all duration-150`}
                        title={day ? `${day.count} contributions on ${day.dateStr}` : undefined}
                      ></div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-between items-center mt-6 pt-3 border-t border-[#30363d]">
            <a 
              href="https://github.com/ali-zargari" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-[#9B59B6] hover:text-[#9B59B6]/80 transition-colors font-mono flex items-center"
            >
              <span>View on GitHub</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
            <div className="flex items-center">
              <div className="text-xs text-white/50 mr-2 font-mono">Less</div>
              <div className="w-[10px] h-[10px] rounded-sm bg-[#161b22] mx-[1px]"></div>
              <div className="w-[10px] h-[10px] rounded-sm bg-[#0e4429] mx-[1px]"></div>
              <div className="w-[10px] h-[10px] rounded-sm bg-[#006d32] mx-[1px]"></div>
              <div className="w-[10px] h-[10px] rounded-sm bg-[#26a641] mx-[1px]"></div>
              <div className="w-[10px] h-[10px] rounded-sm bg-[#39d353] mx-[1px]"></div>
              <div className="text-xs text-white/50 ml-2 font-mono">More</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(0);
  const titles = ['Software Engineer.', 'Systems Developer.', 'AI Specialist.', 'IoT Innovator.'];
  const [isClient, setIsClient] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [particles, setParticles] = useState<Array<{
    left: string;
    top: string;
    delay: string;
    duration: string;
    tx: string;
    ty: string;
  }>>([]);
  
  // Animation styles
  const fadeIn = {
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0px)' : 'translateY(20px)',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
    transitionDelay: '0.3s'
  };
  
  const fadeInDelayed = {
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0px)' : 'translateY(20px)',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
    transitionDelay: '0.6s'
  };
  
  const fadeInButtons = {
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0px)' : 'translateY(20px)',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
    transitionDelay: '0.9s'
  };

  useEffect(() => {
    setIsClient(true);
    
    // Simulate loading
    setTimeout(() => {
      setLoaded(true);
    }, 500);

    // Generate particles once on client-side only
    const newParticles = Array.from({ length: 8 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${3 + Math.random() * 4}s`,
      tx: `${(Math.random() * 40) - 20}px`,
      ty: `${(Math.random() * 40) - 20}px`
    }));
    setParticles(newParticles);

    // Title rotation
    const titleInterval = setInterval(() => {
      setCurrentTitle(prev => (prev + 1) % titles.length);
    }, 3000);

    // Scroll parallax effect
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(titleInterval);
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Calculate parallax transforms - limit maximum movement to avoid excessive animation
  const parallaxStyle = (factor: number) => {
    // Limit the maximum effect of parallax to keep things subtle
    const maxOffset = 50; // maximum pixels to move
    const offset = Math.min(Math.abs(scrollY * factor), maxOffset) * Math.sign(factor);
    
    return {
      transform: `translateY(${offset}px)`,
      transition: 'transform 0.2s ease-out'
    };
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Three.js Background */}
      <ThreeBackground />
      
      {/* Components that appear on all pages */}
      <WarningModal />
      <SubliminalMessages />
      <EasterEgg />
      <Navigation />
      <TheCost />

      {/* Hero section */}
      <section className="h-screen flex flex-col justify-center items-center relative z-10">
        {/* Main title with subtle parallax */}
        <div className="text-center" style={fadeIn}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight">
            ALI ZARGARI
          </h1>
          <div className="h-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl text-[#9B59B6] mb-6 font-mono">
              {titles[currentTitle]}
            </h2>
          </div>
          <p 
            className="max-w-md mx-auto text-sm sm:text-base opacity-70 mb-8 leading-relaxed"
            style={fadeInDelayed}
          >
            I build intelligent systems that integrate AI, IoT, and computer vision technologies to create innovative solutions.
          </p>
        </div>

        {/* CTA buttons with very subtle parallax */}
        <div 
          className="flex flex-col sm:flex-row gap-4"
          style={fadeInButtons}
        >
          <Link 
            href="/quantum-initiatives" 
            className="bg-[#9B59B6] text-white px-6 py-3 font-mono hover:bg-opacity-80 transition-all duration-300 relative group"
          >
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            VIEW PROJECTS
          </Link>
          <Link 
            href="/origin-story" 
            className="border border-[#00FFFF] text-[#00FFFF] px-6 py-3 font-mono hover:bg-[#00FFFF] hover:bg-opacity-10 transition-all duration-300"
          >
            ABOUT ME
          </Link>
        </div>

        {/* Scroll indicator with stronger parallax since it should move */}
        <div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          style={{...fadeInButtons, ...parallaxStyle(0.1)}}
          onClick={() => {
            // Smooth scroll to the next section
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth'
            });
          }}
        >
          <span className="text-xs font-mono mb-2">SCROLL TO EXPLORE</span>
          <div className="w-5 h-10 border border-white/50 rounded-full flex justify-center p-1 relative overflow-hidden backdrop-blur-sm group">
            <div className="w-1 h-2 bg-[#00FFFF] rounded-full animate-bounce"></div>
            {/* Glowing effect on hover */}
            <div className="absolute inset-0 bg-[#00FFFF]/0 group-hover:bg-[#00FFFF]/20 transition-all duration-500"></div>
          </div>
          {/* Animated particles that match the ThreeBackground - using precomputed values to avoid hydration errors */}
          {isClient && (
            <div className="absolute -z-10 w-20 h-20 opacity-75">
              {particles.map((particle, i) => (
                <div 
                  key={i}
                  className="absolute w-1 h-1 bg-[#00FFFF] rounded-full animate-float"
                  style={{
                    left: particle.left,
                    top: particle.top,
                    animationDelay: particle.delay,
                    animationDuration: particle.duration,
                    '--tx': particle.tx,
                    '--ty': particle.ty
                  } as React.CSSProperties}
                ></div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brief introduction section with subtle parallax */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto" style={parallaxStyle(0.05)}>
          {/* Animated heading with glowing effect */}
          <div className="mb-16 relative">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight relative inline-block animate-glow">
              MY WORK
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00FFFF]/0 via-[#00FFFF]/10 to-[#00FFFF]/0 blur-lg opacity-70 -z-10"></div>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#9B59B6] to-[#00FFFF] mb-8"></div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#00FFFF]/5 rounded-full blur-3xl -z-10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Left column with animated text */}
            <div className="space-y-8 backdrop-blur-sm bg-black/20 p-8 border border-white/5 rounded-lg relative">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 border-t border-r border-[#00FFFF]/20 -mt-2 -mr-2"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b border-l border-[#00FFFF]/20 -mb-2 -ml-2"></div>
              
              <p className="text-lg leading-relaxed group">
                I build systems that <span className="text-[#00FFFF] inline-block relative">
                  integrate
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#00FFFF]/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </span> AI, IoT, and computer vision technologies to create <span className="text-[#00FFFF] inline-block relative">
                  intelligent
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#00FFFF]/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </span> solutions.
              </p>
              
              <div className="pl-4 border-l-2 border-[#9B59B6]">
                <p className="text-lg leading-relaxed">
                  My work includes projects like <span className="font-semibold text-white">Olympus</span>, an AI-powered smart home system, 
                  and <span className="font-semibold text-white">Memento</span>, an IoT solution for individuals with memory impairment.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3 pt-4">
                <span className="px-3 py-1 bg-[#111] text-xs font-mono rounded-full border border-[#333] text-[#00FFFF]">Python</span>
                <span className="px-3 py-1 bg-[#111] text-xs font-mono rounded-full border border-[#333] text-[#9B59B6]">TensorFlow</span>
                <span className="px-3 py-1 bg-[#111] text-xs font-mono rounded-full border border-[#333] text-white">OpenCV</span>
                <span className="px-3 py-1 bg-[#111] text-xs font-mono rounded-full border border-[#333] text-[#00FFFF]">IoT</span>
                <span className="px-3 py-1 bg-[#111] text-xs font-mono rounded-full border border-[#333] text-[#9B59B6]">Embedded Systems</span>
              </div>
            </div>
            
            {/* Right column with project cards */}
            <div className="relative" style={parallaxStyle(0.08)}>
              {/* Glowing background effect */}
              <div className="absolute -inset-10 bg-gradient-to-br from-[#9B59B6]/10 to-[#00FFFF]/10 rounded-lg blur-3xl -z-10 opacity-50"></div>
              
              {/* Project cards container */}
              <div className="relative z-10 backdrop-blur-md bg-black/40 p-8 rounded-lg border border-white/10 h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="text-[#00FFFF] text-sm font-mono animate-glow">PROJECTS</div>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-[#00FFFF]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#9B59B6]"></div>
                    <div className="w-2 h-2 rounded-full bg-white/50"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {/* Project 1 - Olympus */}
                  <div className="group relative bg-gradient-to-r from-black/40 to-black/60 p-4 rounded border-l-2 border-[#00FFFF] hover:bg-black/50 transition-all duration-300">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-mono text-base group-hover:text-[#00FFFF] transition-colors duration-300">OLYMPUS</h3>
                      <span className="font-mono text-[#00FFFF] text-xs px-2 py-0.5 rounded bg-[#00FFFF]/10">Active</span>
                    </div>
                    
                    <p className="text-xs text-white/70 mb-3">AI-powered smart home system with IoT integration</p>
                    
                    <div className="w-full bg-[#222] h-1 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-[#00FFFF]/80 to-[#00FFFF] h-full rounded-full" 
                           style={{ width: '90%', transition: 'width 1s ease-in-out' }}></div>
                    </div>
                    
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#00FFFF]/20 rounded-tr"></div>
                  </div>
                  
                  {/* Project 2 - SocialSync */}
                  <div className="group relative bg-gradient-to-r from-black/40 to-black/60 p-4 rounded border-l-2 border-[#9B59B6] hover:bg-black/50 transition-all duration-300">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-mono text-base group-hover:text-[#9B59B6] transition-colors duration-300">SocialSync</h3>
                      <span className="font-mono text-[#9B59B6] text-xs px-2 py-0.5 rounded bg-[#9B59B6]/10">Complete</span>
                    </div>
                    
                    <p className="text-xs text-white/70 mb-3">AI-powered assistive tool for ASD therapy</p>
                    
                    <div className="w-full bg-[#222] h-1 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-[#9B59B6]/80 to-[#9B59B6] h-full rounded-full" 
                           style={{ width: '100%', transition: 'width 1s ease-in-out' }}></div>
                    </div>
                    
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#9B59B6]/20 rounded-tr"></div>
                  </div>
                  
                  {/* Project 3 - Memento */}
                  <div className="group relative bg-gradient-to-r from-black/40 to-black/60 p-4 rounded border-l-2 border-white/50 hover:bg-black/50 transition-all duration-300">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-mono text-base group-hover:text-white transition-colors duration-300">Memento</h3>
                      <span className="font-mono text-white text-xs px-2 py-0.5 rounded bg-white/10">Active</span>
                    </div>
                    
                    <p className="text-xs text-white/70 mb-3">IoT solution for memory impairment assistance</p>
                    
                    <div className="w-full bg-[#222] h-1 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-white/50 to-white/80 h-full rounded-full" 
                           style={{ width: '85%', transition: 'width 1s ease-in-out' }}></div>
                    </div>
                    
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/20 rounded-tr"></div>
                  </div>
                  
                  {/* Project 4 - Localization System */}
                  <div className="group relative bg-gradient-to-r from-black/40 to-black/60 p-4 rounded border-l-2 border-red-500/50 hover:bg-black/50 transition-all duration-300">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-mono text-base group-hover:text-red-500 transition-colors duration-300">Localization System</h3>
                      <span className="font-mono text-red-500 text-xs px-2 py-0.5 rounded bg-red-500/10">Active</span>
                    </div>
                    
                    <p className="text-xs text-white/70 mb-3">SLAM and EKF-based positioning technology</p>
                    
                    <div className="w-full bg-[#222] h-1 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-red-500/50 to-red-500/80 h-full rounded-full" 
                           style={{ width: '80%', transition: 'width 1s ease-in-out' }}></div>
                    </div>
                    
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-red-500/20 rounded-tr"></div>
                  </div>
                </div>
                
                {/* Interactive tech stack section */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="text-xs font-mono text-white/60 mb-4">TECHNOLOGIES</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-[#111] text-xs font-mono rounded-sm border border-[#333] text-[#00FFFF] hover:bg-[#00FFFF]/10 transition-colors cursor-default">AI</span>
                    <span className="px-2 py-1 bg-[#111] text-xs font-mono rounded-sm border border-[#333] text-[#9B59B6] hover:bg-[#9B59B6]/10 transition-colors cursor-default">TensorFlow</span>
                    <span className="px-2 py-1 bg-[#111] text-xs font-mono rounded-sm border border-[#333] text-white hover:bg-white/10 transition-colors cursor-default">OpenCV</span>
                    <span className="px-2 py-1 bg-[#111] text-xs font-mono rounded-sm border border-[#333] text-[#00FFFF] hover:bg-[#00FFFF]/10 transition-colors cursor-default">IoT</span>
                    <span className="px-2 py-1 bg-[#111] text-xs font-mono rounded-sm border border-[#333] text-red-500 hover:bg-red-500/10 transition-colors cursor-default">ROS2</span>
                    <span className="px-2 py-1 bg-[#111] text-xs font-mono rounded-sm border border-[#333] text-[#9B59B6] hover:bg-[#9B59B6]/10 transition-colors cursor-default">Flask</span>
                    <span className="px-2 py-1 bg-[#111] text-xs font-mono rounded-sm border border-[#333] text-white hover:bg-white/10 transition-colors cursor-default">React</span>
                  </div>
                </div>
                
                {/* View all projects button */}
                <div className="mt-8 text-center">
                  <Link 
                    href="/quantum-initiatives" 
                    className="inline-block px-6 py-2 border border-[#00FFFF]/30 text-[#00FFFF] text-xs font-mono hover:bg-[#00FFFF]/10 transition-all duration-300 rounded group relative overflow-hidden hover-glow"
                  >
                    <span className="relative z-10">VIEW ALL PROJECTS</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-[#00FFFF]/0 to-[#00FFFF]/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GitHub Contribution Graph Section */}
      <section className="py-20 bg-black/30 relative z-10">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Development Activity</h2>
            <div className="w-20 h-1 bg-[#9B59B6] mx-auto mb-8"></div>
            <p className="text-lg max-w-2xl mx-auto text-white/70 mb-12" style={parallaxStyle(0.03)}>
              Consistent contribution and dedication to code. Each square represents a day of active development.
            </p>
          </div>

          <div style={parallaxStyle(0.02)}>
            <GitHubContributions />
          </div>
        </div>
      </section>

      {/* Final CTA section */}
      <section className="min-h-[50vh] flex flex-col justify-center items-center px-4 py-20 relative z-10 bg-gradient-to-b from-transparent to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center" style={parallaxStyle(0.04)}>
          <h2 className="text-3xl sm:text-5xl font-bold mb-8 tracking-tight">
            EXPLORE MY WORK
          </h2>
          <p className="text-lg mb-12 max-w-2xl mx-auto">
            Discover my projects in AI, IoT, and software engineering. From smart home systems to assistive technologies.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/quantum-initiatives" 
              className="bg-[#9B59B6] text-white px-8 py-4 font-mono hover:bg-opacity-80 transition-all duration-300"
            >
              VIEW PROJECTS
            </Link>
            <Link 
              href="/contact" 
              className="border border-[#00FFFF] text-[#00FFFF] px-8 py-4 font-mono hover:bg-[#00FFFF] hover:bg-opacity-10 transition-all duration-300"
            >
              CONTACT ME
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
