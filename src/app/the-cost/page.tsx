'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import GlitchText from '@/components/GlitchText';
import SubliminalMessages from '@/components/SubliminalMessages';
import EasterEgg from '@/components/EasterEgg';
import TheCost from '@/components/TheCost';

export default function TheCostPage() {
  const [loaded, setLoaded] = useState(false);
  const [currentCost, setCurrentCost] = useState(0);
  const costs = [
    {
      title: "Sleep",
      description: "The nights blur together. 3AM becomes normal. 5AM becomes a goal. The code doesn't care if you're tired.",
      stats: [
        { label: "Average Sleep", value: "4.2 hours" },
        { label: "Sleep Debt", value: "1,247 hours" },
        { label: "Longest Streak Awake", value: "52 hours" }
      ]
    },
    {
      title: "Certainty",
      description: "There are no guarantees in complex systems. You learn to embrace the chaos, to find comfort in uncertainty, to expect the unexpected.",
      stats: [
        { label: "Known Unknowns", value: "73%" },
        { label: "Unknown Unknowns", value: "∞" },
        { label: "Certainty Threshold", value: "Never achieved" }
      ]
    },
    {
      title: "Time",
      description: "Hours, days, weeks disappear. Time becomes elastic when you're deep in the system. The outside world continues without you.",
      stats: [
        { label: "Hours Invested", value: "27,394" },
        { label: "Missed Events", value: "Countless" },
        { label: "Time Perception Distortion", value: "Severe" }
      ]
    },
    {
      title: "Comfort",
      description: "Comfort is the enemy of growth. You learn to seek discomfort, to push boundaries, to live on the edge where innovation happens.",
      stats: [
        { label: "Comfort Zone Exits", value: "Daily" },
        { label: "Pain Threshold", value: "Elevated" },
        { label: "Adaptation Rate", value: "Accelerating" }
      ]
    }
  ];

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
              text="THE COST" 
              tag="h1" 
              className="text-4xl sm:text-5xl font-bold mb-6"
              glitchIntensity={0.3}
            />
            <div className="w-20 h-1 bg-accent mb-8"></div>
            <p className="text-lg max-w-3xl">
              Everything has a price. Mastery demands sacrifice. These are the costs I've paid 
              willingly—the currency exchanged for excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              {costs.map((cost, index) => (
                <button 
                  key={index}
                  className={`w-full text-left relative group ${currentCost === index ? 'opacity-100' : 'opacity-70 hover:opacity-100'} transition-opacity duration-300`}
                  onClick={() => setCurrentCost(index)}
                >
                  <div className={`absolute -inset-1 border ${currentCost === index ? 'border-accent' : 'border-[#333] group-hover:border-accent'} z-0 transition-colors duration-300`}></div>
                  <div className="relative z-10 bg-[#111] p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold">{cost.title}</h2>
                      <div className={`w-3 h-3 rounded-full ${currentCost === index ? 'bg-accent' : 'bg-[#333]'} transition-colors duration-300`}></div>
                    </div>
                    <p className="text-sm opacity-80 line-clamp-2">{cost.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute -inset-1 border border-[#333] z-0"></div>
              <div className="relative z-10 bg-[#111] p-6 h-full">
                <div className="terminal-text text-xs mb-4">SYSTEM://personal/costs/{costs[currentCost].title.toLowerCase()}.log</div>
                
                <div className="space-y-8">
                  <div>
                    <GlitchText 
                      text={costs[currentCost].title} 
                      tag="h3" 
                      className="text-3xl font-bold mb-4 text-accent"
                      glitchIntensity={0.4}
                    />
                    <p className="text-lg mb-8">{costs[currentCost].description}</p>
                  </div>
                  
                  <div className="space-y-6">
                    {costs[currentCost].stats.map((stat, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-mono">{stat.label}</span>
                          <span className="font-mono text-accent">{stat.value}</span>
                        </div>
                        <div className="w-full bg-[#222] h-2">
                          <div 
                            className="bg-accent h-full transition-all duration-500" 
                            style={{ width: `${Math.random() * 40 + 60}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-sm opacity-70 italic border-l-2 border-accent pl-4 py-2">
                    "The price of anything is the amount of life you exchange for it."
                  </div>
                </div>
                
                <div className="absolute bottom-6 right-6 text-xs font-mono opacity-50">
                  But never purpose.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 