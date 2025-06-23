import React from "react";
import { motion } from "framer-motion";

const stats = [
  { value: "1000+", label: "Items Recovered" },
  { value: "500+", label: "Happy Users" },
  { value: "24/7", label: "Support" },
];

const StatsSection = () => {
  return (
    <div className="bg-gray-50 py-12 rounded-xl">
      <h2 className="text-3xl font-bold text-center mb-8">Our Impact</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow text-center"
          >
            <p className="text-4xl font-bold text-blue-600">{stat.value}</p>
            <p className="text-gray-600 mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;