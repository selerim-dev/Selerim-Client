'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  return (
    <div 
      className="relative max-w-5xl mx-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Navigation Buttons */}
      <div className="absolute -left-16 top-1/2 -translate-y-1/2">
        <button
          onClick={prevTestimonial}
          className="rounded-full bg-white/10 p-3 backdrop-blur-sm hover:bg-white/20 transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeftIcon className="h-6 w-6 text-white" />
        </button>
      </div>
      <div className="absolute -right-16 top-1/2 -translate-y-1/2">
        <button
          onClick={nextTestimonial}
          className="rounded-full bg-white/10 p-3 backdrop-blur-sm hover:bg-white/20 transition-colors"
          aria-label="Next testimonial"
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
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.07] p-10 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl md:p-14">
            <div className="absolute left-8 top-6 text-7xl font-semibold leading-none text-white/10 md:text-8xl">
              &ldquo;
            </div>
            <div className="relative">
              <div className="mb-8 inline-flex rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/50">
                Client Perspective
              </div>
              <div className="flex-1 text-center md:text-left">
                <blockquote className="mb-8 text-2xl font-medium leading-relaxed text-white md:text-3xl">
                  {testimonials[currentIndex].quote}
                </blockquote>
                <div className="h-px w-full bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
                <div className="pt-6 text-white/80">
                  <p className="text-xl font-semibold tracking-tight">{testimonials[currentIndex].author}</p>
                  <p className="mt-1 text-base text-white/62 md:text-lg">
                    {testimonials[currentIndex].role}, {testimonials[currentIndex].company}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-3 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel; 
