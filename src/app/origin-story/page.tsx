'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import GlitchText from '@/components/GlitchText';
import SubliminalMessages from '@/components/SubliminalMessages';
import EasterEgg from '@/components/EasterEgg';
import TheCost from '@/components/TheCost';
import majorProjectsData from '@/data/major_projects.json';

// Extend Window interface to include scrollTimeout
declare global {
  interface Window {
    scrollTimeout: number;
  }
}

// Timeline data
const timelineEvents = [
  {
    year: '2014',
    title: 'The First Line of Code',
    description: 'Writing my first "Hello World" program sparked a genuine excitement I still carry today. That simple moment revealed how I could transform ideas into reality through logic and language. It was the first step on an unexpected path that would become central to my life and career.',
    skills: ['HTML', 'CSS', 'JavaScript'],
    icon: '👋',
    color: '#94A3B8'
  },
  {
    year: '2015-2016',
    title: 'Backend Engineer at CASA',
    description: 'At CASA, I built my first professional applications and APIs in a fast-paced startup environment. The experience taught me how software architecture works in practice, not just theory. More importantly, it taught me that what matters is getting things done, not just knowing how to do it.',
    skills: ['Node.js', 'Databases', 'API Development', 'Backend Architecture'],
    icon: '🏢',
    color: '#9B59B6'
  },
  {
    year: '2017-2020',
    title: 'Bakery & Tech Support',
    description: 'My bakery years might seem unrelated to tech, but they were surprisingly valuable. While handling pastries up front, I maintained the shop\'s computer systems in the back. I learned to explain technical concepts to people who just wanted their systems to work, and to find creative solutions with limited resources. These skills have proven essential throughout my engineering career.',
    skills: ['IT Support', 'System Maintenance', 'Troubleshooting', 'Customer Service'],
    icon: '🥐',
    color: '#E67E22'
  },
  {
    year: '2019-2020',
    title: 'Sharing the Magic at Code Ninjas',
    description: 'Teaching kids to code at Code Ninjas in Cupertino brought my journey full circle. Watching their faces light up when their code worked reminded me why I fell in love with programming. Beyond teaching Scratch and running workshops, I was sharing the joy of creation. Each student\'s breakthrough moment reinforced my own passion for building and problem-solving. It is a shame that covid-19 cut short my time to explore this side of my passion.',
    skills: ['Teaching', 'Scratch', 'Curriculum Development', 'Mentoring'],
    icon: '👨‍🏫',
    color: '#3498DB'
  },
  {
    year: '2021-2022',
    title: 'Hands-On at Element Materials',
    description: 'At Element Materials Technologies, I wrote scripts that communicated with RF testing equipment, and parsed the data to ensure future testing was successful. The work connected software to the physical world in a tangible way. I helped ensure products were compliant with FCC standards before they reached consumers.',
    skills: ['Python', 'RF Testing', 'EMC Testing', 'Laboratory Instrumentation'],
    icon: '🔬',
    color: '#E74C3C'
  },
  {
    year: '2022',
    title: 'Beginning My SJSU Journey',
    description: 'Starting at San Jose State University opened a new chapter in my life. After years of self-teaching and hands-on work, I was ready for formal education in software engineering. The first semesters were both challenging and exciting as I balanced coursework with practical projects. I quickly found my rhythm, connecting theoretical concepts with my real-world experience and building relationships with professors and fellow students who would become valuable collaborators.',
    skills: ['Software Engineering', 'Computer Science', 'Academic Foundations', 'Structured Learning'],
    icon: '🏫',
    color: '#3498DB'
  },
  {
    year: 'Sept 2023',
    title: 'SocialSync: Engineering with Empathy',
    description: 'SocialSync began with a clear purpose: to help people with ASD navigate social interactions. Leading the full-stack development taught me valuable technical skills, but the project\'s impact went deeper. Building the emotion detection module with TensorFlow and OpenCV showed me how technology can genuinely improve lives. The emotional prediction algorithm became a tool for human connection, not just an interesting technical challenge.',
    skills: ['PyQt5', 'Flask', 'SQLAlchemy', 'MySQL', 'Google Cloud', 'TensorFlow', 'OpenCV'],
    icon: '🤝',
    color: '#9B59B6'
  },
  {
    year: 'June 2024',
    title: 'Memento: Memory Assistance System',
    description: 'With Memento, I created an IoT solution for people with memory impairment. I built a comprehensive backend using PostgreSQL and FastAPI, focusing on reliability and ease of use. The project challenged me to consider the human impact of every technical decision, ensuring the technology served its users effectively while respecting their dignity and independence.',
    skills: ['PostgreSQL', 'FastAPI', 'SQLAlchemy', 'React', 'IoT', 'User-Centered Design'],
    icon: '🧠',
    color: '#2ECC71'
  },
  {
    year: 'Aug 2024',
    title: 'SLAM Kalman Localization',
    description: 'My work on a Localization System using SLAM and Extended Kalman Filter pushed my technical abilities in new directions. By simulating a Tesla Model 3 in ROS2 and Webots, I developed algorithms that could maintain accurate positioning despite sensor noise and environmental uncertainties. The project deepened my understanding of robotics and autonomous systems while honing my skills in complex mathematical modeling.',
    skills: ['ROS2', 'Webots', 'EKF', 'LiDAR', 'Autonomous Systems', 'Simulation'],
    icon: '🚗',
    color: '#E67E22'
  },
  {
    year: 'Dec 2024',
    title: 'Graduating from SJSU',
    description: 'Walking across the stage to receive my Bachelor of Science in Software Engineering was a moment of pride and reflection. The journey through SJSU transformed me from a self-taught programmer into a well-rounded engineer. Being named a 2023 Engineering Dean\'s Scholar validated my hard work, but the true rewards were the comprehensive knowledge, professional connections, and collaborative experiences This milestone represented not just academic success, but a foundation for my future career.',
    skills: ['Software Engineering', 'Computer Science', 'Academic Excellence', 'Collaborative Development'],
    icon: '🎓',
    color: '#F39C12'
  },
  {
    year: 'Dec 2024',
    title: 'Olympus: The Culmination',
    description: 'Olympus brings together everything I\'ve learned about AI, IoT, and human-centered design to create better living spaces. From the hardware architecture with mmWave sensors and ESP32 microcontrollers to the AI-driven automation with computer vision and NLP, the project reflects my growth as an engineer. Olympus continues to evolve as I learn and improve, representing both what I\'ve accomplished and where I\'m headed.',
    skills: ['IoT', 'NLP', 'Computer Vision', 'Predictive Analytics', 'ESP32', 'NVIDIA Jetson'],
    icon: '🏛️',
    color: '#94A3B8'
  }
];

