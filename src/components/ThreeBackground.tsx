'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Generate random points and colors in 3D space
function generatePoints(count: number) {
  const points = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scale = 35; // Increased scale to make particles cover more of the screen
  const color = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    points[i3] = (Math.random() - 0.5) * scale;
    points[i3 + 1] = (Math.random() - 0.5) * scale;
    points[i3 + 2] = (Math.random() - 0.5) * scale;

    // Generate colorful particles with a mix of colors
    const colorChoice = Math.random();
    
    if (colorChoice < 0.5) {
      // 50% white/silver particles (base color)
      const grayValue = 0.7 + Math.random() * 0.3;
      color.setRGB(grayValue, grayValue, grayValue);
    } else if (colorChoice < 0.7) {
      // 20% cyan/blue particles
      color.setRGB(
        0.2 + Math.random() * 0.2,
        0.5 + Math.random() * 0.5,
        0.8 + Math.random() * 0.2
      );
    } else if (colorChoice < 0.9) {
      // 20% purple particles
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
  scrollY: React.MutableRefObject<number>;
}

function ParticleField({ count = 20000, mouse, scrollY }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  // Track mouse position with smoothing for more natural interaction
  const mousePosition = useRef<[number, number]>([0, 0]);
  // Track scroll velocity for momentum effects
  const scrollVelocity = useRef(0);
  const lastScrollY = useRef(0);
  
  // Memoize the generated points and colors so they don't change on each render
  const { positions, colors } = useMemo(() => generatePoints(count), [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    // Smooth mouse tracking
    mousePosition.current[0] += (mouse.current[0] - mousePosition.current[0]) * 0.05;
    mousePosition.current[1] += (mouse.current[1] - mousePosition.current[1]) * 0.05;
    
    // Calculate scroll velocity with smoothing
    const scrollDelta = scrollY.current - lastScrollY.current;
    scrollVelocity.current = scrollVelocity.current * 0.95 + scrollDelta * 0.05;
    lastScrollY.current = scrollY.current;
    
    // Base rotation - exactly as in original code
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.x = Math.sin(time * 0.03) * 0.2;
    pointsRef.current.rotation.y = Math.cos(time * 0.02) * 0.2;
    
    // Add scroll-based rotation on top
    const scrollInfluence = scrollY.current * Math.PI * 2;
    pointsRef.current.rotation.x += scrollInfluence * 0.2;
    pointsRef.current.rotation.y += scrollInfluence * 0.3;
    
    // Scale effect based on scroll velocity
    const scrollSpeed = Math.min(Math.abs(scrollVelocity.current) * 5, 0.5);
    const scaleBase = 1.0;
    const scaleFactor = scaleBase + Math.min(scrollSpeed * 0.07, 0.1);
    pointsRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
    
    // Apply wave effect with subtle mouse influence - exactly as in original code
    const positionArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < positionArray.length; i += 3) {
      const x = positionArray[i];
      const y = positionArray[i + 1];
      const z = positionArray[i + 2];
      
      // Calculate distance from mouse position in 3D space
      const dx = x - mousePosition.current[0] * 5; // Scale for better effect
      const dy = y - mousePosition.current[1] * 5;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Create a subtle attraction/repulsion effect
      const mouseFactor = Math.max(0, 1 - dist * 0.15);
      const attractionStrength = 0.02;
      
      // Apply gentle wave motion with mouse influence - exactly as in original code
      positionArray[i] = x + (mousePosition.current[0] * mouseFactor * attractionStrength);
      positionArray[i + 1] = y + Math.sin(time * 0.3 + x * 0.2) * 0.05 + (mousePosition.current[1] * mouseFactor * attractionStrength);
      
      // Add some vertical movement with subtle mouse influence - exactly as in original code
      positionArray[i + 2] = z + Math.cos(time * 0.2 + y * 0.1) * 0.03;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Add subtle tilt based on mouse position - exactly as in original code
    pointsRef.current.rotation.z += (mousePosition.current[0] * 0.1 - pointsRef.current.rotation.z) * 0.01;
    
    // Add camera effects based on scroll
    state.camera.position.y = -scrollY.current * 1;
    state.camera.lookAt(0, -scrollY.current * 1, 0);
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
        size={0.4}
        opacity={0.8}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function ThreeBackground({ intensity = 1, speed = 1 }: { intensity?: number; speed?: number }) {
  const mouse = useRef<[number, number]>([0, 0]);
  const scrollY = useRef(0);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    console.log('Three.js background initialized');
    
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to be between -1 and 1
      mouse.current = [
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      ];
    };
    
    const handleScroll = () => {
      // Normalize scroll position to create smooth transitions
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollY.current = window.scrollY / maxScroll;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!isClient) return null;

  return (
    <div className="three-bg-container">
      <Canvas 
      style={{background: '#060612'}}
      camera={{ position: [0, 0, 5], fov: 90 }}> {/* Increased FOV for wider view */}
        <ambientLight intensity={5 * intensity} /> {/* Multiplied by intensity prop */}
        <ParticleField mouse={mouse} scrollY={scrollY} count={Math.floor(20000 * speed)} /> {/* Adjusted count based on speed */}
        <fog attach="fog" args={['#0f0f1a', 10, 25]} /> {/* Adjusted fog for better depth perception */}
      </Canvas>
    </div>
  );
}