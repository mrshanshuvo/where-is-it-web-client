import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

const slides = [
  {
    title: "Reuniting Lost Items With Their Owners",
    description:
      "Our community has helped return over 10,000 lost items to their rightful owners. Join us in making a difference!",
    bgImage:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1470&q=80", // Hands holding keys, symbolizing lost & found
    actionText: "Report a Lost Item",
    actionLink: "/report-lost",
  },
  {
    title: "Found Something? Help Return It",
    description:
      "Post found items on our platform and help someone recover what they've lost. Every item matters!",
    bgImage:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1920&q=90", // Person holding a wallet, found object
    actionText: "Report a Found Item",
    actionLink: "/report-found",
  },
  {
    title: "Success Stories That Warm The Heart",
    description:
      "Read how we reunited a grandmother with her 50-year-old wedding ring after 6 months of searching.",
    bgImage:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=90", // Happy family reunion or sentimental moment
    actionText: "View Success Stories",
    actionLink: "/success-stories",
  },
  {
    title: "Join Our Growing Community",
    description:
      "Become part of a supportive network dedicated to helping others find lost treasures and reconnect.",
    bgImage:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1920&q=90", // Group of people together, community vibe
    actionText: "Join Now",
    actionLink: "/join",
  },
];


const BannerSlider = () => {
  return (
    <section aria-label="Promotional Banner Slider" className="relative w-full overflow-hidden rounded-2xl shadow-xl">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade, Navigation]}
        slidesPerView={1}
        loop
        effect="fade"
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        speed={400}
        pagination={{ clickable: true }}
        navigation
        className="h-[400px] md:h-[550px]"
      >
        {slides.map(({ title, description, bgImage, actionText, actionLink }, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Background image as img for smooth fade */}
              <img
                src={bgImage}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                draggable={false}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" aria-hidden="true" />
              {/* Content */}
              <div className="relative z-10 px-6 md:px-10 max-w-3xl text-center text-white">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">{title}</h2>
                  <p className="text-base md:text-lg font-medium mb-6 leading-relaxed drop-shadow-md">{description}</p>
                  <motion.a
                    href={actionLink}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block px-7 py-3 bg-white text-blue-600 rounded-full font-semibold shadow-md hover:shadow-lg transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    aria-label={actionText}
                  >
                    {actionText}
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default BannerSlider;
