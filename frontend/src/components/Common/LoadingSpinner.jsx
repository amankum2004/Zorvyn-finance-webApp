import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'primary', fullScreen = false, text = '' }) => {
  const sizes = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xlarge: 'h-16 w-16'
  };

  const colors = {
    primary: 'border-primary-600',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  const spinnerSize = sizes[size] || sizes.medium;
  const spinnerColor = colors[color] || colors.primary;

  const SpinnerContent = () => (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full ${spinnerSize} border-b-2 ${spinnerColor}`}></div>
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center z-50">
        <SpinnerContent />
      </div>
    );
  }

  return <SpinnerContent />;
};

// Skeleton loading component for cards
export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
};

// Skeleton loading for tables
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-10 rounded-t-lg mb-2"></div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="bg-white border-b border-gray-200 p-4">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(columns)].map((_, j) => (
              <div key={j} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Loading overlay for forms
export const LoadingOverlay = ({ isLoading, children }) => {
  if (!isLoading) return children;

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <LoadingSpinner size="medium" />
      </div>
    </div>
  );
};

export default LoadingSpinner;