'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import GlitchText from '@/components/GlitchText';
import SubliminalMessages from '@/components/SubliminalMessages';
import EasterEgg from '@/components/EasterEgg';
import TheCost from '@/components/TheCost';

export default function ProfessionalJourney() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 300);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden pt-20">
      {/* Components that appear on all pages */}
      <SubliminalMessages />
      <EasterEgg />
      <Navigation />
      <TheCost />

      <div className="container mx-auto px-4 py-12">
        <div className={`transition-all duration-1000 transform ${
          loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="mb-12">
            <GlitchText 
              text="PROFESSIONAL JOURNEY" 
              tag="h1" 
              className="text-4xl sm:text-5xl font-bold mb-6"
              glitchIntensity={0.3}
            />
            <div className="w-20 h-1 bg-accent mb-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-6">
              <div className="relative">
                <div className="absolute -inset-1 border border-[#333] z-0"></div>
                <div className="relative z-10 bg-[#111] p-6">
                  <div className="terminal-text text-xs mb-4">SYSTEM://personal_logs/development_path.txt</div>
                  <div className="space-y-6 text-lg">
                    <p>
                      My journey into advanced system development began with a strong foundation in both theoretical principles and hands-on implementation.
                    </p>
                    <p>
                      Throughout my career, I've focused on building systems that solve real-world problems through innovative technical approaches. 
                      I've consistently pushed the boundaries of what's possible by integrating cutting-edge technologies into cohesive, functional solutions.
                    </p>
                    <p>
                      My technical interests evolved from fundamental programming to specialized work in intelligent systems, 
                      distributed computing, and the integration of multiple technological domains to create comprehensive solutions.
                    </p>
                    <p>
                      I've developed projects ranging from sophisticated AI applications to novel approaches in system architecture, 
                      always with an emphasis on practical implementation and measurable results.
                    </p>
                    <p>
                      This portfolio represents years dedicated to <span className="font-bold flicker">building advanced systems that solve complex problems</span> across various domains.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative mt-12">
                <div className="absolute -inset-1 border border-[#333] z-0"></div>
                <div className="relative z-10 bg-[#111] p-6">
                  <div className="terminal-text text-xs mb-4">SYSTEM://development_philosophy.md</div>
                  <div className="space-y-6">
                    <p className="text-xl font-bold text-accent">Development Principles</p>
                    <ul className="space-y-4 list-disc pl-5">
                      <li>Elegant solutions to complex problems</li>
                      <li>Performance optimization at scale</li>
                      <li>Interdisciplinary approaches to technical challenges</li>
                      <li>User-centered design in system architecture</li>
                      <li>Continuous improvement and iteration</li>
                    </ul>
                    <p className="text-sm opacity-70 italic mt-6">
                      "The most valuable systems are those that solve complex problems with elegant simplicity."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="relative">
                <div className="absolute -inset-1 border border-[#333] z-0"></div>
                <div className="relative z-10 bg-[#111] p-6">
                  <div className="terminal-text text-xs mb-4">SYSTEM://career_timeline.json</div>
                  <div className="space-y-6">
                    <div className="border-l-2 border-accent pl-4 py-2">
                      <div className="text-accent font-mono text-sm">2010</div>
                      <div className="font-bold">Early Development</div>
                      <div className="text-sm text-white/70">First major projects in systems architecture and algorithm implementation.</div>
                    </div>
                    <div className="border-l-2 border-accent pl-4 py-2">
                      <div className="text-accent font-mono text-sm">2014</div>
                      <div className="font-bold">Technical Advancement</div>
                      <div className="text-sm text-white/70">Expanded expertise in distributed systems and machine learning applications.</div>
                    </div>
                    <div className="border-l-2 border-accent pl-4 py-2">
                      <div className="text-accent font-mono text-sm">2017</div>
                      <div className="font-bold">System Architecture</div>
                      <div className="text-sm text-white/70">Developed novel approaches to distributed system coordination and implementation.</div>
                    </div>
                    <div className="border-l-2 border-accent pl-4 py-2">
                      <div className="text-accent font-mono text-sm">2020</div>
                      <div className="font-bold">AI Integration</div>
                      <div className="text-sm text-white/70">Focused on integrating artificial intelligence into practical system applications.</div>
                    </div>
                    <div className="border-l-2 border-accent pl-4 py-2">
                      <div className="text-accent font-mono text-sm">2023</div>
                      <div className="font-bold">Advanced Systems</div>
                      <div className="text-sm text-white/70">Developing comprehensive solutions that integrate multiple technological domains.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-1 border border-[#333] z-0"></div>
                <div className="relative z-10 bg-[#111] p-6">
                  <div className="terminal-text text-xs mb-4">SYSTEM://technical_expertise.json</div>
                  <div className="space-y-4">
                    <p className="text-xl font-bold text-accent">Technical Domains</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-black text-xs font-mono rounded border border-white/20 text-white/80">Distributed Systems</span>
                      <span className="px-2 py-1 bg-black text-xs font-mono rounded border border-white/20 text-white/80">Machine Learning</span>
                      <span className="px-2 py-1 bg-black text-xs font-mono rounded border border-white/20 text-white/80">Computer Vision</span>
                      <span className="px-2 py-1 bg-black text-xs font-mono rounded border border-white/20 text-white/80">IoT Architecture</span>
                      <span className="px-2 py-1 bg-black text-xs font-mono rounded border border-white/20 text-white/80">System Design</span>
                      <span className="px-2 py-1 bg-black text-xs font-mono rounded border border-white/20 text-white/80">Performance Optimization</span>
                      <span className="px-2 py-1 bg-black text-xs font-mono rounded border border-white/20 text-white/80">Fault Tolerance</span>
                      <span className="px-2 py-1 bg-black text-xs font-mono rounded border border-white/20 text-white/80">Real-time Processing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 