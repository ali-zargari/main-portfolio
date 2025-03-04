'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Generate random points and colors in 3D space
function generatePoints(count: number) {
  const points = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scale = 10; // Reduced scale to make particles more concentrated
  const color = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    points[i3] = (Math.random() - 0.5) * scale;
    points[i3 + 1] = (Math.random() - 0.5) * scale;
    points[i3 + 2] = (Math.random() - 0.5) * scale;

    // Generate colorful particles with a mix of colors
    const colorChoice = Math.random();
    
    if (colorChoice < 0.6) {
      // 60% white/silver particles (base color)
      const grayValue = 0.7 + Math.random() * 0.3;
      color.setRGB(grayValue, grayValue, grayValue);
    } else if (colorChoice < 0.75) {
      // 15% cyan/blue particles
      color.setRGB(
        0.2 + Math.random() * 0.2,
        0.5 + Math.random() * 0.5,
        0.8 + Math.random() * 0.2
      );
    } else if (colorChoice < 0.9) {
      // 15% purple particles
      color.setRGB(
        0.5 + Math.random() * 0.3,
        0.2 + Math.random() * 0.2,
        0.8 + Math.random() * 0.2
      );
    } else {
      // 10% gold/yellow particles
      color.setRGB(
        0.8 + Math.random() * 0.2,
        0.7 + Math.random() * 0.3,
        0.2 + Math.random() * 0.2
      );
    }

    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  return { positions: points, colors };
}

interface ParticleFieldProps {
  count?: number;
  mouse: React.MutableRefObject<[number, number]>;
}

function ParticleField({ count = 12000, mouse }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  // Track mouse position for interactive effects
  const mousePosition = useRef<[number, number, number]>([0, 0, 0]);
  
  // Memoize the generated points and colors so they don't change on each render
  const { positions, colors } = useMemo(() => generatePoints(count), [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    // Update mouse position with smoothing
    mousePosition.current[0] += (mouse.current[0] - mousePosition.current[0]) * 0.1;
    mousePosition.current[1] += (mouse.current[1] - mousePosition.current[1]) * 0.1;
    
    // Base rotation
    pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.05;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
    
    // Apply interactive wave effect based on mouse position
    const positionArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.getElapsedTime();
    
    for (let i = 0; i < positionArray.length; i += 3) {
      const x = positionArray[i];
      const y = positionArray[i + 1];
      const z = positionArray[i + 2];
      
      // Calculate distance from mouse (in 3D space)
      const mouseX = mousePosition.current[0] * 5; // Scale for more dramatic effect
      const mouseY = mousePosition.current[1] * 5;
      
      const dx = x - mouseX;
      const dy = y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Create a ripple effect from mouse position
      const ripple = Math.sin(dist * 0.5 - time * 2) * 0.1;
      const mouseFactor = Math.max(0, 1 - dist * 0.1); // Stronger effect closer to mouse
      
      // Apply wave motion with mouse influence
      positionArray[i + 1] = y + Math.sin(time * 0.5 + x * 0.5) * 0.05 + ripple * mouseFactor;
      
      // Add some vertical movement based on mouse Y position
      positionArray[i + 2] = z + Math.cos(time * 0.3 + y * 0.2) * 0.03 + mousePosition.current[1] * mouseFactor * 0.2;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Enhanced mouse-based rotation
    pointsRef.current.rotation.x += (mouse.current[1] * 0.002 - pointsRef.current.rotation.x) * 0.05;
    pointsRef.current.rotation.y += (mouse.current[0] * 0.002 - pointsRef.current.rotation.y) * 0.05;
    
    // Add a slight tilt based on mouse position
    pointsRef.current.rotation.z = mouse.current[0] * 0.05;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      {/* Attach the colors as a buffer attribute */}
      <bufferAttribute
        attach="attributes.color"
        args={[colors, 3]}
        count={positions.length / 3}
        itemSize={3}
      />
      <PointMaterial
        transparent
        vertexColors
        size={0.25} // Increased size for better visibility
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function ThreeBackground() {
  const mouse = useRef<[number, number]>([0, 0]);
  const [isClient, setIsClient] = useState(false);
  const [mouseActive, setMouseActive] = useState(false);
  const [mouseTrails, setMouseTrails] = useState<{id: number, x: number, y: number}[]>([]);
  const trailIdRef = useRef(0);
  
  useEffect(() => {
    setIsClient(true);
    console.log('Three.js background initialized');
    
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to be between -1 and 1
      mouse.current = [
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      ];
      
      // Set mouse as active when it moves
      setMouseActive(true);
      
      // Add a new trail element
      if (Math.random() > 0.6) { // Only add trail sometimes for performance
        const newTrail = {
          id: trailIdRef.current++,
          x: event.clientX,
          y: event.clientY
        };
        
        setMouseTrails(prev => [...prev, newTrail]);
        
        // Remove trail after animation completes
        setTimeout(() => {
          setMouseTrails(prev => prev.filter(trail => trail.id !== newTrail.id));
        }, 1000);
      }
      
      // Reset mouse active state after a delay
      clearTimeout(mouseActiveTimeout.current);
      mouseActiveTimeout.current = setTimeout(() => {
        setMouseActive(false);
      }, 2000);
    };
    
    const mouseActiveTimeout = { current: null as any };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(mouseActiveTimeout.current);
    };
  }, []);

  if (!isClient) return null;

  return (
    <>
      <div className={`three-bg-container ${mouseActive ? 'mouse-active' : ''}`}>
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={1.0} /> {/* Increased light intensity */}
          <ParticleField mouse={mouse} />
          <fog attach="fog" args={['#0f0f1a', 8, 20]} /> {/* Updated fog color to match background */}
        </Canvas>
      </div>
      
      {/* Mouse trail elements */}
      {mouseTrails.map(trail => (
        <div 
          key={trail.id}
          className="mouse-trail"
          style={{
            left: `${trail.x}px`,
            top: `${trail.y}px`
          }}
        />
      ))}
    </>
  );
}
