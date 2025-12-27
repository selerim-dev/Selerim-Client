import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
interface CaseStudyProps {
  title: string;
  excerpt: string;
  image: string;
  link: string;
  category: string;
}

const CaseStudyCard: React.FC<CaseStudyProps> = ({
  title,
  excerpt,
  image,
  link,
  category,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20">
      <div className="aspect-w-16 aspect-h-9">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-x-4 text-xs">
          <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
            {category}
          </span>
        </div>
        <div className="group relative">
          <h3 className="mt-3 text-lg font-semibold text-white">
            <Link href={link}>
              <span className="absolute inset-0" aria-hidden="true" />
              {title}
            </Link>
          </h3>
          <p className="mt-2 text-base text-white/80 line-clamp-3">
            {excerpt}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyCard; 