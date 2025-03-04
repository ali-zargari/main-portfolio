'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import GlitchText from '@/components/GlitchText';
import SubliminalMessages from '@/components/SubliminalMessages';
import EasterEgg from '@/components/EasterEgg';
import TheCost from '@/components/TheCost';

export default function OriginStory() {
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
              text="ORIGIN STORY" 
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
                  <div className="terminal-text text-xs mb-4">SYSTEM://personal_logs/origin.txt</div>
                  <div className="space-y-6 text-lg">
                    <p>
                      I wasn't born into technology. I <span className="text-accent">fought</span> my way into it.
                    </p>
                    <p>
                      When systems fail, people suffer. I learned this early. The difference between 
                      a functioning system and a broken one isn't academic—it's survival.
                    </p>
                    <p>
                      My journey began with necessity, not curiosity. When everything around me was 
                      unpredictable, I found solace in the predictable nature of well-designed systems.
                    </p>
                    <p>
                      I've built my career on the edge of chaos, creating order where there was none, 
                      finding patterns in noise, and building resilience into every line of code.
                    </p>
                    <p>
                      This isn't a story about becoming a systems engineer. This is a story about 
                      becoming the <span className="font-bold flicker">architect of my own survival</span>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative mt-12">
                <div className="absolute -inset-1 border border-[#333] z-0"></div>
                <div className="relative z-10 bg-[#111] p-6">
                  <div className="terminal-text text-xs mb-4">SYSTEM://philosophy.md</div>
                  <div className="space-y-6">
                    <p className="text-xl font-bold text-accent">Core Principles</p>
                    <ul className="space-y-4 list-disc pl-5">
                      <li>Resilience over perfection</li>
                      <li>Adaptation over prediction</li>
                      <li>Function over form (though form matters)</li>
                      <li>Simplicity in complexity</li>
                      <li>Constant evolution</li>
                    </ul>
                    <p className="text-sm opacity-70 italic mt-6">
                      "The most elegant systems are those that survive their creators' mistakes."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="relative">
                <div className="absolute -inset-1 border border-[#333] z-0"></div>
                <div className="relative z-10 bg-[#111] p-6">
                  <div className="terminal-text text-xs mb-4">SYSTEM://timeline.json</div>
                  <div className="space-y-6">
                    <div className="border-l-2 border-accent pl-4 py-2">
                      <div className="text-accent font-mono text-sm">2010</div>
                      <div className="font-bold">First System</div>
                      <div className="text-sm opacity-70">Built a rudimentary monitoring system out of necessity.</div>
                    </div>
                    <div className="border-l-2 border-accent pl-4 py-2">
                      <div className="text-accent font-mono text-sm">2014</div>
                      <div className="font-bold">Breaking Point</div>
                      <div className="text-sm opacity-70">When failure wasn't an option, innovation became mandatory.</div>
                    </div>
                    <div className="border-l-2 border-accent pl-4 py-2">
                      <div className="text-accent font-mono text-sm">2017</div>
                      <div className="font-bold">System Architect</div>
                      <div className="text-sm opacity-70">Transitioned from building components to designing ecosystems.</div>
                    </div>
                    <div className="border-l-2 border-accent pl-4 py-2">
                      <div className="text-accent font-mono text-sm">2020</div>
                      <div className="font-bold">Olympus Project</div>
                      <div className="text-sm opacity-70">Created the framework that would define my approach to systems.</div>
                    </div>
                    <div className="border-l-2 border-accent pl-4 py-2">
                      <div className="text-accent font-mono text-sm">NOW</div>
                      <div className="font-bold">Continuous Evolution</div>
                      <div className="text-sm opacity-70">The system never stops improving. Neither do I.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-1 border border-[#333] z-0"></div>
                <div className="relative z-10 bg-[#111] p-6">
                  <div className="terminal-text text-xs mb-4">SYSTEM://skills.dat</div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-mono">System Architecture</span>
                        <span className="font-mono text-terminal-green">94%</span>
                      </div>
                      <div className="w-full bg-[#222] h-2">
                        <div className="bg-terminal-green h-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-mono">Distributed Systems</span>
                        <span className="font-mono text-system-blue">89%</span>
                      </div>
                      <div className="w-full bg-[#222] h-2">
                        <div className="bg-system-blue h-full" style={{ width: '89%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-mono">Resilience Engineering</span>
                        <span className="font-mono text-accent">97%</span>
                      </div>
                      <div className="w-full bg-[#222] h-2">
                        <div className="bg-accent h-full" style={{ width: '97%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-mono">Cloud Infrastructure</span>
                        <span className="font-mono text-terminal-green">92%</span>
                      </div>
                      <div className="w-full bg-[#222] h-2">
                        <div className="bg-terminal-green h-full" style={{ width: '92%' }}></div>
                      </div>
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