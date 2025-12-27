'use client';

import React from 'react';

export interface CompanyLogo {
  src: string;
  alt: string;
  href: string;
}

interface Props {
  logos: CompanyLogo[];
}

const CompanyLogosCarousel: React.FC<Props> = ({ logos }) => {
  // Duplicate the logos for seamless looping
  const displayLogos = [...logos, ...logos];

  return (
    <div className="w-full overflow-hidden py-8 bg-[#232323]">
      <div className="relative">
        <div
          className="flex gap-24 items-center animate-carousel"
          style={{
            animation: 'carousel-scroll 30s linear infinite',
          }}
        >
          {displayLogos.map((logo, idx) => (
            <a
              key={idx}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity"
              style={{ display: 'flex', alignItems: 'center', height: 80 }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                style={{
                  height: 64,
                  width: 'auto',
                  maxWidth: 220,
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)',
                  transition: 'transform 0.2s',
                }}
              />
            </a>
          ))}
        </div>
      </div>
      <style jsx global>{`
        @keyframes carousel-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-50% - 3rem));
          }
        }
        .animate-carousel {
          width: max-content;
          will-change: transform;
        }
      `}</style>
    </div>
  );
};

export default CompanyLogosCarousel;