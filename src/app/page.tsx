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

    // Title rotation
    const titleInterval = setInterval(() => {
      setCurrentTitle(prev => (prev + 1) % titles.length);
    }, 3000);

    return () => clearInterval(titleInterval);
  }, []);

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
        {/* Main title */}
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

        {/* CTA buttons */}
        <div 
          className="flex flex-col sm:flex-row gap-4"
          style={fadeInButtons}
        >
          <Link 
            href="/classified-operations" 
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

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-50 hover:opacity-100 transition-opacity duration-300"
          style={fadeInButtons}
        >
          <span className="text-xs font-mono mb-2">SCROLL</span>
          <div className="w-5 h-10 border border-white rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Brief introduction section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">
              MY WORK
            </h2>
            <div className="w-20 h-1 bg-[#00FFFF] mb-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                I build systems that <span className="text-[#00FFFF]">integrate</span> AI, IoT, and computer vision technologies to create <span className="text-[#00FFFF]">intelligent</span> solutions.
              </p>
              <p className="text-lg leading-relaxed">
                My work includes projects like Olympus, an AI-powered smart home system, 
                and Memento, an IoT solution for individuals with memory impairment.
              </p>
              <p className="text-lg leading-relaxed">
                With expertise in Python, TensorFlow, OpenCV, and embedded systems, I create technology that makes a difference.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 border border-[#333] z-0"></div>
              <div className="absolute -inset-2 border border-[#444] z-0"></div>
              <div className="relative z-10 bg-[#111] p-6 h-full backdrop-blur-sm bg-opacity-80">
                <div className="text-[#00FFFF] text-xs mb-4 font-mono">PROJECTS</div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-mono">Olympus</span>
                      <span className="font-mono text-[#00FFFF]">Active</span>
                    </div>
                    <div className="w-full bg-[#222] h-2">
                      <div className="bg-[#00FFFF] h-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-mono">SocialSync</span>
                      <span className="font-mono text-[#9B59B6]">Complete</span>
                    </div>
                    <div className="w-full bg-[#222] h-2">
                      <div className="bg-[#9B59B6] h-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-mono">Memento</span>
                      <span className="font-mono text-white">Active</span>
                    </div>
                    <div className="w-full bg-[#222] h-2">
                      <div className="bg-white h-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-mono">Localization System</span>
                      <span className="font-mono text-red-500">Active</span>
                    </div>
                    <div className="w-full bg-[#222] h-2">
                      <div className="bg-red-500 h-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA section */}
      <section className="min-h-[50vh] flex flex-col justify-center items-center px-4 py-20 relative z-10 bg-gradient-to-b from-transparent to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold mb-8 tracking-tight">
            EXPLORE MY WORK
          </h2>
          <p className="text-lg mb-12 max-w-2xl mx-auto">
            Discover my projects in AI, IoT, and software engineering. From smart home systems to assistive technologies.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/classified-operations" 
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
