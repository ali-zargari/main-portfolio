'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import GlitchText from '@/components/GlitchText';
import SubliminalMessages from '@/components/SubliminalMessages';
import EasterEgg from '@/components/EasterEgg';
import TheCost from '@/components/TheCost';

// Real project data
const projects = [
  {
    id: 'olympus',
    title: 'OLYMPUS',
    description: 'AI-powered smart home system with IoT integration. A comprehensive solution that combines machine learning algorithms with connected devices to create an intelligent living environment.',
    tags: ['AI', 'IoT', 'Machine Learning', 'Smart Home'],
    image: '/olympus.jpg',
    status: 'ACTIVE',
    year: '2023',
    color: '#00FFFF'
  },
  {
    id: 'socialsync',
    title: 'SOCIALSYNC',
    description: 'AI-powered assistive tool for ASD therapy. Leverages computer vision and machine learning to help individuals with Autism Spectrum Disorder improve social interaction skills.',
    tags: ['AI', 'Computer Vision', 'Assistive Technology', 'Healthcare'],
    image: '/socialsync.jpg',
    status: 'COMPLETE',
    year: '2022',
    color: '#9B59B6'
  },
  {
    id: 'memento',
    title: 'MEMENTO',
    description: 'IoT solution for memory impairment assistance. A network of connected devices and sensors that provide contextual reminders and assistance for individuals with memory impairments.',
    tags: ['IoT', 'Assistive Technology', 'Healthcare', 'Embedded Systems'],
    image: '/memento.jpg',
    status: 'ACTIVE',
    year: '2022',
    color: '#FFFFFF'
  },
  {
    id: 'nexus',
    title: 'NEXUS',
    description: 'A distributed system for real-time data processing and analysis, capable of handling millions of events per second with sub-millisecond latency.',
    tags: ['Distributed Systems', 'Real-time Processing', 'Scalability'],
    image: '/nexus.jpg',
    status: 'OPERATIONAL',
    year: '2021',
    color: '#00FFFF'
  }
];

// Project-specific details
const projectDetails = {
  olympus: {
    fullDescription: "OLYMPUS is an AI-powered smart home system that integrates various IoT devices to create a seamless, intelligent living environment. The system learns from user behavior patterns and environmental data to optimize comfort, energy efficiency, and security.",
    challenges: "Developing a unified protocol for diverse IoT devices while ensuring data privacy and system security presented significant challenges. The system needed to be both powerful and user-friendly.",
    technologies: ["TensorFlow", "Python", "MQTT", "React", "Node.js", "MongoDB", "Raspberry Pi", "Arduino"],
    achievements: ["Reduced energy consumption by 30%", "Improved home security response time by 45%", "Seamless integration with 50+ IoT device types"]
  },
  socialsync: {
    fullDescription: "SocialSync is an assistive technology designed to help individuals with Autism Spectrum Disorder improve social interaction skills. Using computer vision and machine learning, it analyzes facial expressions and social cues in real-time, providing gentle feedback through a discreet wearable device.",
    challenges: "Creating algorithms sensitive enough to detect subtle social cues while being robust against false positives was particularly challenging. The system needed to be non-intrusive and comfortable for daily use.",
    technologies: ["OpenCV", "TensorFlow", "Python", "Flutter", "Firebase", "Wearable Tech", "Edge Computing"],
    achievements: ["Improved social interaction metrics by 40% in clinical trials", "Successfully deployed in 5 therapy centers", "Featured in Journal of Assistive Technologies"]
  },
  memento: {
    fullDescription: "Memento is an IoT ecosystem designed to assist individuals with memory impairments. It combines environmental sensors, wearable devices, and strategically placed displays to provide contextual reminders and assistance based on the user's location and routine.",
    challenges: "Balancing the need for constant monitoring with privacy concerns was a major challenge. The system needed to be reliable enough for healthcare applications while remaining affordable.",
    technologies: ["IoT Sensors", "BLE Beacons", "React Native", "Node.js", "MongoDB", "AWS IoT", "Edge AI"],
    achievements: ["Reduced missed medication instances by 85%", "Improved independent living metrics by 60%", "Deployed in 3 assisted living facilities"]
  },
  nexus: {
    fullDescription: "NEXUS is a distributed system for real-time data processing and analysis, capable of handling millions of events per second with sub-millisecond latency. It provides a scalable infrastructure for applications requiring immediate insights from high-volume data streams.",
    challenges: "Achieving consistent sub-millisecond performance at scale required innovative approaches to distributed computing. Ensuring fault tolerance without compromising speed was particularly challenging.",
    technologies: ["Kafka", "Rust", "gRPC", "Kubernetes", "Prometheus", "ClickHouse", "Redis", "NATS"],
    achievements: ["Processes 5M+ events per second", "99.999% uptime over 12 months", "70% reduction in infrastructure costs compared to previous solution"]
  }
};

