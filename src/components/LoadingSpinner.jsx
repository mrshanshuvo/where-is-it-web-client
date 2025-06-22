import React from 'react';

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizes = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-500 ${sizes[size]}`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;