'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import GiftEmailForm from './Gifter';

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
  frontColor = "#111111", // Dark black
  backColor = "#222222", // Dark gray
  innerColor = "#ffffff",
  title = "Happy Birthday!",
  message = "Wishing you a wonderful day filled with joy and happiness!",
  recipientName,
  senderName = "Your Friend",
  frontImageUrl = "",
  backImageUrl = "",
}) => {
  // Gold accent color - define this first, before any hooks
  const goldColor = "#D4AF37"; // Elegant gold color

  // All useState hooks must be called in the same order every render
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showInnerContent, setShowInnerContent] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Create memoized decorative elements that remain stable across renders
  const decorativeElements = useMemo(() => 
    Array.from({ length: 15 }).map((_, i) => {
      const variants = ['circle', 'square', 'triangle', 'star'];
      const type = variants[Math.floor(Math.random() * variants.length)];
      const size = Math.random() * 20 + 10;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 4;
      const duration = Math.random() * 10 + 10;
      
      return { id: i, type, size, x, y, delay, duration };
    }), []); // Empty dependency array means this only runs once
  
  // Create memoized confetti pieces
  const confettiPieces = useMemo(() => 
    Array.from({ length: 100 }).map((_, i) => {
      const x = Math.random() * 200 - 50; // Spread from -50% to 150% horizontally
      const delay = Math.random() * 0.5;
      const size = Math.random() * 15 + 5; // Larger size range
      const duration = Math.random() * 2 + 2; // Longer duration
      const colors = [goldColor, '#111111', '#FFFFFF', '#D4AF37', '#F5F5F5', '#222222', '#FFD700', '#000000', '#E5E5E5', '#BCA858'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      return { id: i, x, delay, size, duration, color };
    }), [goldColor]); // Only recompute if goldColor changes
  
  // Create memoized front side decorative circles
  const frontDecoCircles = useMemo(() => 
    Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      width: `${10 + Math.random() * 20}px`,
      height: `${10 + Math.random() * 20}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    })), []);
  
  // Create memoized back side decorative circles
  const backDecoCircles = useMemo(() => 
    Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      width: `${5 + Math.random() * 15}px`,
      height: `${5 + Math.random() * 15}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    })), []);

  // Ensure we're in the browser to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
    
    // Check if device is mobile
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add resize listener for responsive adjustments
    window.addEventListener('resize', checkIsMobile);
    
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
      window.removeEventListener('resize', checkIsMobile);
    };
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

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click originated from the gift button or its container
    // by checking if any parent element has the 'gift-button-container' class
    let target = e.target as HTMLElement;
    let isGiftClick = false;
    
    // Traverse up the DOM tree to check for gift button container
    while (target && target !== e.currentTarget) {
      if (target.classList.contains('gift-button-container') || 
          target.tagName.toLowerCase() === 'button') {
        isGiftClick = true;
        break;
      }
      target = target.parentElement as HTMLElement;
    }
    
    // Only toggle the card if the click wasn't on the gift button
    if (!isGiftClick) {
      toggleCard();
    }
  };

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
            backgroundColor: goldColor
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
            backgroundColor: goldColor
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
            borderBottom: `${element.size}px solid ${goldColor}`
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
            color: goldColor
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
      <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="text-2xl text-gray-300" style={{ fontFamily: "'Playfair Display', serif" }}>Loading your card...</div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center w-full min-h-screen overflow-hidden p-4">
     
      {/* Fixed black background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <img src="/Assets/Ghib Gym.png" alt="Background" className="w-full h-full object-cover blur-[4px]" />
      </div>

      {/* Fixed decorative elements container */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none blur-sm">
        {decorativeElements.map(renderDecorativeElement)}
      </div>

      <div className={`relative p-4 w-full max-w-lg ${isMobile ? 'scale-70' : 'scale-100'}`} style={{ perspective: '1500px', filter: 'blur(0)', zIndex: 10 }}>
        {/* Card Container */}
        <div 
          className="relative w-full aspect-[3/4] cursor-pointer mx-auto"
          style={{ 
            maxWidth: isMobile ? "600px" : "400px", 
            transformStyle: 'preserve-3d',
            perspective: '2000px',
            transformOrigin: 'center center' // Consistent transform origin
          }}
          aria-label={isOpen ? "Close birthday card" : "Open birthday card"}
          role="button"
          tabIndex={0}
          onClick={handleCardClick} // Changed from toggleCard to handleCardClick
        >
          {/* Card Back (Inside Content) */}
          <div 
            className="absolute inset-0 rounded-r-xl border-b-1 border-r-1 border-l-1 border-l-gray-900 border-gray-500 shadow-lg"
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
                  className={`p-8 text-center h-full flex flex-col justify-center items-center ${isMobile ? 'p-4' : 'p-8'}`}
                  style={{ color: goldColor }} // Gold text color
                >
                  <motion.div
                    className="space-y-6 w-full max-w-sm mx-auto"
                  >
                    <motion.h2 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className={`${isMobile ? 'text-3xl mb-4' : 'text-4xl mb-8'}`}
                      style={{ 
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                        letterSpacing: '0.03em',
                        textTransform: 'uppercase',
                        lineHeight: 1.2
                      }}
                    >
                      {title}
                    </motion.h2>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className={`${isMobile ? 'text-lg mb-4' : 'text-xl mb-8'}`}
                      style={{ 
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 300,
                        lineHeight: 1.6,
                        letterSpacing: '0.01em'
                      }}
                    >
                      <p className="mb-4" style={{ fontStyle: 'italic' }}>{message}</p>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className={`pt-6 border-t w-full mt-auto ${isMobile ? 'pt-4' : 'pt-6'}`}
                      style={{
                        borderColor: `${goldColor}40`,
                        fontFamily: "'Montserrat', sans-serif",
                        letterSpacing: '0.05em',
                      }}
                    >
                      {recipientName && (
                        <p className={`${isMobile ? 'text-base mb-1' : 'text-lg mb-2'}`} style={{ fontWeight: 300 }}>
                          To: {recipientName}
                        </p>
                      )}

                      <p
                        className={`italic ${isMobile ? 'text-base' : 'text-lg'}`}
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        From: {senderName}
                      </p>

                      {/* Gift button container - ADD onClick here */}
                      <div
                        className="flex items-center justify-center mt-4 gift-button-container"
                        // Add this onClick handler to stop propagation
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Dialog>
                          <DialogTrigger>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="relative cursor-pointer"
                            >
                              <img
                                src="/Assets/gift.png"
                                alt="Gift"
                                className={`animate-wiggle hover:animate-wiggle-more animate-infinite z-100 ${isMobile ? 'w-16 h-16' : 'w-20 h-20'}`}
                              />
                            </motion.div>
                          </DialogTrigger>
                          <DialogContent className={`${isMobile ? 'w-[95vw] max-w-lg p-4' : ''}`}>
                            <DialogHeader>
                              <DialogTitle
                                style={{
                                  fontFamily: "'Playfair Display', serif",
                                  color: goldColor,
                                  fontSize: isMobile ? '1.25rem' : '1.5rem',
                                }}
                              >
                                A FREE WEBSITE VOUCHER!
                              </DialogTitle>
                              <DialogDescription
                                style={{
                                  fontFamily: "'Cormorant Garamond', serif",
                                  fontSize: isMobile ? '1rem' : '1.1rem',
                                }}
                              >
                                Claim this voucher, and I'll build you any website or webapp you want. Free of charge.
                                Meaning I'll host it, and build it for you. I'll even grab a reasonably priced domain name for you if you don't have one already. 
                                Just send me the details of your dream site to make it real.  
                                <br></br>
                                <br></br>
                                <div className="text-sm text-gray-500">
                                  Important - This voucher is valid for 10 years from the date of 3rd April 2025 and can be transferred to a friend or family member.
                                </div>
                              </DialogDescription>
                            </DialogHeader>
                            <div className="p-4 flex justify-center">
                              <GiftEmailForm />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Card Front (flips open) */}
          <motion.div 
            className="absolute inset-0 rounded-l-xl shadow-lg"
            style={{ 
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              zIndex: 20,
              transformOrigin: 'left center',
            }}
            initial={false}
            animate={{ 
              rotateY: isOpen ? -179 : 0, // Use -179 for full rotation
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
            <div className="w-full h-full border-r-2 border-b-1 border-gray-400 rounded-r-xl " style={{ transformStyle: 'preserve-3d' }}>
              {/* Front Side Content - visible when card is closed */}
              <div 
                className="absolute inset-0 rounded-r-xl overflow-hidden"
                style={{
                  backgroundColor: frontColor,
                  backgroundImage: frontImageUrl ? `url(${frontImageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden'
                }}
              >
                
                <div className="text-center p-6 w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
                     style={{ color: goldColor }} // Gold text color
                >
                  {/* Card border */}
                  <div className="absolute inset-4 border-4 rounded-l-xl pointer-events-none"
                       style={{ borderColor: `${goldColor}40` }} // Gold border with transparency
                  ></div>
                  
                  {/* Decorative pattern background with stable circles */}
                  <div className="absolute inset-0 opacity-20">
                    {frontDecoCircles.map((circle) => (
                      <div 
                        key={circle.id}
                        className="absolute rounded-full"
                        style={{
                          width: circle.width,
                          height: circle.height,
                          top: circle.top,
                          left: circle.left,
                          backgroundColor: goldColor, // Gold accent
                          opacity: 0.3,
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
                    {/* Birthday cake icon (gold color) */}
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2,
                        ease: "easeInOut" 
                      }}
                      style={{ color: goldColor }} // Gold color for icon
                      className={`mb-6 flex items-center justify-center ${isMobile ? 'mb-4' : 'mb-6'}`}
                    >
                      <img src="/Assets/cake.png" alt="Cake" className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'}`} />
                    </motion.div>
                    
                    <h1 
                      className={`mb-2 ${isMobile ? 'text-3xl' : 'text-4xl'}`}
                      style={{ 
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                      }}
                    >
                      {title}
                    </h1>
                    
                    {/* Animated decorative flourish */}
                    <motion.div 
                      className="flex items-center justify-center space-x-3 mx-auto mt-2 mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 1 }}
                    >
                      <motion.div 
                        className="h-px rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: isMobile ? "24px" : "32px" }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        style={{ backgroundColor: goldColor }}
                      />
                      <div 
                        className={`${isMobile ? 'text-base' : 'text-lg'}`}
                        style={{ 
                          transform: 'rotate(0deg)', 
                          color: goldColor,
                          fontFamily: "'Cormorant Garamond', serif"
                        }}
                      >✦</div>
                      <motion.div 
                        className="h-px rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: isMobile ? "24px" : "32px" }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        style={{ backgroundColor: goldColor }}
                      />
                    </motion.div>
                    
                    {recipientName && (
                      <motion.p 
                        className={`mt-4 ${isMobile ? 'text-lg' : 'text-xl'}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        style={{ 
                          fontFamily: "'Montserrat', sans-serif",
                          fontWeight: 300,
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase'
                        }}
                      >
                        {recipientName}
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
                      style={{ color: goldColor }} // Gold color for text
                      className={`absolute ${isMobile ? 'bottom-6' : 'bottom-8'}`}
                    >
                      <p 
                        className={`mb-2 ${isMobile ? 'text-base' : 'text-lg'}`}
                        style={{ 
                          fontFamily: "'Montserrat', sans-serif",
                          fontWeight: 300,
                          letterSpacing: '0.1em'
                        }}
                      >
                        Tap to open
                      </p>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width={isMobile ? "20" : "24"} 
                        height={isMobile ? "20" : "24"} 
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
                  
                  {/* Decorative elements - gold */}
                  <motion.div 
                    className={`absolute ${isMobile ? 'top-4 left-4' : 'top-6 left-6'}`}
                    style={{ color: `${goldColor}90` }} // Gold with slight transparency
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <svg width={isMobile ? "30" : "40"} height={isMobile ? "30" : "40"} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
                    </svg>
                  </motion.div>
                  
                  <motion.div 
                    className={`absolute ${isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'}`}
                    style={{ color: `${goldColor}90` }} // Gold with slight transparency
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  >
                    <svg width={isMobile ? "24" : "30"} height={isMobile ? "24" : "30"} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
                    </svg>
                  </motion.div>
                  
                  {/* Corner decorations - gold */}
                  <div className={`absolute top-0 left-0 overflow-hidden ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`}>
                    <div className={`absolute transform rotate-45 ${isMobile ? 'w-12 h-12 -top-6 -left-6' : 'w-16 h-16 -top-8 -left-8'}`}
                         style={{ backgroundColor: `${goldColor}30` }} // Gold with transparency
                    ></div>
                  </div>
                  
                  <div className={`absolute bottom-0 right-0 overflow-hidden ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`}>
                    <div className={`absolute transform rotate-45 ${isMobile ? 'w-12 h-12 -bottom-6 -right-6' : 'w-16 h-16 -bottom-8 -right-8'}`}
                         style={{ backgroundColor: `${goldColor}30` }} // Gold with transparency
                    ></div>
                  </div>
                </div>
              </div>

              {/* Back Side Content - visible when card is opened */}
              <div 
                className="absolute inset-0 rounded-l-xl overflow-hidden"
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
                {/* Background frame image */}
                <img 
                  src="/Assets/framed.png" 
                  alt="Decorative frame" 
                  className={`absolute inset-0 w-full h-full object-cover z-0 scale-90 `}
                />
                <div className={`text-center w-full h-full flex flex-col items-center justify-center relative overflow-hidden ${isMobile ? 'p-4' : 'p-6'}`}
                     style={{ color: goldColor }} // Gold text color
                >
                  
                  {/* Back side decorative elements */}
                  <div className="absolute inset-4 border-4 rounded-l-xl pointer-events-none"
                       style={{ borderColor: `${goldColor}40` }} // Gold border with transparency
                  ></div>
                  
                  {/* Decorative pattern background with stable circles */}
                  <div className="absolute inset-0 opacity-20">
                    {backDecoCircles.map((circle) => (
                      <div 
                        key={circle.id}
                        className="absolute rounded-full"
                        style={{
                          width: circle.width,
                          height: circle.height,
                          top: circle.top,
                          left: circle.left,
                          backgroundColor: goldColor, // Gold color
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Simple decorative content for the back */}
                  <div 
                    className={`opacity-70 ${isMobile ? 'text-2xl' : 'text-3xl'}`}
                    style={{ 
                      color: goldColor,
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 400,
                      fontStyle: 'italic',
                      letterSpacing: '0.02em'
                    }}
                  >
                    
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Confetti Animation */}
          <AnimatePresence>
            {showConfetti && (
              <div className="fixed inset-0 pointer-events-none z-30">
                {confettiPieces.map((piece) => (
                  <motion.div
                    key={piece.id}
                    initial={{ 
                      y: -50, 
                      x: `${piece.x*3}px`,
                      opacity: 1,
                      scale: 0
                    }}
                    animate={{ 
                      y: '120vh', 
                      x: `calc(${piece.x}% + ${(Math.random() - 0.5) * (isMobile ? 100 : 200)}px)`,
                      opacity: [1, 1, 0.7, 0],
                      rotate: Math.random() * 720 * (Math.random() > 0.5 ? 1 : -1),
                      scale: [0, 1, 0.8]
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
                      width: isMobile ? piece.size * 0.7 : piece.size,
                      height: (isMobile ? piece.size * 0.7 : piece.size) * (Math.random() * 2 + 1),
                      backgroundColor: piece.color,
                      borderRadius: Math.random() > 0.3 ? '50%' : Math.random() > 0.5 ? '0%' : '30%',
                      zIndex: 9999
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
          className={`mt-8 text-center text-sm py-2 px-4 rounded-full shadow-md mx-auto w-fit ${isMobile ? 'text-xs py-1 px-3 mt-6' : 'text-sm py-2 px-4 mt-8'}`}
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.7)', 
            color: goldColor,
            backdropFilter: 'blur(4px)',
            border: `1px solid ${goldColor}50`, // Gold border with transparency
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: '0.05em',
            fontWeight: 300
          }}
        >
          {isOpen ? "Click card to close" : "Click card to open"}
        </motion.div>
      </div>
    </div>
  );
};


export default EnhancedBirthdayCard;