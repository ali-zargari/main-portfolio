'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import GlitchText from '@/components/GlitchText';
import SubliminalMessages from '@/components/SubliminalMessages';
import EasterEgg from '@/components/EasterEgg';
import TheCost from '@/components/TheCost';

// Sample project data
const projects = [
  {
    id: 'project-1',
    title: 'NEXUS',
    description: 'A distributed system for real-time data processing and analysis, capable of handling millions of events per second with sub-millisecond latency.',
    tags: ['Distributed Systems', 'Real-time Processing', 'Scalability'],
    image: '/project1.jpg',
    status: 'OPERATIONAL',
    year: '2022'
  },
  {
    id: 'project-2',
    title: 'SENTINEL',
    description: 'An autonomous monitoring and self-healing infrastructure that detects anomalies and automatically mitigates potential failures before they cascade.',
    tags: ['Autonomous Systems', 'Machine Learning', 'Resilience'],
    image: '/project2.jpg',
    status: 'CLASSIFIED',
    year: '2021'
  },
  {
    id: 'project-3',
    title: 'ECHO',
    description: 'A communication protocol designed for high-reliability messaging in unstable network environments, ensuring message delivery even under extreme conditions.',
    tags: ['Networking', 'Protocols', 'Reliability'],
    image: '/project3.jpg',
    status: 'ACTIVE',
    year: '2020'
  },
  {
    id: 'project-4',
    title: 'CHRONOS',
    description: 'Time-series database optimized for ultra-fast writes and complex analytical queries, with built-in anomaly detection and predictive capabilities.',
    tags: ['Databases', 'Time-series', 'Analytics'],
    image: '/project4.jpg',
    status: 'EVOLVING',
    year: '2019'
  }
];

export default function ClassifiedOperations() {
  const [loaded, setLoaded] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 300);
  }, []);

  const handleProjectClick = (id: string) => {
    setIsDecrypting(true);
    setSelectedProject(null);
    
    // Simulate decryption process
    setTimeout(() => {
      setIsDecrypting(false);
      setSelectedProject(id);
    }, 1500);
  };

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
              text="CLASSIFIED OPERATIONS" 
              tag="h1" 
              className="text-4xl sm:text-5xl font-bold mb-6"
              glitchIntensity={0.3}
            />
            <div className="w-20 h-1 bg-accent mb-8"></div>
            <p className="text-lg max-w-3xl">
              The following systems represent the culmination of years of research, development, and 
              real-world implementation. Each one solves a specific problem at scale.
            </p>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div 
                key={project.id}
                className={`relative cursor-pointer group ${selectedProject === project.id ? 'ring-2 ring-accent' : ''}`}
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="absolute -inset-1 border border-[#333] z-0 group-hover:border-accent transition-colors duration-300"></div>
                <div className="relative z-10 bg-[#111] p-6 h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="terminal-text text-xs mb-1">OPERATION://{project.id}</div>
                      <h3 className="text-2xl font-bold mb-1">{project.title}</h3>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        project.status === 'OPERATIONAL' ? 'bg-terminal-green' :
                        project.status === 'ACTIVE' ? 'bg-system-blue' :
                        project.status === 'EVOLVING' ? 'bg-accent' : 'bg-warning-red'
                      }`}></span>
                      <span className="text-xs font-mono">{project.status}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm opacity-80 mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-[#222] px-2 py-1 rounded font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono opacity-60">INITIATED: {project.year}</span>
                    <span className="text-xs font-mono text-accent">VIEW DETAILS →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Project Detail Modal */}
          {(selectedProject || isDecrypting) && (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
              <div className="bg-[#111] border border-[#333] p-6 max-w-4xl w-full relative">
                {isDecrypting ? (
                  <div className="py-12 text-center">
                    <div className="terminal-text text-sm mb-4 flicker">DECRYPTING CLASSIFIED INFORMATION</div>
                    <div className="w-full bg-[#222] h-2 mb-4">
                      <div 
                        className="bg-terminal-green h-full transition-all duration-1500"
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                    <div className="terminal-text text-xs">AUTHORIZATION REQUIRED</div>
                  </div>
                ) : selectedProject && (
                  <>
                    <button 
                      onClick={() => setSelectedProject(null)}
                      className="absolute top-4 right-4 text-foreground"
                      aria-label="Close details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                    
                    {/* Project details */}
                    <div>
                      {/* Find the selected project */}
                      {(() => {
                        const project = projects.find(p => p.id === selectedProject);
                        if (!project) return null;
                        
                        return (
                          <>
                            <div className="mb-6">
                              <div className="terminal-text text-xs mb-1">OPERATION://{project.id}/details</div>
                              <h3 className="text-3xl font-bold mb-2">{project.title}</h3>
                              <div className="flex items-center">
                                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                  project.status === 'OPERATIONAL' ? 'bg-terminal-green' :
                                  project.status === 'ACTIVE' ? 'bg-system-blue' :
                                  project.status === 'EVOLVING' ? 'bg-accent' : 'bg-warning-red'
                                }`}></span>
                                <span className="text-xs font-mono">{project.status}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                              <div>
                                <p className="text-lg mb-4">{project.description}</p>
                                <p className="mb-4">
                                  This system represents a significant advancement in {project.tags[0].toLowerCase()} 
                                  technology, pushing the boundaries of what's possible in terms of 
                                  {project.tags[1].toLowerCase()} and {project.tags[2].toLowerCase()}.
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {project.tags.map((tag, index) => (
                                    <span 
                                      key={index} 
                                      className="text-xs bg-[#222] px-2 py-1 rounded font-mono"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="relative">
                                <div className="absolute -inset-1 border border-[#333] z-0"></div>
                                <div className="relative z-10 bg-[#0a0a0a] p-4 h-full">
                                  <div className="terminal-text text-xs mb-4">SYSTEM://metrics/{project.id}.log</div>
                                  <div className="space-y-4">
                                    <div>
                                      <div className="flex justify-between text-sm mb-1">
                                        <span className="font-mono">Reliability</span>
                                        <span className="font-mono text-terminal-green">99.99%</span>
                                      </div>
                                      <div className="w-full bg-[#222] h-2">
                                        <div className="bg-terminal-green h-full" style={{ width: '99.99%' }}></div>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="flex justify-between text-sm mb-1">
                                        <span className="font-mono">Scalability</span>
                                        <span className="font-mono text-system-blue">92.5%</span>
                                      </div>
                                      <div className="w-full bg-[#222] h-2">
                                        <div className="bg-system-blue h-full" style={{ width: '92.5%' }}></div>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="flex justify-between text-sm mb-1">
                                        <span className="font-mono">Innovation Factor</span>
                                        <span className="font-mono text-accent">88.7%</span>
                                      </div>
                                      <div className="w-full bg-[#222] h-2">
                                        <div className="bg-accent h-full" style={{ width: '88.7%' }}></div>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="flex justify-between text-sm mb-1">
                                        <span className="font-mono">Development Effort</span>
                                        <span className="font-mono text-warning-red">95.2%</span>
                                      </div>
                                      <div className="w-full bg-[#222] h-2">
                                        <div className="bg-warning-red h-full" style={{ width: '95.2%' }}></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-8">
                              <span className="text-xs font-mono opacity-60">INITIATED: {project.year}</span>
                              <Link 
                                href={`/contact?project=${project.id}`}
                                className="bg-accent text-background px-4 py-2 font-mono hover:bg-opacity-80 transition-all duration-300"
                              >
                                REQUEST ACCESS
                              </Link>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 