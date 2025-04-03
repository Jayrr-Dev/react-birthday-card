'use client'

import React from 'react';
import dynamic from 'next/dynamic';

// Import the enhanced card component with dynamic loading
const EnhancedBirthdayCard = dynamic(() => import('../components/EnhancedBirthdayCard'), {
  ssr: true,
  loading: () => (
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-b from-pink-50 to-pink-100 dark:from-purple-950 dark:to-pink-900">
      <div className="text-2xl text-pink-800 dark:text-pink-200">Loading card...</div>
    </div>
  )
});

export default function Home() {
  return (
    <EnhancedBirthdayCard 
      frontColor="#ff6b8a"
      backColor="#ff9eb1"
      title="Happy 30th Birthday!"
      message="Wishing you an amazing day filled with joy, laughter, and wonderful memories. Here's to celebrating you and all that makes you special!"
      recipientName="Alex"
      senderName="Sarah"
    />
  );
}