'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import dynamic from 'next/dynamic';
import SubliminalMessages from '@/components/SubliminalMessages';
import EasterEgg from '@/components/EasterEgg';
import TheCost from '@/components/TheCost';
import GlitchText from '@/components/GlitchText';
import WarningModal from '@/components/WarningModal';
import githubRepoData from '@/data/github_repo_analysis.json';
import majorProjectsData from '@/data/major_projects.json';

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
    setDebugInfo(null);
    
    try {
      const response = await fetch('/api/github-contributions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'ali-zargari' }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch GitHub contributions');
      }
      
      setContributionData(data);
      
      // Set debug info if available
      if (data.totalContributions) {
        setDebugInfo(`${data.totalContributions} contributions in the last year`);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
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
          <div className="text-gray-400">Loading contributions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-6 max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center h-40">
          <div className="text-red-400 mb-4">Unable to load GitHub contributions</div>
          <button 
            onClick={fetchContributions} 
            className="bg-[#238636] text-white px-4 py-2 rounded-md hover:bg-[#2ea043] transition-colors"
          >
            Retry
          </button>
        </div>
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
      
      {/* Debug info */}
      {debugInfo && (
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

// ProjectCard component with its own state
function ProjectCard({ project, isExpanded, onToggleExpand }: { project: any, isExpanded: boolean, onToggleExpand: () => void }) {
  // Check if the card needs expansion at all (short description and few technologies)
  const needsExpansion = project.description.length > 140 || (project.technologies && project.technologies.length > 4);
  
  return (
    <div 
      className="w-80 flex-shrink-0 relative rounded-xl overflow-hidden"
      style={{
        height: isExpanded ? 'auto' : '520px',
        minHeight: isExpanded ? '650px' : '520px',
        maxHeight: isExpanded ? '1000px' : '520px',
        transition: 'min-height 0.5s ease-in-out, max-height 0.5s ease-in-out'
      }}
    >
      {/* Translucent background */}
      <div className="absolute inset-0 bg-[#111]/80 backdrop-blur-sm z-0"></div>
      <div className="absolute inset-0 rounded-xl border border-white/10 z-0"></div>
      
      {/* Content container */}
      <div className="relative z-10 flex flex-col h-full" style={{ textShadow: 'none' }}>
        {/* HEADER - Fixed height */}
        <div className="h-[70px] p-4 flex justify-between items-start">
          <h3 className="text-xl font-bold text-white hover:text-[#94A3B8] line-clamp-2 w-[70%]" style={{ textShadow: 'none' }}>
          {project.title}
        </h3>
        
          <div className="flex-shrink-0">
            <span className="text-sm font-mono text-white/80 bg-black/50 px-2.5 py-1 rounded-full border border-white/10" style={{ textShadow: 'none' }}>
            {project.year}
          </span>
        </div>
      </div>
      
        {/* BODY */}
        <div className="px-6 py-1 flex flex-col flex-grow overflow-hidden">
          {/* Project logo/badge */}
          <div className="flex justify-center items-center mb-3">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold hover:scale-105"
              style={{ 
                backgroundColor: project.bgColor || '#6b7280', 
                color: '#fff', 
                textShadow: 'none',
                transition: 'transform 0.3s ease'
              }}
        >
          {project.initials}
        </div>
      </div>
      
        {/* Badges row */}
          <div className="flex items-center gap-2 h-[30px] mb-3 overflow-x-auto hide-scrollbar">
            <div 
              className="px-3 py-1 bg-black/70 rounded-full text-xs font-mono text-white/80 border border-white/10 flex items-center h-6 flex-shrink-0" 
              style={{ textShadow: 'none' }}
            >
              <span className="opacity-70 mr-1" style={{ textShadow: 'none' }}>Complexity:</span>
              <span style={{ textShadow: 'none' }}>{project.milestone}</span>
          </div>
          
          {project.link && (
            <a 
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
                className="px-3 py-1 bg-black/70 rounded-full text-xs font-mono text-white/80 border border-white/10 hover:bg-black hover:text-white transition-all duration-300 flex items-center h-6 flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
                style={{ textShadow: 'none' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
                <span style={{ textShadow: 'none' }}>Repository</span>
            </a>
          )}
        </div>
        
          {/* Description with overflow hidden and ellipsis if needed */}
          <div className="mb-4 transition-all duration-500 ease-in-out">
            <div className={`transition-all duration-500 ease-in-out ${isExpanded ? '' : 'overflow-hidden'}`} style={{ 
              maxHeight: isExpanded ? '1000px' : '140px',
              transition: 'max-height 0.5s ease-in-out'
            }}>
              <p className="text-sm text-white/80 leading-relaxed" style={{ textShadow: 'none' }}>
                {isExpanded 
                  ? project.description
                  : project.description.length > 140 
                    ? project.description.substring(0, 140).trim() + '...' 
                    : project.description
                }
              </p>
            </div>
        </div>
        
          {/* Technologies with limited display */}
          <div className="mb-4 transition-all duration-500 ease-in-out">
            <h4 className="text-xs font-mono text-white/60 mb-2 uppercase tracking-wider" style={{ textShadow: 'none' }}>
              Technologies
            </h4>
            <div className={`flex flex-wrap gap-2 transition-all duration-500 ease-in-out ${isExpanded ? '' : 'overflow-hidden'}`} style={{
              maxHeight: isExpanded ? '1000px' : '120px',
              transition: 'max-height 0.5s ease-in-out'
            }}>
            {project.technologies && project.technologies.length > 0 ? (
              <>
                  {/* Show all techs when expanded, or just first 4 when collapsed */}
                {(isExpanded ? project.technologies : project.technologies.slice(0, 4)).map((tech: string, techIndex: number) => (
                  <span 
                    key={techIndex} 
                      className="px-2.5 py-1 bg-black/50 text-xs font-mono rounded-full border border-white/10 text-white/80 mb-1"
                      style={{ textShadow: 'none' }}
                  >
                    {tech}
                  </span>
                ))}
                  
                  {/* Show "+X more" badge when collapsed and there are more than 4 techs */}
                {!isExpanded && project.technologies.length > 4 && (
                    <span className="px-2.5 py-1 bg-black/40 text-xs font-mono rounded-full border border-white/5 text-white/70 mb-1"
                      style={{ textShadow: 'none' }}
                    >
                    +{project.technologies.length - 4} more
                  </span>
                )}
              </>
            ) : (
                <span className="px-2.5 py-1 bg-black/50 text-xs font-mono rounded-full border border-white/10 text-white/80" style={{ textShadow: 'none' }}>
                No technologies listed
              </span>
            )}
            </div>
          </div>
        </div>
        
        {/* FOOTER with button - only show if expansion is needed */}
        <div className="h-[50px] px-6 flex items-center justify-center mt-auto">
          {/* Check if expansion is needed based on content length, or already expanded */}
          {(needsExpansion || isExpanded) && (
          <button 
            onClick={onToggleExpand}
              className="px-4 py-1 bg-black/60 text-white/80 hover:text-white text-xs font-mono rounded-full border border-white/10 hover:border-white/20 flex items-center"
              style={{ textShadow: 'none' }}
            >
              {isExpanded ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                  <span style={{ textShadow: 'none' }}>Collapse</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
                  <span style={{ textShadow: 'none' }}>Expand</span>
                </>
              )}
          </button>
          )}
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
  const timelineRef = useRef<HTMLDivElement>(null);
  // Track expanded cards with their indices
  const [expandedCardIndices, setExpandedCardIndices] = useState<number[]>([]);
  
  // Add state to track if we're at the beginning or end of scroll
  const [scrollState, setScrollState] = useState({ isAtStart: true, isAtEnd: false });
  
  // Function to toggle a card's expanded state
  const toggleCardExpansion = (index: number) => {
    setExpandedCardIndices(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };
  
  // Check if a specific card is expanded
  const isCardExpanded = (index: number) => {
    return expandedCardIndices.includes(index);
  };
  
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

  const [currentPage, setCurrentPage] = useState(0);
  // Add state for cards per page
  const [cardsPerPage, setCardsPerPage] = useState(4);
  // Add state for animation
  const [isAnimating, setIsAnimating] = useState(false);
  // Add state to track which dot was clicked for animation
  const [clickedDot, setClickedDot] = useState<number | null>(null);
  
  // Force re-render on scroll to update progress bar
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Throttle function to limit frequent updates
  const throttle = useCallback(<T extends (...args: any[]) => any>(func: T, delay: number) => {
    let lastCall = 0;
    return function(...args: Parameters<T>) {
      const now = Date.now();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return func(...args);
    };
  }, []);
  
  // Update on scroll with throttling
  useEffect(() => {
    const container = timelineRef.current;
    if (!container) return;
    
    // Create throttled handler to limit updates
    const handleScrollThrottled = throttle((scrollLeft: number) => {
      // Using RAF to align with the browser's rendering cycle
      requestAnimationFrame(() => {
        setScrollPosition(scrollLeft);
        setScrollState({
          isAtStart: scrollLeft <= 10,
          isAtEnd: scrollLeft >= container.scrollWidth - container.clientWidth - 10
        });
      });
    }, 16); // ~60fps
    
    const handleScroll = () => {
      handleScrollThrottled(container.scrollLeft);
    };
    
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [timelineRef, throttle]);

  // Memoize expensive computations
  const progressBarWidth = useMemo(() => {
    if (!timelineRef.current) return '0%';
    
    if (scrollState.isAtStart) return '0%';
    if (scrollState.isAtEnd) return '100%';
    
    return `${(scrollPosition / 
             (timelineRef.current.scrollWidth - timelineRef.current.clientWidth)) * 100}%`;
  }, [scrollPosition, scrollState.isAtStart, scrollState.isAtEnd]);
  
  useEffect(() => {
    setIsClient(true);
    
    setTimeout(() => {
      setLoaded(true);
    }, 300);

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

  // Smaller projects data - now loaded from JSON file
  const smallerProjects = githubRepoData
    .slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => b.year - a.year) // Sort by year in descending order
    .map(repo => {
    // Generate a unique but consistent color based on the repo name
    const getColorFromName = (name: string) => {
      const colors = [
        '#3498db', '#9b59b6', '#2ecc71', '#e74c3c', '#f39c12', 
        '#1abc9c', '#d35400', '#c0392b', '#16a085', '#8e44ad',
        '#27ae60', '#2980b9', '#f1c40f', '#e67e22', '#7f8c8d'
      ];
      
      // Simple hash function to get a consistent index
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      // Use the hash to pick a color
      const index = Math.abs(hash) % colors.length;
      return colors[index];
    };
    
    // Get a color for this repo
    const repoColor = getColorFromName(repo.name);
    
    // Create a gradient background for the thumbnail
    const gradientBg = `linear-gradient(135deg, ${repoColor}40, ${repoColor}10)`;
    
    // Get first letter of each word in the repo name for the thumbnail text
    const initials = repo.name
      .split('-')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
    
    return {
      title: repo.name,
      description: repo.purpose,
      // Use a dynamic thumbnail with gradient and initials instead of placeholder
      image: null, // We'll render a custom thumbnail
      bgColor: repoColor,
      gradient: gradientBg,
      initials: initials.length > 3 ? initials.substring(0, 3) : initials,
      link: `https://github.com/ali-zargari/${repo.name}`,
      technologies: repo.technologies,
      year: repo.year.toString(),
      milestone: repo.complexity
    };
  });

  // Development Journey Timeline - Elegant Redesign
  const [activeYear, setActiveYear] = useState('2021');
  
  // Scroll to projects from a specific year
  const scrollToYear = (year: string) => {
    if (!timelineRef.current) return;
    
    // Find the first project from this year
    const projectIndex = smallerProjects.findIndex(p => p.year === year);
    if (projectIndex === -1) return;
    
    // Calculate the scroll position (each card is approximately 288px wide + 32px gap)
    const cardWidth = 288 + 32; // card width + gap
    const scrollPosition = projectIndex * cardWidth;
    
    // Scroll to the position with smooth animation
    timelineRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };
  
  // Update scroll state on scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      const container = timelineRef.current;
      
      // Check if at start or end
      const isAtStart = container.scrollLeft <= 10; // Small threshold for slight inconsistencies
      const isAtEnd = Math.abs((container.scrollWidth - container.clientWidth) - container.scrollLeft) <= 10;
      
      // Update scroll state
      setScrollState({ isAtStart, isAtEnd });
      
      // Update scroll indicator position
      const indicator = container.querySelector('.scroll-indicator');
      if (indicator && indicator instanceof HTMLElement) {
        const scrollPercent = container.scrollLeft / (container.scrollWidth - container.clientWidth);
        const maxLeft = container.clientWidth - 40; // 40 is indicator width
        const newLeft = Math.max(0, Math.min(maxLeft * scrollPercent, maxLeft));
        
        // Set the position without transition for direct scrolling
        indicator.style.left = `${newLeft}px`;
      }
    };
    
    const container = timelineRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Call once to initialize
      handleScroll();
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [timelineRef.current]);
  
  // Scroll the timeline to the left or right
  const scrollTimeline = (direction: 'left' | 'right') => {
    if (!timelineRef.current || isAnimating) return;
    
    setIsAnimating(true);
    const container = timelineRef.current;
    const cardWidth = 320; // Width of a card + margin
    
    // Get the current scroll position
    const currentScrollLeft = container.scrollLeft;
    
    // Calculate the new scroll position - scroll by just one card at a time
    const newScrollLeft = direction === 'left' 
      ? Math.max(0, currentScrollLeft - cardWidth)
      : Math.min(container.scrollWidth - container.clientWidth, currentScrollLeft + cardWidth);
    
    // Calculate the total number of pages
    const visibleWidth = container.clientWidth;
    const cardsPerPage = Math.floor(visibleWidth / cardWidth);
    const totalPages = Math.ceil(smallerProjects.length / cardsPerPage);
    
    // Determine new page based on direction
    let newPage = currentPage;
    if (direction === 'left') {
      newPage = Math.max(0, currentPage - 1);
    } else {
      newPage = Math.min(totalPages - 1, currentPage + 1);
    }
    
    // Set the current page - this will update the progress bar
    setCurrentPage(newPage);
    
    // Smoothly scroll to the new position
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
    
    // Update scroll state after animation
    setTimeout(() => {
      const isAtStart = container.scrollLeft <= 10;
      const isAtEnd = Math.abs((container.scrollWidth - container.clientWidth) - container.scrollLeft) <= 10;
      setScrollState({ isAtStart, isAtEnd });
      setIsAnimating(false);
    }, 500);
  };
  
  // Function to handle direct page navigation using dots
  const goToPage = (pageIndex: number) => {
    if (!timelineRef.current || isAnimating) return;
    
    setIsAnimating(true);
    setClickedDot(pageIndex);
    
    const container = timelineRef.current;
    const cardWidth = 320; // Width of a card + margin
    const visibleWidth = container.clientWidth;
    const cardsPerPage = Math.floor(visibleWidth / cardWidth);
    
    // Calculate the new scroll position
    const newScrollLeft = pageIndex * cardsPerPage * cardWidth;
    
    // Smoothly scroll to the new position
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
    
    // Update current page
    setCurrentPage(pageIndex);
    
    // Update scroll state after animation
    setTimeout(() => {
      const isAtStart = container.scrollLeft <= 10;
      const isAtEnd = Math.abs((container.scrollWidth - container.clientWidth) - container.scrollLeft) <= 10;
      setScrollState({ isAtStart, isAtEnd });
      setIsAnimating(false);
      
      // Clear clicked dot after animation completes
      setTimeout(() => {
        setClickedDot(null);
      }, 300);
    }, 500);
  };

  // Update pagination dots when the container is scrolled
  useEffect(() => {
    const container = timelineRef.current;
    if (!container) return;
    
    const handleContainerScroll = () => {
      if (isAnimating) return;
      
      const scrollLeft = container.scrollLeft;
      const cardWidth = 320; // Width of a card + margin
      const visibleWidth = container.clientWidth;
      const cardsPerPage = Math.floor(visibleWidth / cardWidth);
      
      // Calculate current page based on scroll position
      const newPage = Math.round(scrollLeft / (cardsPerPage * cardWidth));
      
      // Only update if the page has changed
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      }
      
      // Update scroll state
      const isAtStart = scrollLeft <= 10;
      const isAtEnd = Math.abs((container.scrollWidth - container.clientWidth) - scrollLeft) <= 10;
      setScrollState({ isAtStart, isAtEnd });
    };
    
    container.addEventListener('scroll', handleContainerScroll);
    return () => container.removeEventListener('scroll', handleContainerScroll);
  }, [timelineRef, currentPage, isAnimating]);

  // Function to determine how many cards to show per page based on screen width
  const getCardsPerPage = () => {
    // Show fewer cards on smaller screens, but at least 2 on all screens
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 2; // Mobile - show at least 2
      if (window.innerWidth < 1024) return 3; // Tablet
      return 4; // Desktop
    }
    return 3; // Default for SSR
  };

  // Set up resize handler to update cardsPerPage
  const handleResize = () => {
    // Always set to 4 cards per page
    setCardsPerPage(4);
    
    // If the current page would be out of bounds after resize, adjust it
    const maxPages = Math.ceil(smallerProjects.length / 4) - 1;
    if (currentPage > maxPages) {
      setCurrentPage(maxPages);
    }
    
    // Update scroll position for the new cards per page
    if (timelineRef.current) {
      const cardWidth = 320; // Card width + gap
      timelineRef.current.scrollTo({
        left: currentPage * cardWidth * 4,
        behavior: 'auto'
      });
    }
    
    // Update scroll state
    setScrollState({
      isAtStart: currentPage === 0,
      isAtEnd: currentPage >= Math.ceil(smallerProjects.length / 4) - 1
    });
  };

  const [showContactModal, setShowContactModal] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: contactName, 
          email: contactEmail, 
          message: contactMessage 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      // Show success message
      setSubmitSuccess(true);
      
      // Reset form after a delay
      setTimeout(() => {
        setContactName('');
        setContactEmail('');
        setContactMessage('');
        setSubmitSuccess(false);
        setShowContactModal(false);
      }, 3000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred while sending your message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Three.js Background */}
      <ThreeBackground />
      
      {/* Components that appear on all pages */}
      <SubliminalMessages />
      <EasterEgg />
      <Navigation />

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
            className="border border-[#94A3B8] text-[#94A3B8] px-6 py-3 font-mono hover:bg-[#94A3B8] hover:bg-opacity-10 transition-all duration-300"
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
            <div className="w-1 h-2 bg-[#94A3B8] rounded-full animate-bounce"></div>
            {/* Glowing effect on hover */}
            <div className="absolute inset-0 bg-[#94A3B8]/0 group-hover:bg-[#94A3B8]/20 transition-all duration-500"></div>
          </div>
          {/* Animated particles that match the ThreeBackground - using precomputed values to avoid hydration errors */}
          {isClient && (
            <div className="absolute -z-10 w-20 h-20 opacity-75">
              {particles.map((particle, i) => (
                <div 
                  key={i}
                  className="absolute w-1 h-1 bg-[#94A3B8] rounded-full animate-float"
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
      <section className="py-24 bg-black/30 relative z-10">
        <div className="max-w-6xl mx-auto px-4" style={parallaxStyle(0.05)}>
          {/* Section header with minimal styling */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold relative inline-block animate-glow">
                MAJOR PROJECTS
                <div className="absolute -inset-1 bg-gradient-to-r from-[#94A3B8]/0 via-[#94A3B8]/10 to-[#94A3B8]/0 blur-lg opacity-70 -z-10"></div>
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[#9B59B6] to-[#94A3B8] mt-3"></div>
            </div>
            <Link 
              href="/quantum-initiatives"
              className="text-xs font-mono text-[#94A3B8] border border-[#94A3B8]/30 px-4 py-2 rounded hover:bg-[#94A3B8]/10 transition-all duration-300"
            >
              VIEW ALL PROJECTS
            </Link>
          </div>

          {/* Brief introduction text */}
          <div className="mb-10 max-w-3xl">
            <p className="text-lg leading-relaxed text-white/80">
              My flagship projects showcase advanced system development integrating cutting-edge technologies to solve complex challenges. 
              These represent my most significant technical achievements and largest-scale implementations.
            </p>
          </div>

          {/* Modern horizontal project cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {majorProjectsData.projects.map((project, index) => (
              <div 
                key={project.id}
                className="group relative rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#94A3B8]/20 backdrop-blur-sm bg-black/40 border border-white/10 hover:border-[#94A3B8]/30 h-full flex flex-col"
              >
                {/* Project image */}
                <div className="relative h-40 overflow-hidden">
                  <div className="absolute inset-0 bg-black/50 z-10 group-hover:bg-black/40 transition-all duration-300"></div>
                  {project.image && (
                    <div className="relative h-full w-full transform group-hover:scale-105 transition-transform duration-500">
                      <Image 
                        src={project.image} 
                        alt={project.title} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 z-20">
                    <span className="text-xs font-mono text-white/80 bg-black px-2 py-1 rounded-full border border-white/10">{project.year}</span>
                  </div>
                </div>
                
                {/* Project content */}
                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-[#94A3B8] transition-colors duration-300">{project.title}</h3>
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: project.color}}></div>
                  </div>
                  
                  <div className="inline-block px-2 py-0.5 bg-black border border-[#9B59B6]/30 rounded-full text-[#9B59B6] text-xs font-mono mb-3">
                    {project.status}
                  </div>
                  
                  <p className="text-sm text-white/70 leading-relaxed mb-4 flex-grow">
                    {project.description.length > 120 
                      ? `${project.description.substring(0, 120)}...` 
                      : project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tech: string, techIndex: number) => (
                      <span 
                        key={techIndex} 
                        className="px-2 py-0.5 bg-black text-xs font-mono rounded-full border border-white/10 text-white/80"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-xs text-white/50">+{project.tags.length - 3} more</span>
                    )}
                  </div>
                  
                  <Link 
                    href="/quantum-initiatives"
                    className="inline-flex items-center self-start mt-auto px-3 py-1 bg-black border border-[#94A3B8]/40 text-[#94A3B8] text-xs font-mono hover:bg-[#94A3B8]/10 transition-all duration-300 rounded-full group-hover:border-[#94A3B8]/60"
                  >
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* Skills and technologies */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center">
            <div className="text-xs font-mono text-white/60 mr-4">CORE TECHNOLOGIES:</div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-[#111] text-xs font-mono rounded-sm border border-[#333] text-[#94A3B8] hover:bg-[#94A3B8]/10 transition-colors cursor-default">Artificial Intelligence</span>
              <span className="px-2 py-1 bg-[#111] text-xs font-mono rounded-sm border border-[#333] text-[#94A3B8] hover:bg-[#94A3B8]/10 transition-colors cursor-default">Machine Learning</span>
              <span className="px-2 py-1 bg-[#111] text-xs font-mono rounded-sm border border-[#333] text-white hover:bg-white/10 transition-colors cursor-default">Computer Vision</span>
              <span className="px-2 py-1 bg-[#111] text-xs font-mono rounded-sm border border-[#333] text-[#94A3B8] hover:bg-[#94A3B8]/10 transition-colors cursor-default">IoT Architecture</span>
              <span className="px-2 py-1 bg-[#111] text-xs font-mono rounded-sm border border-[#333] text-[#94A3B8] hover:bg-[#94A3B8]/10 transition-colors cursor-default">Distributed Systems</span>
            </div>
          </div>
        </div>
      </section>

      {/* Development Journey Timeline - Elegant Redesign */}
      <section className="py-28 bg-black/30 relative z-10 overflow-hidden" style={{ textShadow: 'none' }}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-6">ADDITIONAL PROJECTS</h2>
            <div className="w-20 h-1 bg-[#9B59B6] mx-auto"></div>
            <p className="text-lg max-w-2xl mx-auto text-white/70 mb-20" style={parallaxStyle(0.03)}>
              A collection of focused development projects that demonstrate my technical versatility and showcase my skills across various platforms and technologies.
            </p>
          </div>

          {/* Simple horizontal scrolling container with navigation */}
          <div className="relative mx-auto max-w-full px-4 md:px-8 lg:px-12 mt-16">

              
            {/* Scrollable container - fix to allow multiple cards to show */}
            <div 
              ref={timelineRef}
              className="overflow-x-auto pb-8 hide-scrollbar mx-2 rounded-xl border border-white/10 p-4 bg-black/20 backdrop-blur-sm"
            >
              {/* Projects container - fix width to allow multiple cards to be visible */}
              <div className="flex space-x-6 items-stretch">
                {smallerProjects.map((project, index) => {
                  // Check if this specific card is expanded
                  const isExpanded = isCardExpanded(index);
                  
                  // Check if card needs expansion (long description or many technologies)
                  const needsExpansion = project.description.length > 140 || (project.technologies && project.technologies.length > 4);
                  
                  return (
                    <div 
                      key={index} 
                      className="w-80 flex-shrink-0 relative rounded-xl overflow-hidden"
                      style={{
                        height: isExpanded ? 'auto' : '520px',
                        minHeight: isExpanded ? '650px' : '520px',
                        maxHeight: isExpanded ? '1000px' : '520px',
                        transition: 'min-height 0.5s ease-in-out, max-height 0.5s ease-in-out'
                      }}
                    >
                      {/* Translucent background */}
                      <div className="absolute inset-0 bg-[#111]/80 backdrop-blur-sm z-0"></div>
                      <div className="absolute inset-0 rounded-xl border border-white/10 z-0"></div>
                      
                      {/* Content container */}
                      <div className="relative z-10 flex flex-col h-full" style={{ textShadow: 'none' }}>
                        {/* HEADER - Fixed height */}
                        <div className="h-[70px] p-4 flex justify-between items-start">
                          <h3 className="text-xl font-bold text-white hover:text-[#94A3B8] line-clamp-2 w-[70%]" style={{ textShadow: 'none' }}>
                            {project.title}
                          </h3>
                          
                          <div className="flex-shrink-0">
                            <span className="text-sm font-mono text-white/80 bg-black/50 px-2.5 py-1 rounded-full border border-white/10" style={{ textShadow: 'none' }}>
                              {project.year}
                            </span>
                          </div>
                        </div>
                        
                        {/* BODY */}
                        <div className="px-6 py-1 flex flex-col flex-grow overflow-hidden">
                          {/* Project logo/badge */}
                          <div className="flex justify-center items-center mb-3">
                            <div 
                              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold hover:scale-105"
                              style={{ 
                                backgroundColor: project.bgColor || '#6b7280', 
                                color: '#fff', 
                                textShadow: 'none',
                                transition: 'transform 0.3s ease'
                              }}
                            >
                              {project.initials}
                            </div>
                          </div>
                          
                          {/* Badges row */}
                          <div className="flex items-center gap-2 h-[30px] mb-3 overflow-x-auto hide-scrollbar">
                            <div 
                              className="px-3 py-1 bg-black/70 rounded-full text-xs font-mono text-white/80 border border-white/10 flex items-center h-6 flex-shrink-0" 
                              style={{ textShadow: 'none' }}
                            >
                              <span className="opacity-70 mr-1" style={{ textShadow: 'none' }}>Complexity:</span>
                              <span style={{ textShadow: 'none' }}>{project.milestone}</span>
                            </div>
                            
                            {project.link && (
                              <a 
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-black/70 rounded-full text-xs font-mono text-white/80 border border-white/10 hover:bg-black hover:text-white transition-all duration-300 flex items-center h-6 flex-shrink-0"
                                onClick={(e) => e.stopPropagation()}
                                style={{ textShadow: 'none' }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                </svg>
                                <span style={{ textShadow: 'none' }}>Repository</span>
                              </a>
                            )}
                          </div>
                          
                          {/* Description with overflow hidden and ellipsis if needed */}
                          <div className="mb-4 transition-all duration-500 ease-in-out">
                            <div className={`transition-all duration-500 ease-in-out ${isExpanded ? '' : 'overflow-hidden'}`} style={{ 
                              maxHeight: isExpanded ? '1000px' : '140px',
                              transition: 'max-height 0.5s ease-in-out'
                            }}>
                              <p className="text-sm text-white/80 leading-relaxed" style={{ textShadow: 'none' }}>
                                {isExpanded 
                                  ? project.description
                                  : project.description.length > 140 
                                    ? project.description.substring(0, 140).trim() + '...' 
                                    : project.description
                                }
                              </p>
                            </div>
                          </div>
                          
                          {/* Technologies with limited display */}
                          <div className="mb-4 transition-all duration-500 ease-in-out">
                            <h4 className="text-xs font-mono text-white/60 mb-2 uppercase tracking-wider" style={{ textShadow: 'none' }}>
                              Technologies
                            </h4>
                            <div className={`flex flex-wrap gap-2 transition-all duration-500 ease-in-out ${isExpanded ? '' : 'overflow-hidden'}`} style={{
                              maxHeight: isExpanded ? '1000px' : '120px',
                              transition: 'max-height 0.5s ease-in-out'
                            }}>
                              {project.technologies && project.technologies.length > 0 ? (
                                <>
                                  {/* Show all techs when expanded, or just first 4 when collapsed */}
                                  {(isExpanded ? project.technologies : project.technologies.slice(0, 4)).map((tech: string, techIndex: number) => (
                                    <span 
                                      key={techIndex} 
                                      className="px-2.5 py-1 bg-black/50 text-xs font-mono rounded-full border border-white/10 text-white/80 mb-1"
                                      style={{ textShadow: 'none' }}
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                  
                                  {/* Show "+X more" badge when collapsed and there are more than 4 techs */}
                                  {!isExpanded && project.technologies.length > 4 && (
                                    <span className="px-2.5 py-1 bg-black/40 text-xs font-mono rounded-full border border-white/5 text-white/70 mb-1"
                                      style={{ textShadow: 'none' }}
                                    >
                                      +{project.technologies.length - 4} more
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="px-2.5 py-1 bg-black/50 text-xs font-mono rounded-full border border-white/10 text-white/80" style={{ textShadow: 'none' }}>
                                  No technologies listed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* FOOTER with button - only show if expansion is needed */}
                        <div className="h-[50px] px-6 flex items-center justify-center mt-auto">
                          {/* Check if expansion is needed based on content length, or already expanded */}
                          {(needsExpansion || isExpanded) && (
                            <button 
                              onClick={() => toggleCardExpansion(index)}
                              className="px-4 py-1 bg-black/60 text-white/80 hover:text-white text-xs font-mono rounded-full border border-white/10 hover:border-white/20 flex items-center"
                              style={{ textShadow: 'none' }}
                            >
                              {isExpanded ? (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                                    <polyline points="18 15 12 9 6 15"></polyline>
                                  </svg>
                                  <span style={{ textShadow: 'none' }}>Collapse</span>
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                  </svg>
                                  <span style={{ textShadow: 'none' }}>Expand</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

              {/* Navigation bar*/}
              <div className="flex items-center justify-center relative mt-8">
              {/* Left scroll button */}
                <button 
                  onClick={() => scrollTimeline('left')}
                  className={`z-20 bg-black/70 hover:bg-black/90 text-white/70 hover:text-white w-10 h-10 rounded-full flex items-center justify-center border border-white/10 transition-all duration-300 mr-4 hover:border-[#94A3B8]/50 shadow-lg hover:shadow-[#94A3B8]/20 flex-shrink-0 absolute left-0 ${
                    scrollState.isAtStart ? 'opacity-0 pointer-events-none transform -translate-x-4' : 'opacity-100 transform translate-x-0'
                  }`}
                  aria-label="Previous project"
                  disabled={scrollState.isAtStart || isAnimating}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
              
                {/* Progress bar - simple implementation */}
                <div className="flex items-center justify-center py-2 px-6 bg-black/30 backdrop-blur-sm rounded-full border border-white/10">
                  <div className="relative w-60 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 h-full rounded-full bg-gradient-to-r from-[#9B59B6] to-[#94A3B8]"
                      style={{ 
                        width: progressBarWidth,
                        opacity: 0.9,
                        boxShadow: '0 0 10px 2px rgba(155, 89, 182, 0.3), 0 0 15px 4px rgba(155, 89, 182, 0.1)',
                        transition: 'width 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)'
                      }}
                    >
                      {/* Inner animated element for additional movement */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-progress-shine"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              
              {/* Right scroll button */}
              <button 
                onClick={() => scrollTimeline('right')}
                className={`z-20 bg-black/70 hover:bg-black/90 text-white/70 hover:text-white w-10 h-10 rounded-full flex items-center justify-center border border-white/10 transition-all duration-300 ml-4 hover:border-[#94A3B8]/50 shadow-lg hover:shadow-[#94A3B8]/20 flex-shrink-0 absolute right-0 ${
                  scrollState.isAtEnd ? 'opacity-0 pointer-events-none transform translate-x-4' : 'opacity-100 transform translate-x-0'
                }`}
                aria-label="Next project"
                disabled={scrollState.isAtEnd || isAnimating}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
              </div>
          </div>
          
          {/* Journey narrative - keeping the improved journey section but with original styling */}
          <div className="max-w-3xl mx-auto mt-16 bg-black/30 backdrop-blur-sm p-6 border border-white/10 rounded-lg">
            <p className="text-white/80 leading-relaxed mb-4">
              My development journey began with simple frontend projects as I learned the fundamentals of web development. 
              Starting with React and Vue.js applications, I built a foundation in modern JavaScript frameworks and UI design.
            </p>
            <p className="text-white/80 leading-relaxed mb-4">
              As I progressed, I expanded into full-stack development, working with databases and server-side technologies. 
              This exploration phase allowed me to create more complex applications with authentication and data persistence.
            </p>
            <p className="text-white/80 leading-relaxed">
              Most recently, I've been combining my software engineering skills with my interests in AI and IoT, 
              creating integrated systems that leverage multiple technologies to solve real-world problems.
            </p>
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

      {/* Contact Section - Redesigned */}
      <section className="py-32 bg-black/30 relative z-10 overflow-hidden">
        {/* Only PNG gradient and black background - moved down slightly */}
        <div 
          className="absolute inset-x-0 top-[-50px] h-[300px] z-[5]" 
          style={{ 
            backgroundImage: 'url("/images/gradient-fade.png")',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        
        {/* Black background below the gradient - adjusted to match new gradient position */}
        <div className="absolute inset-x-0 top-[250px] bottom-0 bg-black z-[5]"></div>
        
        {/* Grid pattern on top of everything */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5 z-[6]"></div>
        
        <div className="container mx-auto px-4 relative z-[10]">
          <div className="max-w-4xl mx-auto">
            {/* Section heading */}
            <div className="text-center mb-16" style={parallaxStyle(0.04)}>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#94A3B8] to-white">
                Let's Connect
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#9B59B6] to-[#94A3B8] mx-auto mb-8"></div>
              <p className="text-xl max-w-2xl mx-auto text-white/70">
                I'm always open to discussing new opportunities, ideas, or just having a conversation about technology.
              </p>
            </div>
            
            {/* Contact card - centered and expanded */}
            <div 
              className="bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-10 shadow-xl transform hover:-translate-y-1 transition-all duration-300 max-w-3xl mx-auto"
              style={parallaxStyle(0.03)}
            >
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 rounded-full bg-[#94A3B8]/20 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#94A3B8]">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <h3 className="text-3xl font-bold">Get In Touch</h3>
              </div>
              
              <p className="text-white/70 mb-10 text-center max-w-2xl mx-auto">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. 
                Feel free to reach out through any of the channels below.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#9B59B6]">
                      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium mb-1 text-lg">Email</div>
                    <a href="mailto:ali.zargari1@outlook.com" className="text-[#94A3B8] hover:text-white transition-colors">
                      ali.zargari1@outlook.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#9B59B6]">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium mb-1 text-lg">LinkedIn</div>
                    <a href="https://linkedin.com/in/zargari-ali" target="_blank" rel="noopener noreferrer" className="text-[#94A3B8] hover:text-white transition-colors">
                      linkedin.com/in/zargari-ali
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#9B59B6]">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium mb-1 text-lg">GitHub</div>
                    <a href="https://github.com/ali-zargari" target="_blank" rel="noopener noreferrer" className="text-[#94A3B8] hover:text-white transition-colors">
                      github.com/alizargari
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#9B59B6]">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium mb-1 text-lg">Location</div>
                    <span className="text-[#94A3B8]">
                      San Jose, California
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={() => setShowContactModal(true)} 
                  className="inline-flex items-center bg-gradient-to-r from-[#94A3B8] to-[#9B59B6] text-white px-10 py-4 rounded-lg font-medium hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#9B59B6]/20 text-lg"
                >
                  <span>Send Me a Message</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-3">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Cost component */}
      <TheCost />

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            className="bg-[#121212] border border-white/10 rounded-lg max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <h3 className="text-2xl font-bold mb-4">Send a Message</h3>
            
            {submitSuccess ? (
              <div className="bg-[#9B59B6]/20 border border-[#9B59B6]/50 rounded-lg p-4 text-center my-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 text-[#9B59B6]">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <p className="text-white">Your message has been sent successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                {submitError && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-white text-sm">
                    <p>{submitError}</p>
                  </div>
                )}
                
                <div>
                  <label htmlFor="modal-name" className="block text-sm font-medium text-white/80 mb-1">Name</label>
                  <input
                    type="text"
                    id="modal-name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent transition-all"
                    placeholder="Your name"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label htmlFor="modal-email" className="block text-sm font-medium text-white/80 mb-1">Email</label>
                  <input
                    type="email"
                    id="modal-email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent transition-all"
                    placeholder="Your email address"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label htmlFor="modal-message" className="block text-sm font-medium text-white/80 mb-1">Message</label>
                  <textarea
                    id="modal-message"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    required
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent transition-all"
                    placeholder="Your message"
                    disabled={isSubmitting}
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className={`w-full bg-[#9B59B6] hover:bg-[#8E44AD] text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
