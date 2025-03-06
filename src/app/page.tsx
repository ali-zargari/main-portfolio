'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import dynamic from 'next/dynamic';
import SubliminalMessages from '@/components/SubliminalMessages';
import EasterEgg from '@/components/EasterEgg';
import TheCost from '@/components/TheCost';
import GlitchText from '@/components/GlitchText';
import WarningModal from '@/components/WarningModal';
import { projects } from '@/data/projects';

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
    setLoaded(true);

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

  // Smaller projects data
  const smallerProjects = [
    {
      title: "Weather Dashboard",
      description: "My first React project - a weather app that taught me API integration and state management.",
      image: "https://via.placeholder.com/600x400/111111/00FFFF?text=Weather+Dashboard",
      link: "https://github.com/ali-zargari/weather-dashboard",
      technologies: ["React", "OpenWeatherAPI", "CSS"],
      year: "2021",
      milestone: "First steps with modern frontend frameworks"
    },
    {
      title: "Task Tracker",
      description: "Exploring a different framework with Vue.js while learning about local storage and UI design principles.",
      image: "https://via.placeholder.com/600x400/111111/9B59B6?text=Task+Tracker",
      link: "https://github.com/ali-zargari/task-tracker",
      technologies: ["Vue.js", "LocalStorage", "Tailwind CSS"],
      year: "2021",
      milestone: "Expanding my frontend toolkit"
    },
    {
      title: "Code Snippet Library",
      description: "My first full-stack application with a database, authentication, and server-side rendering.",
      image: "https://via.placeholder.com/600x400/111111/00FFFF?text=Code+Snippets",
      link: "https://github.com/ali-zargari/code-snippets",
      technologies: ["Next.js", "MongoDB", "Prism.js"],
      year: "2022",
      milestone: "Diving into backend development"
    },
    {
      title: "Budget Calculator",
      description: "Applied data visualization techniques to create an interactive financial planning tool.",
      image: "https://via.placeholder.com/600x400/111111/9B59B6?text=Budget+Calculator",
      link: "https://github.com/ali-zargari/budget-calculator",
      technologies: ["React", "Chart.js", "LocalStorage"],
      year: "2022",
      milestone: "Learning data visualization"
    },
    {
      title: "Neural Network Visualizer",
      description: "Combined my growing interest in AI with interactive visualizations to help understand neural networks.",
      image: "https://via.placeholder.com/600x400/111111/00FFFF?text=Neural+Network+Visualizer",
      link: "https://github.com/ali-zargari/neural-net-viz",
      technologies: ["TypeScript", "D3.js", "TensorFlow.js"],
      year: "2023",
      milestone: "Merging AI with web technologies"
    },
    {
      title: "IoT Data Monitor",
      description: "Real-time dashboard for IoT devices, representing my shift toward integrated systems development.",
      image: "https://via.placeholder.com/600x400/111111/9B59B6?text=IoT+Monitor",
      link: "https://github.com/ali-zargari/iot-monitor",
      technologies: ["React", "WebSockets", "MQTT", "Node.js"],
      year: "2023",
      milestone: "Building connected systems"
    }
  ];

  // Development Journey Timeline - Horizontal
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeYear, setActiveYear] = useState('2021');
  
  const scrollToYear = (year: string) => {
    if (!timelineRef.current) return;
    
    const yearIndex = smallerProjects.findIndex(project => project.year === year);
    if (yearIndex === -1) return;
    
    const cardWidth = 320; // width + margin
    const scrollPosition = yearIndex * cardWidth;
    
    timelineRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    
    setActiveYear(year);
  };
  
  const scrollTimeline = (direction: 'left' | 'right') => {
    if (!timelineRef.current) return;
    
    const scrollAmount = 320; // One card width
    const newScrollPosition = timelineRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    timelineRef.current.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });
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
      <section className="py-24 relative z-10">
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
            {projects.slice(0, 3).map((project, index) => (
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
                    {project.tags.slice(0, 3).map((tech, techIndex) => (
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

      {/* Development Journey Timeline - Horizontal */}
      <section className="py-20 bg-black/30 relative z-10">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-6">ADDITIONAL PROJECTS</h2>
            <div className="w-20 h-1 bg-[#9B59B6] mx-auto mb-8"></div>
            <p className="text-lg max-w-2xl mx-auto text-white/70 mb-12" style={parallaxStyle(0.03)}>
              A collection of focused development projects that demonstrate my technical versatility and showcase my skills across various platforms and technologies.
            </p>
          </div>

          {/* Simple horizontal scrolling container with navigation buttons */}
          <div className="relative flex items-center mx-auto max-w-full px-4 md:px-8 lg:px-12">
            {/* Left scroll button */}
            <button 
              onClick={() => scrollTimeline('left')}
              className="z-20 bg-black/70 hover:bg-black/90 text-white/70 hover:text-white w-10 h-10 rounded-full flex items-center justify-center border border-white/10 transition-colors duration-300 mr-4 hover:border-[#94A3B8]/50 shadow-lg hover:shadow-[#94A3B8]/20 flex-shrink-0"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
              
            {/* Scrollable container */}
            <div 
              ref={timelineRef}
              className="overflow-x-auto pb-8 hide-scrollbar flex-grow mx-2"
            >
              <div className="flex space-x-8 min-w-max px-8 py-4">
                {smallerProjects.map((project, index) => (
                  <div 
                    key={index} 
                    className="w-72 flex-shrink-0 relative rounded-xl overflow-hidden transition-all duration-300 group shadow-xl hover:shadow-[#94A3B8]/20"
                  >
                    {/* Solid background */}
                    <div className="absolute inset-0 bg-[#111] backdrop-blur-sm"></div>
                    
                    {/* Simple border */}
                    <div className="absolute inset-0 rounded-xl border border-white/10 group-hover:border-[#94A3B8]/30 transition-colors duration-300 pointer-events-none"></div>
                    
                    {/* Project image */}
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block relative h-48 overflow-hidden rounded-t-xl"
                    >
                      {/* Solid overlay instead of gradient */}
                      <div className="absolute inset-0 bg-black/50 z-10"></div>
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
                      <div className="absolute bottom-0 left-0 p-4 z-20 w-full">
                        <h3 className="text-lg font-bold text-white group-hover:text-[#94A3B8] transition-colors duration-300">{project.title}</h3>
                      </div>
                    </a>
                    
                    {/* Project details */}
                    <div className="p-5 space-y-3 relative z-10">
                      <div className="inline-block px-3 py-1 bg-black border border-[#9B59B6]/30 rounded-full text-[#9B59B6] text-xs font-mono">
                        {project.milestone}
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed">{project.description}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span 
                            key={techIndex} 
                            className="px-2 py-1 bg-black text-xs font-mono rounded-full border border-white/10 text-white/80"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <a 
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-2 px-4 py-1.5 bg-black border border-[#94A3B8]/40 text-[#94A3B8] text-xs font-mono hover:bg-[#94A3B8]/10 transition-all duration-300 rounded-full group-hover:border-[#94A3B8]/60"
                      >
                        View Project
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right scroll button */}
            <button 
              onClick={() => scrollTimeline('right')}
              className="z-20 bg-black/70 hover:bg-black/90 text-white/70 hover:text-white w-10 h-10 rounded-full flex items-center justify-center border border-white/10 transition-colors duration-300 ml-4 hover:border-[#94A3B8]/50 shadow-lg hover:shadow-[#94A3B8]/20 flex-shrink-0"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          
          {/* Journey narrative */}
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
              className="border border-[#94A3B8] text-[#94A3B8] px-8 py-4 font-mono hover:bg-[#94A3B8] hover:bg-opacity-10 transition-all duration-300"
            >
              CONTACT ME
            </Link>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">CONTACT</h2>
          <div className="w-20 h-1 bg-[#9B59B6] mx-auto mb-8"></div>
          <p className="text-lg max-w-2xl mx-auto text-white/70 mb-12">
            Interested in discussing my projects or exploring potential collaboration opportunities? I welcome inquiries about my work and technical expertise.
          </p>
          <Link 
            href="/contact" 
            className="border border-[#94A3B8] text-[#94A3B8] px-8 py-4 font-mono hover:bg-[#94A3B8] hover:bg-opacity-10 transition-all duration-300"
          >
            CONTACT ME
          </Link>
        </div>
      </section>

      {/* The Cost component */}
      <TheCost />
    </main>
  );
}
