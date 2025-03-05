'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WarningModal from '@/components/WarningModal';
import SubliminalMessages from '@/components/SubliminalMessages';
import EasterEgg from '@/components/EasterEgg';
import Navigation from '@/components/Navigation';
import TheCost from '@/components/TheCost';
import dynamic from 'next/dynamic';

const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), { ssr: false });


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
