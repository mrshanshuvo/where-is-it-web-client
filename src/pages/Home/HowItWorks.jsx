import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Report Item",
    description: "Submit details about your lost or found item",
    icon: "📝",
  },
  {
    title: "Get Matched",
    description: "Our system will notify you of potential matches",
    icon: "🔍",
  },
  {
    title: "Reunite",
    description: "Connect with the other party to reclaim your item",
    icon: "🤝",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-8 bg-gray-50 rounded-xl">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
        How It Works
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className="bg-white p-6 sm:p-8 rounded-lg shadow-md border-t-4 border-blue-500 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
          >
            <div className="text-4xl sm:text-5xl mb-4">{step.icon}</div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-2">
              {step.title}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
