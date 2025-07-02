import React from 'react';

const Loading = ({ type = 'cards', count = 6 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'cards':
        return Array.from({ length: count }, (_, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-micro">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-shimmer" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-shimmer w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-shimmer w-1/2" />
                <div className="h-3 bg-gray-200 rounded animate-shimmer w-2/3" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex space-x-2">
                <div className="h-5 bg-gray-200 rounded-full animate-shimmer w-16" />
                <div className="h-5 bg-gray-200 rounded-full animate-shimmer w-20" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-3 bg-gray-200 rounded animate-shimmer w-24" />
                <div className="h-3 bg-gray-200 rounded animate-shimmer w-16" />
              </div>
            </div>
          </div>
        ));

      case 'table':
        return (
          <div className="bg-white rounded-lg shadow-micro overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="h-5 bg-gray-200 rounded animate-shimmer w-32" />
            </div>
            {Array.from({ length: count }, (_, index) => (
              <div key={index} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-shimmer" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-shimmer w-1/3" />
                    <div className="h-3 bg-gray-200 rounded animate-shimmer w-1/4" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded animate-shimmer w-16" />
                </div>
              </div>
            ))}
          </div>
        );

      case 'list':
        return Array.from({ length: count }, (_, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-micro">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded animate-shimmer" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-shimmer w-2/3" />
                <div className="h-3 bg-gray-200 rounded animate-shimmer w-1/2" />
              </div>
              <div className="h-3 bg-gray-200 rounded animate-shimmer w-20" />
            </div>
          </div>
        ));

      case 'pipeline':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }, (_, colIndex) => (
              <div key={colIndex} className="space-y-4">
                <div className="h-6 bg-gray-200 rounded animate-shimmer w-24" />
                {Array.from({ length: 3 }, (_, cardIndex) => (
                  <div key={cardIndex} className="bg-white rounded-lg p-4 shadow-micro">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-shimmer w-3/4" />
                      <div className="h-3 bg-gray-200 rounded animate-shimmer w-1/2" />
                      <div className="flex justify-between items-center">
                        <div className="h-5 bg-gray-200 rounded animate-shimmer w-16" />
                        <div className="h-4 bg-gray-200 rounded animate-shimmer w-12" />
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full animate-shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            {Array.from({ length: count }, (_, index) => (
              <div key={index} className="h-16 bg-gray-200 rounded animate-shimmer" />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="animate-pulse">
      {renderSkeleton()}
    </div>
  );
};

export default Loading;