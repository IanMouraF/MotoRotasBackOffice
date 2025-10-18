import React from "react";

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-300 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-5 bg-gray-300 rounded w-24" />
        <div className="h-4 w-4 bg-gray-300 rounded" />
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-300 rounded" />
          <div className="h-4 bg-gray-300 rounded w-32" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-300 rounded" />
          <div className="h-4 bg-gray-300 rounded w-24" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-300 rounded" />
          <div className="h-4 bg-gray-300 rounded w-28" />
        </div>
      </div>

      <div className="h-10 bg-gray-300 rounded-lg w-full" />
    </div>
  );
};

export const SkeletonColumn: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-300 rounded w-32 animate-pulse" />
        <div className="h-6 w-8 bg-gray-300 rounded-full animate-pulse" />
      </div>

      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
};
