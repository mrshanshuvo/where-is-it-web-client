import React from "react";
import { motion } from "framer-motion";

const stats = [
  { value: "1000+", label: "Items Recovered" },
  { value: "500+", label: "Happy Users" },
  { value: "24/7", label: "Support" },
];

const StatsSection = () => {
  return (
    <section className="bg-gray-50 py-12 sm:py-16 px-4 sm:px-6 md:px-8 rounded-xl">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">
        Our Impact
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            className="bg-white p-6 sm:p-8 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 text-center"
          >
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600">
              {stat.value}
            </p>
            <p className="text-gray-600 mt-2 sm:mt-3 text-sm sm:text-base md:text-lg">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
