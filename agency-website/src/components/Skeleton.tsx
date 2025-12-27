import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4' 
}) => (
  <div className={`bg-white/10 rounded animate-pulse ${width} ${height} ${className}`} />
);

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 1, 
  className = '' 
}) => (
  <div className={`space-y-2 ${className}`}>
    {[...Array(lines)].map((_, i) => (
      <Skeleton key={i} height="h-4" />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-black/40 border border-white/10 rounded-xl p-6 ${className}`}>
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton width="w-20" height="h-4" />
        <Skeleton width="w-16" height="h-8" />
      </div>
      <Skeleton width="w-8" height="h-8" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; className?: string }> = ({ 
  rows = 5, 
  className = '' 
}) => (
  <div className={`space-y-4 ${className}`}>
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
        <div className="flex items-center gap-4">
          <Skeleton width="w-32" height="h-4" />
          <Skeleton width="w-24" height="h-4" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton width="w-16" height="h-6" />
          <Skeleton width="w-16" height="h-6" />
          <Skeleton width="w-20" height="h-6" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonHeader: React.FC = () => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div className="space-y-2">
      <Skeleton width="w-48" height="h-8" />
      <Skeleton width="w-64" height="h-4" />
    </div>
    <div className="flex gap-3">
      <Skeleton width="w-32" height="h-10" />
      <Skeleton width="w-32" height="h-10" />
    </div>
  </div>
); 