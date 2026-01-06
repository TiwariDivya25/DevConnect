// src/components/PostSkeleton.tsx
import React from 'react';

const PostSkeleton: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-cyan-900/30 rounded-lg p-6 animate-pulse">
      {/* Header with user info */}
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-cyan-900/40 rounded-full"></div>
        <div className="ml-3 flex-1">
          <div className="h-4 bg-cyan-800/40 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-slate-700/40 rounded w-1/6"></div>
        </div>
      </div>
      
      {/* Post title */}
      <div className="h-6 bg-cyan-800/30 rounded w-3/4 mb-3"></div>
      
      {/* Post content lines */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-slate-700/30 rounded w-full"></div>
        <div className="h-4 bg-slate-700/30 rounded w-5/6"></div>
        <div className="h-4 bg-slate-700/30 rounded w-4/6"></div>
      </div>
      
      {/* Tags */}
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-cyan-900/30 rounded w-16"></div>
        <div className="h-6 bg-cyan-900/30 rounded w-20"></div>
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-cyan-900/20">
        <div className="flex gap-4">
          <div className="h-8 w-20 bg-cyan-900/30 rounded"></div>
          <div className="h-8 w-20 bg-cyan-900/30 rounded"></div>
        </div>
        <div className="h-6 w-24 bg-slate-700/30 rounded"></div>
      </div>
    </div>
  );
};

export default PostSkeleton;