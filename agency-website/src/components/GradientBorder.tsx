'use client';

import React from 'react';
import { cn } from '../lib/utils';

interface GradientBorderProps {
  children: React.ReactNode;
  className?: string;
  hoverIntensity?: 'low' | 'medium' | 'high';
  baseOpacity?: number;
  hoverOpacity?: number;
}

export default function GradientBorder({
  children,
  className = '',
  hoverIntensity = 'medium',
  baseOpacity = 0.3,
  hoverOpacity = 1,
}: GradientBorderProps) {
  const getHoverDuration = () => {
    switch (hoverIntensity) {
      case 'low':
        return 'duration-500';
      case 'high':
        return 'duration-200';
      default:
        return 'duration-300';
    }
  };

  return (
    <div className={cn('relative group transform hover:scale-[1.02] transition duration-300 h-full', className)}>
      <div 
        className={cn(
          'absolute -inset-[1.5px] bg-gradient-to-r from-blue-400 via-fuchsia-400 to-pink-400 rounded-3xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none',
          'bg-[length:200%_200%] bg-[position:0%_50%]',
          getHoverDuration(),
          'group-hover:duration-200',
          'group-hover:shadow-[0_0_32px_8px_rgba(236,72,153,0.4)]'
        )}
        style={{
          opacity: baseOpacity,
          '--hover-opacity': hoverOpacity,
        } as React.CSSProperties}
      />
      <div className="relative h-full glass-card overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
} 