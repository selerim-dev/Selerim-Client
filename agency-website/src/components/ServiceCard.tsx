import React from 'react';
import Link from 'next/link';
interface ServiceCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  link: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon: Icon,
  title,
  description,
  link,
}) => {
  return (
    <div className="group relative rounded-lg bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20">
      <div>
        <span className="inline-flex rounded-lg bg-white/20 p-3">
          <Icon className="h-6 w-6 text-white" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white">
          <Link href={link} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {title}
          </Link>
        </h3>
        <p className="mt-2 text-base text-white/80">
          {description}
        </p>
      </div>
      <div className="mt-4">
        <Link
          href={link}
          className="text-sm font-medium text-black hover:text-black/80"
        >
          Learn more <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard; 