export default function OriginStory() {
  const [loaded, setLoaded] = useState(false);
  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  
  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 300);
    
    const handleScroll = () => {
      if (!timelineRef.current) return;
      
      setIsScrolling(true);
      
      // Find which event is in view
      const events = timelineRef.current.querySelectorAll('.timeline-event');
      let activeIndex = null;
      
      events.forEach((event, index) => {
        const rect = event.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.4;
        
        if (isInView) {
          activeIndex = index;
        }
      });
      
      setActiveEvent(activeIndex);
      
      // Clear scrolling state after a delay
      clearTimeout(window.scrollTimeout);
      window.scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150) as unknown as number;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Get major projects data
  const majorProjects = majorProjectsData.projects;
  
  // Type-safe access to project details
  const getProjectDetails = (projectId: string) => {
    return (majorProjectsData.projectDetails as Record<string, any>)[projectId];
  };
  
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Components that appear on all pages */}
      <SubliminalMessages />
      <EasterEgg />
      <Navigation />
      
      {/* Hero section */}
      <section className="h-screen relative flex items-center justify-center overflow-hidden">
        {/* Background code animation */}
        <div className="absolute inset-0 opacity-10">
          <div className="code-rain"></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GlitchText 
              text="MY JOURNEY" 
              tag="h1" 
              className="text-5xl sm:text-7xl font-bold mb-6"
              glitchIntensity={0.4}
            />
            <div className="w-24 h-1 bg-gradient-to-r from-[#9B59B6] to-[#94A3B8] mx-auto mb-8"></div>
            <p className="text-xl max-w-2xl mx-auto text-white/70 mb-12">
              From first code to complex systems: a developer's journey through creativity, challenges, and continuous growth.
            </p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1.5 }}
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            >
              <p className="text-white/50 mb-4 text-sm">Scroll to explore</p>
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                <motion.div 
                  className="w-1 h-2 bg-white/60 rounded-full"
                  animate={{ 
                    y: [0, 12, 0],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Timeline section */}
      <section ref={containerRef} className="py-20 relative">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black z-0"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5 z-0"></div>
        
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          style={{ opacity }}
        >
          <div className="max-w-6xl mx-auto">
            {/* Timeline intro */}
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold mb-6">My Journey</h2>
              <div className="w-16 h-1 bg-[#9B59B6] mx-auto mb-8"></div>
              <p className="text-lg max-w-2xl mx-auto text-white/70">
                This timeline traces my evolution as a developer, engineer, and problem-solver. Each experience has shaped not just my technical abilities, but also my understanding of why technology matters and how it can serve real human needs.
              </p>
            </div>
            
            {/* Timeline */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#9B59B6]/80 via-[#94A3B8]/80 to-white/30"></div>
              
              {/* Timeline events */}
              <div ref={timelineRef} className="relative z-10">
                {timelineEvents.map((event, index) => (
                  <div 
                    key={index}
                    className="timeline-event mb-40 last:mb-0"
                  >
                    <div className="flex flex-col items-center">
                      {/* Event icon */}
                      <div className="relative mb-8">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ duration: 0.5 }}
                          viewport={{ once: true }}
                          className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl z-20 ${
                            activeEvent === index 
                              ? 'bg-gradient-to-br from-[#9B59B6] to-[#94A3B8] shadow-lg shadow-[#9B59B6]/30' 
                              : 'bg-black/80 border border-white/20'
                          }`}
                        >
                          {event.icon}
                        </motion.div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-[#9B59B6]/20 filter blur-md z-10"></div>
                      </div>
                      
                      {/* Year badge */}
                      <div className="mb-6">
                        <span 
                          className="text-base font-mono px-6 py-2 rounded-full backdrop-blur-sm border border-[#1E293B] shadow-lg" 
                          style={{ 
                            background: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(10,15,30,0.6))`,
                            color: event.color,
                            boxShadow: `0 0 15px ${event.color}40, inset 0 0 10px ${event.color}20`
                          }}
                        >
                          {event.year}
                        </span>
                      </div>
                      
                      {/* Event content */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className={`w-full max-w-4xl bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-sm border border-white/10 p-8 rounded-xl ${
                          activeEvent === index ? 'shadow-lg shadow-[#9B59B6]/20' : ''
                        }`}
                        style={{
                          boxShadow: activeEvent === index ? `0 5px 20px ${event.color}20` : ''
                        }}
                      >
                        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center" style={{ color: event.color }}>
                          {event.title}
                        </h3>
                        
                        <p className="text-white/80 mb-8 leading-relaxed text-lg">
                          {event.description}
                        </p>
                        
                        <div className="flex flex-wrap justify-center gap-3">
                          {event.skills.map((skill, skillIndex) => (
                            <span 
                              key={skillIndex}
                              className="px-3 py-1.5 bg-black/50 text-sm font-mono rounded-full border border-white/10 text-white/80 hover:border-white/30 transition-colors"
                              style={{
                                borderColor: `${event.color}30`,
                                backgroundColor: `${event.color}10`
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Major projects highlight section */}
      <section className="py-24 relative">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black z-0"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">Milestone Projects</h2>
              <div className="w-16 h-1 bg-[#9B59B6] mx-auto mb-8"></div>
              <p className="text-lg max-w-2xl mx-auto text-white/70 mb-12">
                These projects represent key moments in my development. Each one started with a challenge I wanted to solve, required me to push my technical boundaries, and resulted in something I'm proud to have built.
              </p>
            </div>
            
            <div className="space-y-32">
              {majorProjects.map((project, index) => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="relative"
                >
                  {/* Background glow effect */}
                  <div 
                    className="absolute inset-0 blur-3xl opacity-20 rounded-3xl z-0" 
                    style={{ background: `radial-gradient(circle at center, ${project.color}, transparent 70%)` }}
                  ></div>
                  
                  {/* Project card */}
                  <div className="relative z-10 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      {/* Project image section */}
                      <div className="relative h-80 lg:h-auto overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
                        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-transparent z-10"></div>
                        <Image 
                          src={project.image} 
                          alt={project.title}
                          fill
                          className="object-cover opacity-80"
                        />
                        <div className="absolute top-0 left-0 w-full p-8 z-20">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-3xl font-bold" style={{ color: project.color }}>{project.title}</h3>
                            <span className="text-sm font-mono px-3 py-1 bg-black/70 rounded-full border border-white/10">
                              {project.year}
                            </span>
                          </div>
                          <div 
                            className="inline-block px-3 py-1 rounded-full text-sm font-mono mb-3 border border-white/10" 
                            style={{ 
                              background: `linear-gradient(135deg, ${project.color}40, transparent)`,
                              color: project.color 
                            }}
                          >
                            {project.status}
                          </div>
                        </div>
                      </div>
                      
                      {/* Project content section */}
                      <div className="p-8 lg:p-10">
                        <div className="h-full flex flex-col">
                          <p className="text-white/80 mb-8 leading-relaxed text-lg">
                            {getProjectDetails(project.id).fullDescription}
                          </p>
                          
                          <div className="mb-8">
                            <h4 className="text-xl font-semibold mb-4" style={{ color: project.color }}>Key Technologies</h4>
                            <div className="flex flex-wrap gap-2">
                              {getProjectDetails(project.id).technologies.map((tech: string, techIndex: number) => (
                                <span 
                                  key={techIndex}
                                  className="px-3 py-1.5 bg-black/50 text-sm font-mono rounded-full border border-white/10 text-white/80 hover:border-white/30 transition-colors"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-auto">
                            <Link 
                              href="/quantum-initiatives"
                              className="inline-flex items-center px-6 py-3 bg-black/50 border border-white/10 rounded-lg text-base hover:bg-white/5 transition-all duration-300"
                            >
                              <span>View Project Details</span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Final reflection section */}
      <section className="py-24 relative">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-black to-[#0a0a0a] z-0"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-10 shadow-xl"
            >
              <h2 className="text-3xl font-bold mb-6 text-center">Looking Forward</h2>
              <div className="w-16 h-1 bg-[#9B59B6] mx-auto mb-8"></div>
              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                Looking back at my journey, I see a path of growth and discovery. Each challenge has expanded my technical skills while clarifying my vision for what meaningful technology can accomplish.
              </p>
              <p className="text-lg text-white/80 mb-12 leading-relaxed">
                Moving forward, I'm focused on creating technology that genuinely enhances human experience. Whether that means helping people with cognitive challenges, designing more intuitive living spaces, or tackling problems we haven't yet imagined, I'm eager to keep building, learning, and growing.
              </p>
              
              <div className="flex justify-center">
                <Link 
                  href="/contact"
                  className="inline-flex items-center bg-gradient-to-r from-[#94A3B8] to-[#9B59B6] text-white px-8 py-4 rounded-lg font-medium hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#9B59B6]/20"
                >
                  <span>Let's Build Something Together</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CSS for code rain animation */}
      <style jsx>{`
        .code-rain {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%),
                      url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='matrix' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Ctext x='50%25' y='50%25' font-size='12' fill='rgba(255,255,255,0.3)' text-anchor='middle' dominant-baseline='middle'%3E01%3C/text%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23matrix)'/%3E%3C/svg%3E");
          animation: rain 20s linear infinite;
        }
        
        @keyframes rain {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 0% 100%;
          }
        }
      `}</style>
      
      {/* The Cost component */}
      <TheCost />
    </main>
  );
}