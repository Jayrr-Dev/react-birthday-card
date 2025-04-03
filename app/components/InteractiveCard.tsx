// app/components/InteractiveCard.tsx
'use client'

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// WebGL context recovery component
const ContextChecker = () => {
  const { gl } = useThree();
  
  useEffect(() => {
    // Listen for context lost events
    const handleContextLost = (event: Event) => {
      console.warn('WebGL context lost. Attempting to restore...');
      event.preventDefault();
    };
    
    // Listen for context restored events
    const handleContextRestored = () => {
      console.log('WebGL context restored.');
    };
    
    const canvas = gl.domElement;
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);
    
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl]);
  
  return null;
};

// Simple 3D birthday card with reduced complexity
const InteractiveCard = ({ 
  frontColor = "#ff6b8a", 
  backColor = "#ff9eb1",
  title = "Happy Birthday!",
  message = "Wishing you a wonderful day filled with joy and happiness!"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Only mount on client-side to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Define card dimensions
  const CARD_WIDTH = 3;
  const CARD_HEIGHT = 4;
  const CARD_OPEN_ANGLE = Math.PI * 0.7;
  
  // Card animation component - simple implementation
  const CardContent = () => {
    const frontRef = useRef<THREE.Group>(null);
    
    useFrame(() => {
      if (!frontRef.current) return;
      
      // Simple animation with reduced complexity
      const targetRotation = isOpen ? CARD_OPEN_ANGLE : 0.01;
      frontRef.current.rotation.y += (targetRotation - frontRef.current.rotation.y) * 0.08;
    });
    
    return (
      <group>
        <ContextChecker />
        
        {/* Back of card */}
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
          <meshStandardMaterial color={backColor} />
        </mesh>
        
        {/* Inside of card */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
          <meshStandardMaterial color="#ffffff" />
          
          {/* Inside text */}
          <Text
            position={[0, CARD_HEIGHT/3, 0.01]}
            fontSize={0.28}
            color={frontColor}
            anchorX="center"
            anchorY="middle"
          >
            {title}
          </Text>
          
          <Text
            position={[0, -0.5, 0.01]}
            fontSize={0.18}
            color="#333333"
            anchorX="center"
            anchorY="middle"
            maxWidth={CARD_WIDTH * 0.8}
            textAlign="center"
          >
            {message}
          </Text>
        </mesh>
        
        {/* Front of card */}
        <group 
          ref={frontRef} 
          position={[CARD_WIDTH/2, 0, 0]} 
          rotation={[0, 0.01, 0]}
          onClick={() => setIsOpen(!isOpen)}
          onPointerOver={() => {
            if (typeof document !== 'undefined') {
              document.body.style.cursor = 'pointer';
            }
          }}
          onPointerOut={() => {
            if (typeof document !== 'undefined') {
              document.body.style.cursor = 'auto';
            }
          }}
        >
          <mesh position={[-CARD_WIDTH/2, 0, 0]}>
            <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
            <meshStandardMaterial color={frontColor} />
            
            <Text
              position={[0, 0, 0.01]}
              fontSize={0.3}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {title}
            </Text>
          </mesh>
        </group>
      </group>
    );
  };
  
  // Loading state
  if (!mounted) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gradient-to-b from-pink-100 to-pink-200 dark:from-pink-900 dark:to-purple-900">
        <div className="text-2xl text-pink-800 dark:text-pink-200">Preparing card...</div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-pink-100 to-pink-200 dark:from-pink-900 dark:to-purple-900">
      <Canvas 
        dpr={[1, 1.5]} // Reduced DPR to decrease GPU load
        gl={{ 
          powerPreference: 'low-power', // Use low power mode
          antialias: true,
          alpha: false, // Disable alpha to save resources
          stencil: false, // Disable stencil to save resources
          depth: true
        }}
        style={{ background: 'transparent' }}
        frameloop="demand" // Only render when needed
      >
        <PerspectiveCamera makeDefault position={[0, 0, 7]} />
        <ambientLight intensity={0.4} />
        <spotLight position={[0, 5, 5]} angle={0.3} penumbra={1} intensity={0.5} />
        <CardContent />
        <OrbitControls 
          enableZoom={false} // Disable zoom to simplify interactions
          enablePan={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
          rotateSpeed={0.5} // Slow down rotation for better performance
        />
      </Canvas>
      
      {/* Instruction overlay */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-white bg-black/30 py-2 px-4 mx-auto max-w-sm rounded-full backdrop-blur-sm">
        Click the card to {isOpen ? 'close' : 'open'} • Drag to rotate
      </div>
    </div>
  );
};

export default InteractiveCard;