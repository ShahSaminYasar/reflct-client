"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { motion } from "motion/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    title: "Every Lesson is a Step Forward",
    subtitle: "Preserve your wisdom. Share your growth.",
    image:
      "https://images.unsplash.com/photo-1780566410393-a8f275951708?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cta: "Start Your Journey",
  },
  {
    title: "Learn from Others' Experiences",
    subtitle: "Real stories. Real lessons. Real growth.",
    image:
      "https://plus.unsplash.com/premium_photo-1716138192476-f34e85ad43c2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cta: "Explore Public Lessons",
  },
  {
    title: "Turn Reflections into Wisdom",
    subtitle: "Your story might be someone else's lifeline.",
    image:
      "https://plus.unsplash.com/premium_photo-1779748920911-4ef212ea4dc3?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cta: "Share Your Lesson",
  },
];

export default function HeroSlider() {
  return (
    <div className="relative h-[35vh] min-h-130 overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/60" />

              <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="max-w-4xl mx-auto"
                >
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
                    {slide.subtitle}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.a
                      href="/register"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block bg-white text-black font-semibold px-10 py-4 rounded-full text-lg hover:bg-gray-100 transition"
                    >
                      {slide.cta}
                    </motion.a>

                    <motion.a
                      href="/lessons"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block border border-white text-white font-semibold px-10 py-4 rounded-full text-lg hover:bg-white/10 transition"
                    >
                      Browse Lessons
                    </motion.a>
                  </div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
