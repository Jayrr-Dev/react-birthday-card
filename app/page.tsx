'use client'

import React from 'react';
import dynamic from 'next/dynamic';

const EnhancedBirthdayCard = dynamic(() => import('./components/EnhancedBirthdayCard'), {
  ssr: true,
});

export default function Home() {
  return (
    <EnhancedBirthdayCard 
      frontColor="#000000"
      backColor="#000000"
      title="Happy 30th Birthday!"
      message="Dam dude. You're 30 now. That's crazy! You've come a long way... and you're killing it. Anyways, say hi to the fam for me. Have an amazing fucking day. Peace. Enjoy the gift."
      recipientName="Amilkhar"
      senderName="Sam"
    />
  );
}