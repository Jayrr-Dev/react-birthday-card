// app/components/InteractiveCard.tsx
'use client'

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Ensure all THREE.js operations are client-side only
if (typeof window !== 'undefined') {
  // This code will only run on the client
  THREE.ColorManagement.enabled = true;
}

const InteractiveCard = ({ 
  frontColor = "#ff6b8a", 
  backColor = "#ff9eb1",
  title = "Happy Birthday!",
  message = "Wishing you a wonderful day filled with joy and happiness!"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile for responsive adjustments
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Card constants
  const CARD_WIDTH = 3;
  const CARD_HEIGHT = 4;
  const CARD_OPEN_ANGLE = Math.PI * 0.7;
  
  // Card component with animation
  const Card = () => {
    const frontRef = useRef<THREE.Group>(null);
    const hoverRef = useRef(false);
    
    useFrame((state) => {
      if (!frontRef.current) return;
      
      // Target rotation based on isOpen state
      const targetRotation = isOpen ? CARD_OPEN_ANGLE : 0.01;
      
      // Smoothly animate to target rotation with easing
      frontRef.current.rotation.y = THREE.MathUtils.lerp(
        frontRef.current.rotation.y,
        targetRotation,
        0.05
      );
      
      // Add subtle hover animation when card is closed
      if (!isOpen && hoverRef.current) {
        frontRef.current.rotation.y = 0.1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
      }
    });
    
    return (
      <group>
        {/* Back of card (stationary) */}
        <mesh position={[0, 0, -0.05]} receiveShadow>
          <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
          <meshStandardMaterial color={backColor} />
        </mesh>
        
        {/* Inside of card */}
        <mesh position={[0, 0, -0.02]} receiveShadow>
          <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
          <meshStandardMaterial color="#ffffff" />
          
          {/* Inside title */}
          <Text
            position={[0, CARD_HEIGHT/3, 0.01]}
            fontSize={0.28}
            color={frontColor}
            font="/fonts/Geist-Medium.woff"
            anchorX="center"
            anchorY="middle"
            maxWidth={CARD_WIDTH * 0.8}
          >
            {title}
          </Text>
          
          {/* Inside message */}
          <Text
            position={[0, -0.5, 0.01]}
            fontSize={0.18}
            color="#333333"
            font="/fonts/Geist-Regular.woff"
            anchorX="center"
            anchorY="middle"
            maxWidth={CARD_WIDTH * 0.8}
            textAlign="center"
            lineHeight={1.5}
          >
            {message}
          </Text>
        </mesh>
        
        {/* Front of card (opens) */}
        <group 
          ref={frontRef} 
          position={[CARD_WIDTH/2, 0, 0]} 
          rotation={[0, 0.01, 0]}
          onClick={() => setIsOpen(!isOpen)}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer';
            hoverRef.current = true;
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
            hoverRef.current = false;
          }}
        >
          <mesh position={[-CARD_WIDTH/2, 0, 0]} castShadow>
            <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
            <meshStandardMaterial color={frontColor} />
            
            {/* Front text */}
            <Text
              position={[0, 0, 0.01]}
              fontSize={0.3}
              color="#ffffff"
              font="/fonts/Geist-Medium.woff"
              anchorX="center"
              anchorY="middle"
              maxWidth={CARD_WIDTH * 0.8}
            >
              {title}
            </Text>
          </mesh>
        </group>
      </group>
    );
  };
  
  // Create the confetti effect
  const Confetti = () => {
    const particles = useRef<THREE.Points>(null);
    const count = 200;
    const velocities = useRef<Float32Array | null>(null);
    
    // States for particle attributes
    const [positions, setPositions] = useState<Float32Array | null>(null);
    const [colors, setColors] = useState<Float32Array | null>(null);
    const [sizes, setSizes] = useState<Float32Array | null>(null);
    
    // Initialize all particle data on client-side only
    useEffect(() => {
      // Initialize velocities
      const newVelocities = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        newVelocities[i * 3] = (Math.random() - 0.5) * 0.05;      // x velocity
        newVelocities[i * 3 + 1] = -0.01 - Math.random() * 0.05;  // y velocity (falling)
        newVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.05;  // z velocity
      }
      velocities.current = newVelocities;
      
      // Create particle positions
      const newPositions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        newPositions[i * 3] = (Math.random() - 0.5) * 10;
        newPositions[i * 3 + 1] = 5 + Math.random() * 5;  // Start above the card
        newPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }
      setPositions(newPositions);
      
      // Create particle colors
      const newColors = new Float32Array(count * 3);
      const colorChoices = [
        [1, 0.3, 0.3],  // red
        [0.3, 0.3, 1],  // blue
        [1, 1, 0.3],    // yellow
        [0.3, 1, 0.3],  // green
        [1, 0.3, 1],    // purple
        [1, 0.6, 0.1]   // orange
      ];
      
      for (let i = 0; i < count; i++) {
        const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
        newColors[i * 3] = color[0];
        newColors[i * 3 + 1] = color[1];
        newColors[i * 3 + 2] = color[2];
      }
      setColors(newColors);
      
      // Create particle sizes for variation
      const newSizes = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        newSizes[i] = 0.05 + Math.random() * 0.15;
      }
      setSizes(newSizes);
    }, []);
    
    // Animate particles with physics
    useFrame((state) => {
      if (!particles.current || !positions || !velocities.current) return;
      
      const posArray = particles.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;
        
        // Apply velocity
        posArray[ix] += velocities.current[ix];
        posArray[iy] += velocities.current[iy];
        posArray[iz] += velocities.current[iz];
        
        // Add some horizontal drift with sine wave
        posArray[ix] += Math.sin(state.clock.getElapsedTime() + i) * 0.01;
        
        // Apply gravity to velocity
        velocities.current[iy] -= 0.0003;
        
        // Add rotation to make confetti looks more realistic
        velocities.current[ix] += Math.sin(i + state.clock.getElapsedTime()) * 0.0003;
        
        // Reset particles that fall below a certain point
        if (posArray[iy] < -5) {
          posArray[iy] = 10;
          posArray[ix] = (Math.random() - 0.5) * 10;
          posArray[iz] = (Math.random() - 0.5) * 10;
          velocities.current[iy] = -0.01 - Math.random() * 0.05;
        }
      }
      
      particles.current.geometry.attributes.position.needsUpdate = true;
    });
    
    // Don't render until all data is initialized
    if (!positions || !colors || !sizes) {
      return null;
    }
    
    return (
      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          transparent
          depthWrite={false}
          sizeAttenuation
          size={0.1}
        />
      </points>
    );
  };

  // Check if we're in the browser before rendering Three.js content
  const [isBrowser, setIsBrowser] = useState(false);
  
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  
  // Show a loading state if we're not in the browser yet
  if (!isBrowser) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gradient-to-b from-pink-100 to-pink-200 dark:from-pink-900 dark:to-purple-900">
        <div className="text-2xl text-pink-800 dark:text-pink-200">Preparing card...</div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-pink-100 to-pink-200 dark:from-pink-900 dark:to-purple-900">
      <Canvas dpr={[1, 2]} shadows>
        <PerspectiveCamera makeDefault position={[0, 0, isMobile ? 9 : 7]} />
        <ambientLight intensity={0.4} />
        <spotLight 
          position={[0, 5, 5]} 
          angle={0.3} 
          penumbra={1} 
          intensity={0.8} 
          castShadow
          shadow-mapSize={1024}
        />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        
        <Card />
        {isOpen && <Confetti />}
        
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
          minDistance={5}
          maxDistance={15}
        />
        
        {/* Add a simple environment for better lighting */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <shadowMaterial opacity={0.2} />
        </mesh>
      </Canvas>
      
      {/* Instruction overlay */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-white bg-black/30 py-2 px-4 mx-auto max-w-sm rounded-full backdrop-blur-sm">
        Click the card to {isOpen ? 'close' : 'open'} • Drag to rotate
      </div>
    </div>
  );
};

export default InteractiveCard;