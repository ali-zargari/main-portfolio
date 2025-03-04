'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import GlitchText from '@/components/GlitchText';
import SubliminalMessages from '@/components/SubliminalMessages';
import EasterEgg from '@/components/EasterEgg';
import TheCost from '@/components/TheCost';

// Sample blog post data
const posts = [
  {
    id: 'post-1',
    title: 'The Illusion of Stability in Complex Systems',
    excerpt: 'Why the systems we build are inherently unstable, and how embracing chaos leads to more resilient architecture.',
    date: '2023-11-15',
    readTime: '7 min read',
    tags: ['Systems Theory', 'Chaos Engineering', 'Resilience']
  },
  {
    id: 'post-2',
    title: 'Sleep Is Optional: The Engineer\'s Dilemma',
    excerpt: 'The relationship between sleep deprivation and breakthrough thinking. A personal journey through insomnia-driven innovation.',
    date: '2023-09-22',
    readTime: '5 min read',
    tags: ['Personal', 'Productivity', 'Mental Models']
  },
  {
    id: 'post-3',
    title: 'Designing Systems That Outlive Their Creators',
    excerpt: 'The principles behind building technology that continues to evolve and adapt long after you\'ve stopped maintaining it.',
    date: '2023-07-08',
    readTime: '9 min read',
    tags: ['System Design', 'Legacy', 'Evolution']
  },
  {
    id: 'post-4',
    title: 'The Cost of Perfection: Why Good Enough Is Better',
    excerpt: 'Perfection is the enemy of progress. How settling for "good enough" can lead to more robust and adaptable systems in the long run.',
    date: '2023-05-17',
    readTime: '6 min read',
    tags: ['Philosophy', 'Engineering Principles', 'Pragmatism']
  },
  {
    id: 'post-5',
    title: 'Signal vs. Noise: Finding Clarity in Data Chaos',
    excerpt: 'Techniques for separating meaningful signals from the overwhelming noise in large-scale data systems.',
    date: '2023-03-29',
    readTime: '8 min read',
    tags: ['Data Analysis', 'Signal Processing', 'Decision Making']
  }
];

export default function SignalNoise() {
  const [loaded, setLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [isGlitching, setIsGlitching] = useState(false);

  // Extract all unique tags
  const allTags = ['All', ...Array.from(new Set(posts.flatMap(post => post.tags)))];

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 300);

    // Random glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    }, 5000);

    return () => clearInterval(glitchInterval);
  }, []);

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.tags.includes(activeFilter)));
    }
  }, [activeFilter]);

  return (
    <main className={`min-h-screen bg-background text-foreground relative overflow-hidden pt-20 ${
      isGlitching ? 'glitch' : ''
    }`}>
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
              text="SIGNAL NOISE" 
              tag="h1" 
              className="text-4xl sm:text-5xl font-bold mb-6"
              glitchIntensity={0.3}
            />
            <div className="w-20 h-1 bg-accent mb-8"></div>
            <p className="text-lg max-w-3xl">
              Unfiltered thoughts, technical insights, and occasional revelations from the edge of chaos.
              Some signal, some noise—you decide which is which.
            </p>
          </div>

          {/* Tag filters */}
          <div className="mb-12 overflow-x-auto">
            <div className="flex space-x-4 pb-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`px-4 py-2 text-sm font-mono whitespace-nowrap transition-all duration-300 ${
                    activeFilter === tag 
                      ? 'bg-accent text-background' 
                      : 'bg-transparent border border-[#333] hover:border-accent'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Blog posts */}
          <div className="space-y-8">
            {filteredPosts.map((post) => (
              <Link 
                href={`/signal-noise/${post.id}`} 
                key={post.id}
                className="block group"
              >
                <div className="relative">
                  <div className="absolute -inset-1 border border-[#333] z-0 group-hover:border-accent transition-colors duration-300"></div>
                  <div className="relative z-10 bg-[#111] p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors duration-300">
                          {post.title}
                        </h2>
                        <p className="text-base opacity-80 mb-4">{post.excerpt}</p>
                      </div>
                      <div className="flex flex-col items-start md:items-end">
                        <div className="text-xs font-mono text-accent mb-2">{post.date}</div>
                        <div className="text-xs font-mono opacity-70">{post.readTime}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="text-xs bg-[#222] px-2 py-1 rounded font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty state */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="terminal-text text-lg mb-4">NO SIGNAL DETECTED</div>
              <p className="opacity-70">Try adjusting your filters to find different frequencies.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 