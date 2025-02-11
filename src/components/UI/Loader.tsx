'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Loader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    show: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  const dotVariants = {
    hidden: {
      y: 0,
      opacity: 0,
      scale: 0,
    },
    show: {
      opacity: 1,
      scale: 1,
      y: [-20, 0],
      transition: {
        y: {
          repeat: Infinity,
          duration: 0.8,
          ease: "easeInOut",
        },
        opacity: {
          duration: 0.2,
        },
        scale: {
          duration: 0.4,
        },
      },
    },
  };

  const textVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#f3e0cc] flex flex-col items-center justify-center z-50"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        className="flex flex-col items-center gap-8"
      >
        <div className="relative">
          {/* Animated SVG Logo */}
          <motion.svg
            width="80"
            height="80"
            viewBox="0 0 100 100"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="#ffa620"
              strokeWidth="2"
              fill="none"
              variants={pathVariants}
            />
            <motion.path
              d="M30 50 L70 50"
              stroke="#422800"
              strokeWidth="3"
              fill="none"
              variants={pathVariants}
            />
          </motion.svg>
          
          {/* Animated Dots */}
          <div className="flex items-center gap-3 mt-24">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                variants={dotVariants}
                className="w-4 h-4 rounded-full bg-[#ffa620]"
                style={{
                  boxShadow: '0 4px 12px rgba(255, 166, 32, 0.3)',
                }}
              />
            ))}
          </div>
        </div>

        <motion.div
          variants={textVariants}
          className="text-[#422800] text-3xl font-bold titr mt-4"
          style={{
            textShadow: '0 2px 4px rgba(66, 40, 0, 0.1)',
          }}
        >
          میرزا
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Loader; 