export default function QuantumInitiatives() {
  const [loaded, setLoaded] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 300);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProjectClick = (id: string) => {
    setSelectedProject(id);
    
    // Scroll to project details if on mobile
    if (window.innerWidth < 768 && projectsRef.current) {
      const yOffset = -100; 
      const element = projectsRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  };

  const parallaxStyle = (factor: number) => {
    return {
      transform: `translateY(${scrollY * factor}px)`,
    };
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Components that appear on all pages */}
      <SubliminalMessages />
      <EasterEgg />
      <Navigation />
      <TheCost />

      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/70 z-10"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern.png')] bg-repeat opacity-30 z-0"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className={`text-center transition-all duration-1000 transform ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <GlitchText 
              text="QUANTUM INITIATIVES" 
              tag="h1" 
              className="text-4xl sm:text-6xl font-bold mb-6"
              glitchIntensity={0.3}
            />
            <div className="w-20 h-1 bg-[#9B59B6] mx-auto mb-8"></div>
            <p className="text-lg max-w-2xl mx-auto text-white/70">
              Advanced systems that integrate cutting-edge technologies to solve complex problems.
              Each project represents a fusion of innovation and practical application.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {projects.map((project) => (
              <div 
                key={project.id}
                className={`group relative cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                  selectedProject === project.id ? 'scale-[1.02]' : ''
                }`}
                onClick={() => handleProjectClick(project.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 group-hover:opacity-80 transition-opacity z-10 ${
                  selectedProject === project.id ? 'opacity-70' : 'opacity-100'
                }`}></div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-80 z-0"></div>
                
                <div className={`absolute bottom-0 left-0 w-full h-1 z-20`} 
                     style={{backgroundColor: project.color, opacity: selectedProject === project.id ? 0.8 : 0.4}}></div>
                
                <div className="relative z-20 p-8">
                  <div className="flex items-center mb-4">
                    <div className={`w-2 h-2 rounded-full mr-2`} style={{backgroundColor: project.color}}></div>
                    <span className="text-xs font-mono opacity-70">{project.status} • {project.year}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3" style={{color: project.color}}>{project.title}</h3>
                  
                  <p className="text-sm text-white/70 mb-6 max-w-md">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-black/50 backdrop-blur-sm px-2 py-1 rounded-sm font-mono border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className={`inline-flex items-center text-xs font-mono transition-all duration-300 ${
                    selectedProject === project.id ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                  }`} style={{color: project.color}}>
                    VIEW DETAILS
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Project Details Section */}
          <div ref={projectsRef} className={`transition-all duration-500 ${selectedProject ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {selectedProject && (() => {
              const project = projects.find(p => p.id === selectedProject);
              if (!project) return null;
              
              const details = projectDetails[project.id as keyof typeof projectDetails];
              
              return (
                <div className="bg-black/50 backdrop-blur-md border border-white/10 p-8 rounded-lg">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-white/10">
                    <div>
                      <h2 className="text-3xl font-bold mb-2" style={{color: project.color}}>{project.title}</h2>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2`} style={{backgroundColor: project.color}}></div>
                        <span className="text-xs font-mono opacity-70">{project.status} • {project.year}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedProject(null)}
                      className="mt-4 md:mt-0 text-white/50 hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                      <div className="mb-8">
                        <h3 className="text-lg font-mono mb-4" style={{color: project.color}}>OVERVIEW</h3>
                        <p className="text-white/80 leading-relaxed">{details.fullDescription}</p>
                      </div>
                      
                      <div className="mb-8">
                        <h3 className="text-lg font-mono mb-4" style={{color: project.color}}>CHALLENGES</h3>
                        <p className="text-white/80 leading-relaxed">{details.challenges}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-mono mb-4" style={{color: project.color}}>ACHIEVEMENTS</h3>
                        <ul className="space-y-3">
                          {details.achievements.map((achievement, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-400 mr-2">✓</span>
                              <span className="text-white/80">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <div className="mb-8">
                        <h3 className="text-lg font-mono mb-4" style={{color: project.color}}>TECHNOLOGIES</h3>
                        <div className="flex flex-wrap gap-3">
                          {details.technologies.map((tech, index) => (
                            <span 
                              key={index} 
                              className="px-3 py-2 bg-black/70 text-white/90 rounded border border-white/10 text-sm hover:border-white/30 transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-black/70 border border-white/10 p-6 rounded-lg">
                        <h3 className="text-lg font-mono mb-4" style={{color: project.color}}>INTERESTED?</h3>
                        <p className="text-white/80 mb-6">
                          Want to learn more about this project or discuss how similar solutions could benefit your organization?
                        </p>
                        <Link 
                          href={`/contact?project=${project.id}`}
                          className="inline-block px-6 py-3 font-mono transition-all duration-300 text-black"
                          style={{backgroundColor: project.color}}
                        >
                          REQUEST INFORMATION
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>
    </main>
  );
} 