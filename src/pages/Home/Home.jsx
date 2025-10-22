import React, { Suspense } from "react";
import { ClipLoader } from "react-spinners";
import BannerSlider from "./BannerSlider";
import LatestItemsSection from "./LatestItemsSection";
import StatsSection from "./StatsSection";
import HowItWorks from "./HowItWorks";
import { motion } from "framer-motion";
import Newsletter from "./Newsletter";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <BannerSlider></BannerSlider>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-40">
            <ClipLoader size={40} color="#3B82F6" />
          </div>
        }
      >
        <LatestItemsSection></LatestItemsSection>
      </Suspense>
      {/* Stats Section - Extra Section 1 */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="my-12"
      >
        <StatsSection />
      </motion.section>

      {/* How It Works Section - Extra Section 2 */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="my-12"
      >
        <HowItWorks />
      </motion.section>

      {/* Newsletter Subscription Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="my-12"
      >
        <Newsletter />
      </motion.section>
    </div>
  );
};

export default Home;
