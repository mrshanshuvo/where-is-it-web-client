import React from "react";

const Newsletter = () => {
  return (
    <section className="bg-blue-50 py-12 sm:py-16 px-4 sm:px-6 md:px-8 rounded-xl shadow-md max-w-5xl mx-auto my-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 text-center mb-3">
        Subscribe to our newsletter
      </h2>
      <p className="text-center text-gray-700 mb-6 sm:mb-8 text-sm sm:text-base">
        Get updates on the latest lost & found items and alerts directly in your
        inbox.
      </p>
      <form className="flex flex-col sm:flex-row justify-center items-center gap-3 w-full">
        <input
          type="email"
          placeholder="Your email"
          className="px-4 py-3 sm:py-2 rounded-md sm:rounded-l-md w-full sm:max-w-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 transition-all"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:py-2 rounded-md sm:rounded-r-md shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
};

export default Newsletter;
