'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BirthdayCardProps {
  frontColor?: string;
  backColor?: string;
  innerColor?: string;
  title?: string;
  message?: string;
  recipientName?: string;
  senderName?: string;
  frontImageUrl?: string;
  backImageUrl?: string;
}

const EnhancedBirthdayCard: React.FC<BirthdayCardProps> = ({
  frontColor = "#ff6b8a",
  backColor = "#ff9eb1",
  innerColor = "#ffffff",
  title = "Happy Birthday!",
  message = "Wishing you a wonderful day filled with joy and happiness!",
  recipientName,
  senderName = "Your Friend",
  frontImageUrl = "",
  backImageUrl = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  // Add a new state to control inner content visibility
  const [showInnerContent, setShowInnerContent] = useState(false);
  // Add a state to prevent double-toggling
  const [isAnimating, setIsAnimating] = useState(false);

  // Ensure we're in the browser to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleCard = () => {
    // Prevent multiple rapid clicks
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (!isOpen) {
      // Opening the card
      setIsOpen(true);
      setHasInteracted(true);
      
      // Play confetti when opening
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      // Show inner content after a delay to match the animation
      setTimeout(() => {
        setShowInnerContent(true);
        setIsAnimating(false);
      }, 400);
      
      // Add haptic feedback on supported devices
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    } else {
      // Immediately hide inner content when closing begins
      setShowInnerContent(false);
      
      // Wait for content to fully hide before starting card close animation
      setTimeout(() => {
        setIsOpen(false);
        
        // Only release animation lock after card is fully closed
        setTimeout(() => {
          setIsAnimating(false);
        }, 500);
      }, 300);
    }
  };

  // Create random confetti pieces
  const confettiPieces = Array.from({ length: 60 }).map((_, i) => {
    const x = Math.random() * 100;
    const delay = Math.random() * 0.5;
    const size = Math.random() * 10 + 5;
    const duration = Math.random() * 1 + 1.5;
    const colors = ['#FFC700', '#FF0080', '#00FFFF', '#7928CA', '#FF4D4D', '#00F2EA'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    return { id: i, x, delay, size, duration, color };
  });

  // Create decorative elements
  const decorativeElements = Array.from({ length: 15 }).map((_, i) => {
    const variants = ['circle', 'square', 'triangle', 'star'];
    const type = variants[Math.floor(Math.random() * variants.length)];
    const size = Math.random() * 20 + 10;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 4;
    const duration = Math.random() * 10 + 10;
    
    return { id: i, type, size, x, y, delay, duration };
  });

  const renderDecorativeElement = (element: any) => {
    if (element.type === 'circle') {
      return (
        <motion.div
          key={element.id}
          className="absolute rounded-full opacity-20"
          style={{ 
            width: element.size, 
            height: element.size, 
            left: `${element.x}%`, 
            top: `${element.y}%`,
            backgroundColor: frontColor
          }}
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
            rotate: 360
          }}
          transition={{
            repeat: Infinity,
            duration: element.duration,
            delay: element.delay,
            ease: "easeInOut"
          }}
        />
      );
    }
    
    if (element.type === 'square') {
      return (
        <motion.div
          key={element.id}
          className="absolute opacity-20"
          style={{ 
            width: element.size, 
            height: element.size, 
            left: `${element.x}%`, 
            top: `${element.y}%`,
            backgroundColor: backColor
          }}
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            repeat: Infinity,
            duration: element.duration,
            delay: element.delay,
            ease: "linear"
          }}
        />
      );
    }
    
    if (element.type === 'triangle') {
      return (
        <motion.div
          key={element.id}
          className="absolute opacity-20"
          style={{ 
            width: 0, 
            height: 0, 
            left: `${element.x}%`, 
            top: `${element.y}%`,
            borderLeft: `${element.size/2}px solid transparent`,
            borderRight: `${element.size/2}px solid transparent`,
            borderBottom: `${element.size}px solid ${frontColor}`
          }}
          animate={{
            rotate: 360,
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            repeat: Infinity,
            duration: element.duration,
            delay: element.delay,
            ease: "easeInOut"
          }}
        />
      );
    }
    
    if (element.type === 'star') {
      return (
        <motion.div
          key={element.id}
          className="absolute text-center opacity-20"
          style={{ 
            fontSize: element.size, 
            left: `${element.x}%`, 
            top: `${element.y}%`,
            color: backColor
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.5, 0.2],
            rotate: 360
          }}
          transition={{
            repeat: Infinity,
            duration: element.duration,
            delay: element.delay,
            ease: "easeInOut"
          }}
        >
          ★
        </motion.div>
      );
    }
    
    return null;
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 dark:from-purple-950 dark:to-pink-900">
        <div className="text-2xl text-pink-600 dark:text-pink-300">Loading your card...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 dark:from-purple-950 dark:to-pink-900 overflow-hidden p-4">
      {/* Background decorative elements - reduced number for better performance */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {decorativeElements.map(renderDecorativeElement)}
      </div>
      
      <div className="relative p-4 w-full max-w-lg" style={{ perspective: '1500px' }}>
        {/* Card Container */}
        <div 
          className="relative w-full aspect-[3/4] cursor-pointer mx-auto"
          style={{ 
            maxWidth: "400px", 
            transformStyle: 'preserve-3d',
            perspective: '2000px',
            transformOrigin: 'center center' // Consistent transform origin
          }}
          aria-label={isOpen ? "Close birthday card" : "Open birthday card"}
          role="button"
          tabIndex={0}
          onClick={toggleCard}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleCard();
            }
          }}
        >
          {/* Card Back (Inside Content) */}
          <div 
            className="absolute inset-0 rounded-xl shadow-lg"
            style={{ 
              backgroundColor: backColor,
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              zIndex: 10,
              left: '0',
              boxShadow: isOpen ? '-5px 0 15px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            {/* Use AnimatePresence for smoothly showing/hiding inner content */}
            <AnimatePresence mode="wait">
              {showInnerContent && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 text-white text-center h-full flex flex-col justify-center items-center"
                >
                  <motion.div
                    className="space-y-6 w-full max-w-sm mx-auto"
                  >
                    <motion.h2 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-4xl font-bold mb-8"
                    >
                      {title}
                    </motion.h2>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-xl mb-8 leading-relaxed"
                    >
                      <p className="mb-4">{message}</p>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="pt-6 border-t border-white/20 w-full mt-auto"
                    >
                      {recipientName && (
                        <p className="text-lg mb-2">To: {recipientName}</p>
                      )}
                      
                      <p className="text-lg italic">
                        From: {senderName}
                      </p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Card Front (flips open) */}
          <motion.div 
            className="absolute inset-0 rounded-xl shadow-lg"
            style={{ 
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              zIndex: 20,
              transformOrigin: 'left center',
            }}
            initial={false}
            animate={{ 
              rotateY: isOpen ? -179 : 0, // Use -160 instead of -179 for smoother animation
            }}
            transition={{ 
              type: "spring", 
              stiffness: 65,
              damping: 17
            }}
            whileHover={!isOpen ? { scale: 1.02 } : {}}
            whileTap={!isOpen ? { scale: 0.98 } : {}}
          >
            {/* This is a card wrapper with two sides */}
            <div className="w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
              {/* Front Side Content - visible when card is closed */}
              <div 
                className="absolute inset-0 rounded-xl overflow-hidden"
                style={{
                  backgroundColor: frontColor,
                  backgroundImage: frontImageUrl ? `url(${frontImageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden'
                }}
              >
                <div className="text-center text-white p-6 w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Card border */}
                  <div className="absolute inset-4 border-4 border-white/30 rounded-lg pointer-events-none"></div>
                  
                  {/* Decorative pattern background */}
                  <div className="absolute inset-0 opacity-20">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div 
                        key={i}
                        className="absolute rounded-full bg-white/40"
                        style={{
                          width: `${10 + Math.random() * 20}px`,
                          height: `${10 + Math.random() * 20}px`,
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Main content */}
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 mb-6"
                  >
                    {/* Birthday cake icon */}
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2,
                        ease: "easeInOut" 
                      }}
                      className="text-white mb-6"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="60" 
                        height="60" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="mx-auto"
                      >
                        <path d="M20 10h-2V8a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2z"/>
                        <path d="M12 4c0-1 .44-2 1-2a1 1 0 0 1 1 1"/>
                        <path d="M18 10c0-1 .44-2 1-2a1 1 0 0 1 1 1"/>
                        <path d="M6 10c0-1 .44-2 1-2a1 1 0 0 1 1 1"/>
                      </svg>
                    </motion.div>
                    
                    <h1 className="text-4xl font-bold mb-2">{title}</h1>
                    
                    {/* Animated underline */}
                    <motion.div 
                      className="h-1 bg-white/70 rounded-full mx-auto mt-2 mb-6"
                      initial={{ width: 0 }}
                      animate={{ width: "60px" }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                    />
                    
                    {recipientName && (
                      <motion.p 
                        className="text-xl mt-4 font-light"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        For: {recipientName}
                      </motion.p>
                    )}
                  </motion.div>
                  
                  {!hasInteracted && (
                    <motion.div 
                      animate={{ y: [0, -5, 0], opacity: [0.7, 1, 0.7] }} 
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1.5,
                        ease: "easeInOut" 
                      }}
                      className="text-white/90 absolute bottom-8"
                    >
                      <p className="text-lg font-light mb-2">Tap to open</p>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="mx-auto"
                      >
                        <path d="M12 19V5" />
                        <path d="m5 12 7 7 7-7" />
                      </svg>
                    </motion.div>
                  )}
                  
                  {/* Decorative elements */}
                  <motion.div 
                    className="absolute top-6 left-6 text-white/60"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
                    </svg>
                  </motion.div>
                  
                  <motion.div 
                    className="absolute bottom-6 right-6 text-white/60"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  >
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
                    </svg>
                  </motion.div>
                  
                  {/* Corner decorations */}
                  <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden">
                    <div className="absolute transform rotate-45 bg-white/20 w-16 h-16 -top-8 -left-8"></div>
                  </div>
                  
                  <div className="absolute bottom-0 right-0 w-16 h-16 overflow-hidden">
                    <div className="absolute transform rotate-45 bg-white/20 w-16 h-16 -bottom-8 -right-8"></div>
                  </div>
                </div>
              </div>

              {/* Back Side Content - visible when card is opened */}
              <div 
                className="absolute inset-0 rounded-xl overflow-hidden"
                style={{
                  backgroundColor: frontColor, // Same color as front
                  backgroundImage: backImageUrl ? `url(${backImageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: 'rotateY(180deg)',
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden'
                }}
              >
                <div className="text-center text-white p-6 w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Back side decorative elements */}
                  <div className="absolute inset-4 border-4 border-white/30 rounded-lg pointer-events-none"></div>
                  
                  {/* Decorative pattern background */}
                  <div className="absolute inset-0 opacity-20">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div 
                        key={i}
                        className="absolute rounded-full bg-white/40"
                        style={{
                          width: `${5 + Math.random() * 15}px`,
                          height: `${5 + Math.random() * 15}px`,
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Simple decorative content for the back */}
                  <div className="text-3xl font-bold opacity-30">
                    ♥
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Confetti Animation */}
          <AnimatePresence>
            {showConfetti && (
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-30">
                {confettiPieces.map((piece) => (
                  <motion.div
                    key={piece.id}
                    initial={{ 
                      y: -20, 
                      x: `${piece.x}%`,
                      opacity: 1,
                      scale: 0
                    }}
                    animate={{ 
                      y: '120vh', 
                      x: `calc(${piece.x}% + ${(Math.random() - 0.5) * 100}px)`,
                      opacity: [1, 1, 0.5, 0],
                      rotate: Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1),
                      scale: 1
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: piece.duration,
                      delay: piece.delay,
                      ease: "easeOut"
                    }}
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: piece.size,
                      height: piece.size * (Math.random() * 2 + 1),
                      backgroundColor: piece.color,
                      borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Better Instructions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-gray-600 dark:text-gray-300 text-sm bg-white/20 dark:bg-black/20 backdrop-blur-sm py-2 px-4 rounded-full shadow-md mx-auto w-fit"
        >
          {isOpen ? "Click card to close" : "Click card to open"}
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedBirthdayCard;