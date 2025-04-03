// app/page.tsx
'use client'

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Import the card with no SSR to avoid hydration issues
const InteractiveCard = dynamic(
  () => import('./components/InteractiveCard'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-screen bg-gradient-to-b from-pink-100 to-pink-200 dark:from-pink-900 dark:to-purple-900">
        <div className="text-2xl text-pink-800 dark:text-pink-200">Loading your birthday card...</div>
      </div>
    )
  }
);

export default function Home() {
  // Use client-side only rendering to avoid hydration issues
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Set a small timeout to ensure DOM is fully loaded
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!mounted) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gradient-to-b from-pink-100 to-pink-200 dark:from-pink-900 dark:to-purple-900">
        <div className="text-2xl text-pink-800 dark:text-pink-200">Preparing your birthday card...</div>
      </div>
    );
  }
  
  return (
    <main>
      <InteractiveCard 
        title="Happy Birthday!" 
        message="Wishing you an amazing day filled with joy, laughter, and wonderful memories. Here's to celebrating you and all that makes you special!"
        frontColor="#ff6b8a"
        backColor="#ff9eb1"
      />
    </main>
  );
}