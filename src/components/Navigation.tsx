'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    { name: 'INITIATIVES', path: '/quantum-initiatives' },
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
          <span>ALI ZARGARI</span>
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
              className={`relative group ${
                pathname === item.path ? 'text-accent' : 'text-foreground'
              }`}
            >
              <span className="absolute -inset-1 bg-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded"></span>
              <span>{item.name}</span>
              {pathname === item.path && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* Mobile navigation */}
        <div 
          className={`fixed inset-0 bg-black bg-opacity-95 z-50 transition-all duration-300 md:hidden ${
            menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <nav className="flex flex-col space-y-8 items-center">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-2xl relative group ${
                    pathname === item.path ? 'text-accent' : 'text-foreground'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{item.name}</span>
                  {pathname === item.path && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent"></span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
} 