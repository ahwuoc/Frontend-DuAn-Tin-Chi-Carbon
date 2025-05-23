// components/HeroSection.tsx
"use client";

import { useLanguage } from "@/context/language-context";
import translations from "@/app/gop-mam-xanh/language"; // Import translations từ thư mục gốc

export default function HeroSection() {
  const { language } = useLanguage();

  return (
    <section className="relative h-[50vh] min-h-[400px]">
      <div className="absolute inset-0 z-0">
        <video
          src="https://res.cloudinary.com/dyticflm3/video/upload/v1744835407/tr%E1%BB%93ng_c%C3%A2y_dfj0rl.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          {translations.hero.title[language]}
        </h1>
        <p className="text-white text-lg max-w-xl">
          {translations.hero.subtitle[language]}
        </p>
      </div>
    </section>
  );
}
