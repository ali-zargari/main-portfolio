'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Generate random points and colors in 3D space
function generatePoints(count: number) {
  const points = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scale = 12; // Reduced scale to make particles more concentrated
  const color = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    points[i3] = (Math.random() - 0.5) * scale;
    points[i3 + 1] = (Math.random() - 0.5) * scale;
    points[i3 + 2] = (Math.random() - 0.5) * scale;

    // Generate more vibrant colors with a gradient from cyan to purple
    const mixRatio = Math.random();
    color.setRGB(
      0.2 + mixRatio * 0.3,  // Red component - increased
      0.3 + mixRatio * 0.3,  // Green component - increased
      0.7 + mixRatio * 0.3   // Blue component - increased
    );

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

function ParticleField({ count = 8000, mouse }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  // Memoize the generated points and colors so they don't change on each render.
  const { positions, colors } = useMemo(() => generatePoints(count), [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    // Rotate the entire point cloud
    pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.05;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
    
    // Apply a subtle wave effect
    const positionArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.getElapsedTime();
    
    for (let i = 0; i < positionArray.length; i += 3) {
      const x = positionArray[i];
      const y = positionArray[i + 1];
      // Enhanced wave motion
      positionArray[i + 1] = y + Math.sin(time * 0.5 + x * 0.5) * 0.05;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Rotate based on mouse movement - enhanced effect
    if (mouse.current) {
      pointsRef.current.rotation.x += (mouse.current[1] * 0.001 - pointsRef.current.rotation.x) * 0.05;
      pointsRef.current.rotation.y += (mouse.current[0] * 0.001 - pointsRef.current.rotation.y) * 0.05;
    }
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
        size={0.15} // Increased particle size
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
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!isClient) return null;

  return (
    <div className="three-bg-container">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.8} /> {/* Increased light intensity */}
        <ParticleField mouse={mouse} />
      </Canvas>
    </div>
  );
}
