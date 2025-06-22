import React from 'react';
import { useNavigate } from 'react-router';
import { FiArrowLeft, FiHome } from 'react-icons/fi';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden text-center p-8">
        {/* Error Code */}
        <div className="text-9xl font-bold text-blue-600 mb-4">404</div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Illustration */}
        <div className="mb-8">
          <svg
            className="w-48 h-48 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiArrowLeft className="mr-2" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiHome className="mr-2" />
            Return Home
          </button>
        </div>
      </div>

      {/* Optional: Help Section */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Still need help? <a href="/contact" className="text-blue-600 hover:underline">Contact support</a></p>
      </div>
    </div>
  );
};

export default NotFound;