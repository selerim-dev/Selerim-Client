"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export interface SuccessStory {
  name: string;
  logo: string;
  description: string;
  highlights: string[];
}

interface SuccessStoriesCarouselProps {
  stories: SuccessStory[];
}

const SuccessStoriesCarousel: React.FC<SuccessStoriesCarouselProps> = ({ stories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % stories.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, stories.length]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const nextStory = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % stories.length);
    setIsAutoPlaying(false);
  };

  const prevStory = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + stories.length) % stories.length);
    setIsAutoPlaying(false);
  };

  return (
    <div
      className="relative max-w-4xl mx-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Navigation Buttons - spaced further out */}
      <div className="hidden md:block absolute -left-28 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={prevStory}
          className="rounded-full bg-white/10 p-4 md:p-5 backdrop-blur-sm hover:bg-white/20 transition-colors"
          aria-label="Previous story"
        >
          <ChevronLeftIcon className="h-8 w-8 text-white" />
        </button>
      </div>
      <div className="hidden md:block absolute -right-28 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={nextStory}
          className="rounded-full bg-white/10 p-4 md:p-5 backdrop-blur-sm hover:bg-white/20 transition-colors"
          aria-label="Next story"
        >
          <ChevronRightIcon className="h-8 w-8 text-white" />
        </button>
      </div>
      {/* Mobile arrows closer in */}
      <div className="md:hidden absolute -left-6 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={prevStory}
          className="rounded-full bg-white/10 p-3 backdrop-blur-sm hover:bg-white/20 transition-colors"
          aria-label="Previous story"
        >
          <ChevronLeftIcon className="h-6 w-6 text-white" />
        </button>
      </div>
      <div className="md:hidden absolute -right-6 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={nextStory}
          className="rounded-full bg-white/10 p-3 backdrop-blur-sm hover:bg-white/20 transition-colors"
          aria-label="Next story"
        >
          <ChevronRightIcon className="h-6 w-6 text-white" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative"
        >
          <div className="relative bg-black/40 backdrop-blur-sm rounded-3xl p-8 md:p-20 border border-white/10 shadow-2xl flex flex-col items-center">
            <div className="w-28 h-28 md:w-40 md:h-40 bg-white/10 rounded-xl flex items-center justify-center overflow-hidden mb-8">
              <Image
                src={stories[currentIndex].logo}
                alt={stories[currentIndex].name + ' logo'}
                width={160}
                height={160}
                className="object-contain w-full h-full"
              />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 text-center drop-shadow">{stories[currentIndex].name}</h2>
            <p className="text-lg md:text-2xl text-white/80 mb-8 text-center max-w-2xl">{stories[currentIndex].description}</p>
            <ul className="flex flex-wrap gap-4 justify-center mb-2">
              {stories[currentIndex].highlights.map((h, i) => (
                <li
                  key={i}
                  className="inline-block bg-blue-400/20 text-blue-200 text-base md:text-xl font-medium rounded-full px-5 py-2"
                >
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-3 mt-10">
        {stories.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white scale-125'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to story ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SuccessStoriesCarousel; 