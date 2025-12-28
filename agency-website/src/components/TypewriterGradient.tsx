'use client';

import React, { useEffect, useState } from 'react';

const words = ['website', 'mobile app', 'SaaS platform', 'web app'];

const gradientClass =
  'bg-gradient-to-r from-blue-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent';

const TypewriterGradient: React.FC = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayed.length < currentWord.length) {
      timeout = setTimeout(() => {
        setDisplayed(currentWord.slice(0, displayed.length + 1));
      }, 100);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => {
        setDisplayed(currentWord.slice(0, displayed.length - 1));
      }, 60);
    } else if (!isDeleting && displayed.length === currentWord.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1200);
    } else if (isDeleting && displayed.length === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }, 400);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, wordIndex]);

  // Use fixed pixel width to prevent layout shift - sized for "SaaS platform" at larger font size
  const minWidth = '400px'; // Fixed width to fully accommodate "SaaS platform" on one line

  return (
    <span 
      className={`${gradientClass} inline-block text-center whitespace-nowrap`} 
      style={{ 
        minWidth: minWidth,
        width: minWidth
      }}
    >
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
};

export default TypewriterGradient;