'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Generate random points in a 3D space
function generatePoints(count: number) {
  const points = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const scale = 25; // Even larger scale
  const color = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    points[i3] = (Math.random() - 0.5) * scale;
    points[i3 + 1] = (Math.random() - 0.5) * scale;
    points[i3 + 2] = (Math.random() - 0.5) * scale * 0.5; // Flatter on z-axis

    // Generate much brighter colors
    const mixRatio = Math.random();
    const hue = 0.6 + mixRatio * 0.2; // Blue to purple range
    const saturation = 0.9; // More saturated
    const lightness = 0.7 + mixRatio * 0.3; // Even brighter
    
    color.setHSL(hue, saturation, lightness);
    
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
    
    // Vary the size of particles for more visual interest
    sizes[i] = Math.random() * 0.5 + 0.5; // Between 0.5 and 1.0
  }

  return { positions: points, colors, sizes };
}

interface ParticleFieldProps {
  count?: number;
  mouse: React.MutableRefObject<[number, number]>;
}

function ParticleField({ count = 20000, mouse }: ParticleFieldProps) { // Even more particles
  const pointsRef = useRef<THREE.Points>(null!);
  const { positions, colors, sizes } = generatePoints(count);
  const [time, setTime] = useState(0);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    setTime(state.clock.getElapsedTime());
    
    // More dramatic rotation
    pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
    
    // More dramatic wave effect
    const positionArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.getElapsedTime();
    
    for (let i = 0; i < positionArray.length; i += 3) {
      const x = positionArray[i];
      const y = positionArray[i + 1];
      // Much stronger wave motion
      positionArray[i + 1] = y + Math.sin(time * 0.3 + x * 0.2) * 0.15;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Even more responsive mouse movement
    if (mouse.current) {
      pointsRef.current.rotation.x += (mouse.current[1] * 0.002 - pointsRef.current.rotation.x) * 0.15;
      pointsRef.current.rotation.y += (mouse.current[0] * 0.002 - pointsRef.current.rotation.y) * 0.15;
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
      {/* Attach the sizes as a buffer attribute */}
      <bufferAttribute
        attach="attributes.size"
        args={[sizes, 1]}
        count={sizes.length}
        itemSize={1}
      />
      <PointMaterial
        transparent
        vertexColors
        size={0.6} // Even larger point size
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        alphaMap={new THREE.TextureLoader().load('/particle.png')}
      />
    </Points>
  );
}

export default function ThreeBackground() {
  const mouse = useRef<[number, number]>([0, 0]);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
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
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 3], fov: 90 }}>
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 1, 25]} />
        <ambientLight intensity={1.5} />
        <ParticleField mouse={mouse} />
      </Canvas>
    </div>
  );
}
