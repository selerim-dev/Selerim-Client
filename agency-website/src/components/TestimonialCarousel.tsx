'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  image?: string;
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
          <div className="relative bg-black/40 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {testimonials[currentIndex].image && (
                <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                  <Image
                    src={testimonials[currentIndex].image!}
                    alt={testimonials[currentIndex].author}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 text-center md:text-left">
                <blockquote className="text-2xl md:text-3xl font-medium text-white leading-relaxed mb-6">
                  "{testimonials[currentIndex].quote}"
                </blockquote>
                <div className="text-white/80">
                  <p className="text-xl font-semibold">{testimonials[currentIndex].author}</p>
                  <p className="text-lg">
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