import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const ErrorMessage = ({ message = 'An error occurred', className = '', showIcon = true }) => {
  return (
    <div className={`bg-red-50 border-l-4 border-red-500 p-4 ${className}`}>
      <div className="flex items-center">
        {showIcon && (
          <div className="flex-shrink-0">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
        <div className="ml-3">
          <p className="text-sm text-red-700">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;