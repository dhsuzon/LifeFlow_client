"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { FaUserPlus, FaSearch } from "react-icons/fa";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { sliderData } from "@/data/sliderData";

const HeroSection = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return (
      <section className="w-full h-125 bg-zinc-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-danger border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  return (
    <section className="w-full h-125 md:h-150 lg:h-[calc(100vh-64px)] relative bg-background overflow-hidden my-0">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect={"fade"}
        fadeEffect={{ crossFade: true }}
        className="w-full h-full"
      >
        {sliderData.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
              style={{ backgroundImage: `url(${slide.bgImage})` }}
            />

            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 flex flex-col justify-center h-full z-10 text-white">
              <div className="max-w-lg md:max-w-2xl space-y-3 md:space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                  {slide.title}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-200 font-medium max-w-xl leading-relaxed">
                  {slide.description}
                </p>

                <div className="flex flex-wrap gap-3 md:gap-4 pt-2">
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center justify-center gap-2 bg-danger text-white font-bold h-11 md:h-12 px-5 md:px-6 rounded-full hover:bg-danger-600 transition-all active:scale-95 text-sm md:text-base"
                  >
                    <FaUserPlus className="text-lg" />
                    <span>Join as a donor</span>
                  </Link>
                  <Link
                    href="/search"
                    className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold h-11 md:h-12 px-5 md:px-6 rounded-full bg-transparent hover:bg-white hover:text-black transition-all active:scale-95 text-sm md:text-base"
                  >
                    <FaSearch className="text-sm" />
                    <span>Search Donors</span>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSection;
