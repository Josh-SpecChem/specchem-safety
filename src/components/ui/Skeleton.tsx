"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      aria-label="Loading..."
    />
  );
}

export function CourseSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>
      
      <Skeleton className="w-full h-6 mb-2" />
      <Skeleton className="w-3/4 h-6 mb-4" />
      
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-20 h-4" />
      </div>
      
      <Skeleton className="w-full h-10 rounded-lg" />
    </div>
  );
}

export function AnnouncementSkeleton() {
  return (
    <div className="border-l-4 border-gray-200 rounded-lg p-6 bg-gray-50">
      <div className="flex items-start space-x-3">
        <Skeleton className="w-5 h-5 rounded" />
        <div className="flex-1">
          <Skeleton className="w-3/4 h-6 mb-2" />
          <Skeleton className="w-full h-4 mb-1" />
          <Skeleton className="w-full h-4 mb-1" />
          <Skeleton className="w-2/3 h-4 mb-4" />
          <div className="flex justify-between">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-20 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
