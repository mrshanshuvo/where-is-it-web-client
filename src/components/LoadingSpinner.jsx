import React from "react";

const LoadingSpinner = ({
  size = "medium",
  fullPage = true,
  className = "",
}) => {
  const sizes = {
    small: "h-6 w-6",
    medium: "h-10 w-10",
    large: "h-14 w-14",
  };

  return (
    <div
      className={`flex justify-center items-center ${
        fullPage ? "h-screen w-full" : ""
      } ${className}`}
    >
      <div
        className={`animate-spin rounded-full border-t-4 border-b-4 border-blue-500 ${sizes[size]}`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
