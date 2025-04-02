// app/page.tsx
'use client'

import React from 'react';
import dynamic from 'next/dynamic';

const InteractiveCard = dynamic(
  () => import('./components/InteractiveCard'),
  { ssr: false }
);

export default function CardPage() {  
  return (
    <div>
      "empty"
    </div>
  );
}
