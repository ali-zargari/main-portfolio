'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import SubliminalMessages from '@/components/SubliminalMessages';
import EasterEgg from '@/components/EasterEgg';
import Navigation from '@/components/Navigation';
import TheCost from '@/components/TheCost';
import GlitchText from '@/components/GlitchText';
import { projects, projectDetails } from '@/data/projects';

// Define types for project and project details
interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  status: string;
  year: string;
  color: string;
}

interface ProjectDetail {
  fullDescription: string;
  challenges: string;
  technologies: string[];
  achievements: string[];
}

export default function SignificantProjects() {
  const [loaded, setLoaded] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const projectsRef = useRef<HTMLDivElement>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    setSelectedProject(projects.find((p: Project) => p.id === id) || null);
    
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

  const handleRequestDetails = (project: Project) => {
    setSelectedProject(project);
    setContactMessage(`I'm interested in learning more about the ${project.title} project.`);
    setShowContactModal(true);
  };
  
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await fetch('/api/contact', {
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
        setSelectedProject(null);
      }, 3000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred while sending your message');
    } finally {
      setIsSubmitting(false);
    }
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
              text="SIGNIFICANT TECHNICAL PROJECTS" 
              tag="h1" 
              className="text-4xl sm:text-6xl font-bold mb-6"
              glitchIntensity={0.3}
            />
            <div className="w-20 h-1 bg-[#9B59B6] mx-auto mb-8"></div>
            <p className="text-lg max-w-2xl mx-auto text-white/70">
              Advanced systems developed to address complex technical challenges through innovative approaches and cutting-edge technologies.
              Each project represents a substantial development effort with significant technical complexity.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {projects.map((project: Project) => (
              <div 
                key={project.id}
                className={`group relative cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                  selectedProject === project ? 'scale-[1.02]' : ''
                }`}
                onClick={() => handleProjectClick(project.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 group-hover:opacity-80 transition-opacity z-10 ${
                  selectedProject === project ? 'opacity-70' : 'opacity-100'
                }`}></div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-80 z-0"></div>
                
                <div className={`absolute bottom-0 left-0 w-full h-1 z-20`} 
                     style={{backgroundColor: project.color, opacity: selectedProject === project ? 0.8 : 0.4}}></div>
                
                <div className="relative z-20 p-8">
                  <div className="flex items-center mb-4">
                    <div className={`w-2 h-2 rounded-full mr-2`} style={{backgroundColor: project.color}}></div>
                    <span className="text-xs font-mono opacity-70">{project.status} • {project.year}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3" style={{color: project.color}}>{project.title}</h3>
                  
                  <p className="text-sm text-white/70 mb-6 max-w-md">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag: string, index: number) => (
                      <span 
                        key={index} 
                        className="text-xs bg-black/50 backdrop-blur-sm px-2 py-1 rounded-sm font-mono border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className={`inline-flex items-center text-xs font-mono transition-all duration-300 ${
                    selectedProject === project ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                  }`} style={{color: project.color}}>
                    EXAMINE DETAILS
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
              const details = projectDetails[selectedProject.id as keyof typeof projectDetails] as ProjectDetail;
              
              return (
                <div className="bg-black/50 backdrop-blur-md border border-white/10 p-8 rounded-lg">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-white/10">
                    <div>
                      <h2 className="text-3xl font-bold mb-2" style={{color: selectedProject.color}}>{selectedProject.title}</h2>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2`} style={{backgroundColor: selectedProject.color}}></div>
                        <span className="text-xs font-mono opacity-70">{selectedProject.status} • {selectedProject.year}</span>
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
                        <h3 className="text-lg font-mono mb-4" style={{color: selectedProject.color}}>PROJECT OVERVIEW</h3>
                        <p className="text-white/80 leading-relaxed">{details.fullDescription}</p>
                      </div>
                      
                      <div className="mb-8">
                        <h3 className="text-lg font-mono mb-4" style={{color: selectedProject.color}}>TECHNICAL CHALLENGES</h3>
                        <p className="text-white/80 leading-relaxed">{details.challenges}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-mono mb-4" style={{color: selectedProject.color}}>KEY ACHIEVEMENTS</h3>
                        <ul className="space-y-3">
                          {details.achievements.map((achievement: string, index: number) => (
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
                        <h3 className="text-lg font-mono mb-4" style={{color: selectedProject.color}}>TECHNOLOGY STACK</h3>
                        <div className="flex flex-wrap gap-3">
                          {details.technologies.map((tech: string, index: number) => (
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
                        <h3 className="text-lg font-mono mb-4" style={{color: selectedProject.color}}>PROJECT INQUIRY</h3>
                        <p className="text-white/80 mb-6">
                          Interested in discussing the technical details, implementation approach, or potential applications of this project?
                        </p>
                        <button 
                          onClick={() => handleRequestDetails(selectedProject)}
                          className="inline-block px-6 py-3 font-mono transition-all duration-300 text-black"
                          style={{backgroundColor: selectedProject.color}}
                        >
                          REQUEST DETAILS
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      {showContactModal && selectedProject && (
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
            
            <h3 className="text-2xl font-bold mb-2">Request Details</h3>
            <p className="text-white/70 mb-4">
              About <span style={{ color: selectedProject.color }}>{selectedProject.title}</span>
            </p>
            
            {submitSuccess ? (
              <div className="bg-[#9B59B6]/20 border border-[#9B59B6]/50 rounded-lg p-4 text-center my-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 text-[#9B59B6]">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <p className="text-white">Your request has been sent successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                {submitError && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-white text-sm">
                    <p>{submitError}</p>
                  </div>
                )}
                
                <div>
                  <label htmlFor="project-name" className="block text-sm font-medium text-white/80 mb-1">Name</label>
                  <input
                    type="text"
                    id="project-name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent transition-all"
                    placeholder="Your name"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label htmlFor="project-email" className="block text-sm font-medium text-white/80 mb-1">Email</label>
                  <input
                    type="email"
                    id="project-email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent transition-all"
                    placeholder="Your email address"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label htmlFor="project-message" className="block text-sm font-medium text-white/80 mb-1">Message</label>
                  <textarea
                    id="project-message"
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
                  className={`w-full py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center text-black font-medium ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  style={{ backgroundColor: selectedProject.color }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <span>Send Request</span>
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