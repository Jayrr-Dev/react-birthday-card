// app/card/client.tsx
'use client'

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Import the InteractiveCard component with dynamic loading (no SSR)
// This is necessary because Three.js needs the window object
const InteractiveCard = dynamic(
  () => import('../components/InteractiveCard'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-screen bg-gradient-to-b from-pink-100 to-pink-200 dark:from-pink-900 dark:to-purple-900">
        <div className="text-2xl text-pink-800 dark:text-pink-200">Loading 3D card...</div>
      </div>
    )
  }
);

export default function CardClient() {
  // Only render on client to avoid hydration issues
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gradient-to-b from-pink-100 to-pink-200 dark:from-pink-900 dark:to-purple-900">
        <div className="text-2xl text-pink-800 dark:text-pink-200">Loading 3D card...</div>
      </div>
    );
  }
  
  return (
    <InteractiveCard 
      title="Happy Birthday!" 
      message="Wishing you an amazing day filled with joy, laughter, and wonderful memories. Here's to celebrating you and all that makes you special!"
      frontColor="#ff6b8a"
      backColor="#ff9eb1"
    />
  );
}