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
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500"
          >
            <div className="text-4xl mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;