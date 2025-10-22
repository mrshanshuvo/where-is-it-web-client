import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../api/api";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

const BannerSlider = () => {
  // Fetch slides dynamically
  const {
    data: slides = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["slides"],
    queryFn: async () => {
      const res = await axiosInstance.get("/slides");
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  if (isLoading)
    return (
      <div className="h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center text-gray-500 text-lg">
        Loading slides...
      </div>
    );

  if (isError)
    return (
      <div className="h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center text-red-500 text-lg">
        Failed to load slides: {error.message}
      </div>
    );

  return (
    <section
      aria-label="Promotional Banner Slider"
      className="relative w-full overflow-hidden rounded-2xl shadow-xl"
    >
      <Swiper
        modules={[Autoplay, Pagination, EffectFade, Navigation]}
        slidesPerView={1}
        loop
        effect="fade"
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        speed={500}
        pagination={{ clickable: true }}
        navigation
        className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
      >
        {slides.map(
          ({ title, description, bgImage, actionText, actionLink }, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Background Image */}
                <img
                  src={bgImage}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" />
                {/* Content */}
                <div className="relative z-10 px-4 sm:px-6 md:px-10 max-w-3xl text-center text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 drop-shadow-lg">
                      {title}
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium mb-4 sm:mb-6 leading-relaxed drop-shadow-md">
                      {description}
                    </p>
                    {actionText && actionLink && (
                      <motion.a
                        href={actionLink}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block px-6 sm:px-7 py-2 sm:py-3 bg-white text-blue-600 rounded-full font-semibold shadow-md hover:shadow-lg transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        aria-label={actionText}
                      >
                        {actionText}
                      </motion.a>
                    )}
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          )
        )}
      </Swiper>
    </section>
  );
};

export default BannerSlider;
