'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import SubliminalMessages from '@/components/SubliminalMessages';
import EasterEgg from '@/components/EasterEgg';
import Navigation from '@/components/Navigation';
import TheCost from '@/components/TheCost';
import GlitchText from '@/components/GlitchText';
import majorProjectsData from '@/data/major_projects.json';

const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), { ssr: false });

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

export default function QuantumInitiatives() {
  const [loaded, setLoaded] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [scrollY, setScrollY] = useState(0);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  
  // Extract projects and projectDetails from the JSON file
  const projects: Project[] = majorProjectsData.projects;
  const projectDetails: Record<string, ProjectDetail> = majorProjectsData.projectDetails;

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 300);

    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Parallax effect calculations
      if (heroRef.current) {
        const heroRect = heroRef.current.getBoundingClientRect();
        if (heroRect.bottom > 0) {
          const opacity = Math.max(0, (heroRect.height - Math.abs(heroRect.top)) / heroRect.height);
          if (heroRef.current) {
            heroRef.current.style.opacity = String(opacity);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProjectClick = useCallback((id: string) => {
    const project = projects.find((p: Project) => p.id === id);
    setSelectedProject(project || null);
    setActiveSection('overview');
    
    // Scroll to project details with smooth animation
    if (detailsRef.current) {
      window.scrollTo({
        top: detailsRef.current.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  }, [projects]);

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
      }, 3000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred while sending your message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeContactModal = () => {
    setShowContactModal(false);
  };

  const openContactModal = (project?: Project) => {
    if (project) {
      setContactMessage(`I'm interested in learning more about the ${project.title} project.`);
    } else {
      setContactMessage('');
    }
    setShowContactModal(true);
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Common Components */}
      <SubliminalMessages />
      <EasterEgg />
      <Navigation />
      <TheCost />
      
      {/* Hero Section with 3D Background */}
      <section 
        ref={heroRef}
        className="relative h-[80vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <ThreeBackground intensity={0.3} speed={0.5} />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent z-10"></div>
        
        <div className={`container mx-auto px-4 relative z-20 text-center transition-all duration-1000 transform ${
          loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="max-w-4xl mx-auto">
            <div className="mb-2 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full bg-[#9B59B6] animate-pulse"></div>
              <span className="text-xs font-mono text-white/70">PORTFOLIO SECTION</span>
            </div>

            <GlitchText 
              text="QUANTUM INITIATIVES" 
              tag="h1" 
              className="text-5xl sm:text-7xl font-bold mb-6 tracking-tight"
              glitchIntensity={0.4}
            />
            
            <div className="w-24 h-1 bg-gradient-to-r from-[#9B59B6] to-[#94A3B8] mx-auto mb-8"></div>
            
            <p className="text-lg max-w-2xl mx-auto text-white/80 mb-10 leading-relaxed">
              Advanced systems engineered to address complex technical challenges through
              innovative approaches and cutting-edge technologies. Each project represents a substantial
              development effort with significant technical complexity.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => {
                  if (projectsRef.current) {
                    window.scrollTo({
                      top: projectsRef.current.offsetTop - 80,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="px-6 py-3 bg-[#9B59B6] text-white rounded-md hover:bg-[#8e44ad] transition-all duration-300 flex items-center space-x-2 animate-fadeIn"
                style={{ animationDelay: '0.5s' }}
              >
                <span>Explore Projects</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <button 
                onClick={() => openContactModal()}
                className="px-6 py-3 bg-transparent border border-white/30 backdrop-blur-sm text-white rounded-md hover:bg-white/10 transition-all duration-300 animate-fadeIn"
                style={{ animationDelay: '0.7s' }}
              >
                Contact Me
              </button>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section 
        ref={projectsRef}
        className="py-24 relative z-10"
        style={{ 
          background: 'linear-gradient(to bottom, rgba(16, 16, 32, 0), rgba(16, 16, 32, 0.8), rgba(16, 16, 32, 1), rgba(16, 16, 32, 1))'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-white">
                  <span className="text-[#9B59B6]">Significant</span> Projects
                </h2>
                <p className="text-white/60 max-w-2xl">
                  Each initiative showcases a unique approach to solving complex challenges.
                  Select a project to explore its technical details, challenges, and impact.
                </p>
              </div>
              
              <div className="mt-6 md:mt-0">
                <button 
                  onClick={() => openContactModal()}
                  className="px-4 py-2 border border-white/20 rounded-md text-sm text-white/70 hover:text-white hover:border-white/40 transition-all duration-300"
                >
                  Request Custom Project
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project: Project, index) => (
                <div 
                  key={project.id}
                  className="group relative overflow-hidden rounded-lg transition-all duration-500 transform hover:scale-[1.03] border border-white/10 hover:border-white/20 bg-black/40 backdrop-blur-sm animate-fadeIn"
                  style={{ animationDelay: `${0.1 * index}s` }}
                  onClick={() => handleProjectClick(project.id)}
                >
                  {/* Gradient overlay */}
                  <div 
                    className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500 z-0"
                    style={{ 
                      background: `radial-gradient(circle at 30% 30%, ${project.color}40, transparent 70%)` 
                    }}
                  ></div>
                  
                  {/* Card content */}
                  <div className="relative z-10 p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }}></div>
                        <span className="text-xs font-mono text-white/60">{project.status}</span>
                      </div>
                      <span className="text-xs font-mono text-white/60">{project.year}</span>
                    </div>
                    
                    <h3 
                      className="text-2xl font-bold mb-3 group-hover:transform group-hover:translate-x-1 transition-transform duration-300"
                      style={{ color: project.color }}
                    >
                      {project.title}
                    </h3>
                    
                    <p className="text-sm text-white/70 mb-6 flex-grow">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                        <span 
                          key={tagIndex} 
                          className="text-xs bg-white/10 px-2 py-1 rounded-sm font-mono border border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-xs bg-white/10 px-2 py-1 rounded-sm font-mono border border-white/10">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div 
                        className="inline-flex items-center text-xs font-mono transition-all duration-300 group-hover:opacity-100 opacity-70"
                        style={{ color: project.color }}
                      >
                        VIEW DETAILS
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openContactModal(project);
                        }}
                        className="text-xs font-mono text-white/60 hover:text-white transition-colors"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project Details Section */}
      {selectedProject && (
        <section 
          ref={detailsRef}
          className={`py-20 relative z-20 transition-all duration-500 ${
            selectedProject ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{ 
            background: 'linear-gradient(to bottom, rgba(16, 16, 32, 1), rgba(16, 16, 32, 0.9))'
          }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              {/* Project Header */}
              <div 
                className="relative p-8 rounded-t-lg border-b border-white/10 backdrop-blur-md"
                style={{
                  background: `linear-gradient(to right, rgba(0,0,0,0.7), transparent), radial-gradient(circle at right, ${selectedProject.color}30, transparent 70%)`
                }}
              >
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedProject.color }}></div>
                      <span className="text-xs font-mono text-white/70">{selectedProject.status} • {selectedProject.year}</span>
                    </div>
                    
                    <h2 
                      className="text-4xl font-bold mb-4"
                      style={{ color: selectedProject.color }}
                    >
                      {selectedProject.title}
                    </h2>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedProject.tags.map((tag: string, index: number) => (
                        <span 
                          key={index} 
                          className="text-xs bg-black/30 backdrop-blur-sm px-2 py-1 rounded-sm font-mono border border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 md:mt-0">
                    <button 
                      onClick={() => openContactModal(selectedProject)}
                      className="px-4 py-2 bg-[#9B59B6] text-white rounded-md hover:bg-[#8e44ad] transition-all duration-300"
                    >
                      Request More Info
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Content Navigation */}
              <div className="flex overflow-x-auto hide-scrollbar border-b border-white/10 bg-black/30 backdrop-blur-md">
                {['overview', 'challenges', 'technologies', 'achievements'].map((section) => (
                  <button
                    key={section}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300 relative ${
                      activeSection === section 
                        ? 'text-white' 
                        : 'text-white/50 hover:text-white/80'
                    }`}
                    onClick={() => setActiveSection(section)}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                    {activeSection === section && (
                      <div 
                        className="absolute bottom-0 left-0 w-full h-0.5 transform transition-all duration-300"
                        style={{ backgroundColor: selectedProject.color }}
                      ></div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Project Details Content */}
              <div className="p-8 bg-black/30 backdrop-blur-md rounded-b-lg border-t border-white/5">
                {activeSection === 'overview' && (
                  <div className="animate-fadeIn">
                    <p className="text-white/80 leading-relaxed mb-8">
                      {projectDetails[selectedProject.id]?.fullDescription}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-semibold mb-4" style={{ color: selectedProject.color }}>Key Features</h3>
                        <ul className="space-y-2">
                          {projectDetails[selectedProject.id]?.achievements.map((achievement, index) => (
                            <li key={index} className="flex items-start">
                              <div className="flex-shrink-0 mt-1">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedProject.color }}></div>
                              </div>
                              <span className="ml-3 text-white/70">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-4" style={{ color: selectedProject.color }}>Technical Stack</h3>
                        <div className="flex flex-wrap gap-2">
                          {projectDetails[selectedProject.id]?.technologies.map((tech, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-white/10 rounded-md text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeSection === 'challenges' && (
                  <div className="animate-fadeIn">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: selectedProject.color }}>Technical Challenges</h3>
                    <p className="text-white/80 leading-relaxed">
                      {projectDetails[selectedProject.id]?.challenges}
                    </p>
                    
                    <div className="mt-8 p-6 border border-white/10 rounded-lg bg-black/20">
                      <h4 className="text-md font-medium mb-3">Problem-Solving Approach</h4>
                      <p className="text-white/70">
                        These challenges required innovative solutions and iterative development. 
                        Through rigorous testing, optimization, and architectural refinements, 
                        the project successfully overcame these technical obstacles.
                      </p>
                    </div>
                  </div>
                )}
                
                {activeSection === 'technologies' && (
                  <div className="animate-fadeIn">
                    <h3 className="text-lg font-semibold mb-6" style={{ color: selectedProject.color }}>Technology Stack</h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {projectDetails[selectedProject.id]?.technologies.map((tech, index) => (
                        <div 
                          key={index}
                          className="p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center text-center"
                        >
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                            style={{ backgroundColor: `${selectedProject.color}30` }}
                          >
                            <span className="text-lg" style={{ color: selectedProject.color }}>
                              {tech.charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm text-white/80">{tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeSection === 'achievements' && (
                  <div className="animate-fadeIn">
                    <h3 className="text-lg font-semibold mb-6" style={{ color: selectedProject.color }}>Key Achievements</h3>
                    
                    <div className="space-y-6">
                      {projectDetails[selectedProject.id]?.achievements.map((achievement, index) => (
                        <div 
                          key={index}
                          className="flex items-start p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                        >
                          <div 
                            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4"
                            style={{ backgroundColor: `${selectedProject.color}30` }}
                          >
                            <span className="font-medium" style={{ color: selectedProject.color }}>
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="text-white/80">{achievement}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Call to Action */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Interested in <span className="text-[#9B59B6]">Collaborating</span>?
            </h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              If you're looking to develop innovative solutions or want to know more about any specific project,
              I'd be happy to discuss how we can work together.
            </p>
            <button 
              onClick={() => openContactModal()}
              className="px-6 py-3 bg-[#9B59B6] text-white rounded-md hover:bg-[#8e44ad] transition-all duration-300"
            >
              Get in Touch
            </button>
          </div>
        </div>
      </section>
      
      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeContactModal}></div>
          <div className="relative bg-[#151525] border border-white/10 rounded-lg p-8 w-full max-w-md animate-fadeIn">
            <button 
              onClick={closeContactModal}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-xl font-bold mb-6 text-[#9B59B6]">Contact Me</h3>
            
            {submitSuccess ? (
              <div className="text-center p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-white mb-2">Message sent successfully!</p>
                <p className="text-white/60 text-sm">I'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#9B59B6]"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#9B59B6]"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-1">Message</label>
                  <textarea
                    id="message"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#9B59B6] min-h-[100px]"
                    required
                  ></textarea>
                </div>
                
                {submitError && (
                  <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-md text-sm text-white">
                    {submitError}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-[#9B59B6] text-white rounded-md hover:bg-[#8e44ad] transition-all duration-300 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    'Send Message'
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