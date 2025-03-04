'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import GlitchText from './GlitchText';

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'ORIGIN STORY', path: '/origin-story' },
    { name: 'CLASSIFIED OPERATIONS', path: '/classified-operations' },
    { name: 'SIGNAL NOISE', path: '/signal-noise' },
    { name: 'THE COST', path: '/the-cost' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled ? 'bg-black bg-opacity-80 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-foreground font-mono text-xl relative group">
          <span className="absolute -inset-1 bg-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded"></span>
          <GlitchText text="ALI ZARGARI" tag="span" glitchIntensity={0.2} />
          <span className="text-accent text-xs ml-1 opacity-70">v1.0.3</span>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`w-full h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-full h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`w-full h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`text-sm font-mono relative group ${
                pathname === item.path ? 'text-accent' : 'text-foreground'
              }`}
            >
              <span className="absolute -inset-1 bg-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded"></span>
              {pathname === item.path ? (
                <GlitchText text={item.name} tag="span" glitchIntensity={0.4} />
              ) : (
                <span>{item.name}</span>
              )}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden fixed inset-0 bg-black bg-opacity-95 z-50 transition-transform duration-500 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-end">
          <button 
            onClick={() => setMenuOpen(false)}
            className="text-foreground"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`text-xl font-mono my-4 relative ${
                pathname === item.path ? 'text-accent' : 'text-foreground'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {pathname === item.path ? (
                <GlitchText text={item.name} tag="span" glitchIntensity={0.4} />
              ) : (
                <span>{item.name}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
} 