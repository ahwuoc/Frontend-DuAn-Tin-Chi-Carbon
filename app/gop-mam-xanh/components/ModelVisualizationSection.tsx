// components/ModelVisualizationSection.tsx
"use client";

import { useLanguage } from "@/context/language-context";
import translations from "@/app/gop-mam-xanh/language"; // Import translations từ thư mục gốc

export default function ModelVisualizationSection() {
  const { language } = useLanguage();

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            {translations.modelSection.title[language]}
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600">
            {translations.modelSection.description[language]}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="aspect-video w-full h-[600px] relative">
            <div className="absolute top-0 left-0 right-0 h-[50px] z-10 bg-emerald-900 pointer-events-none"></div>

            <div className="sketchfab-embed-wrapper w-full h-full">
              <div className="sketchfab-embed-wrapper w-full h-full">
                <iframe
                  {...({
                    title: "Levé LiDAR IGN des Carrières de Junas",
                    frameBorder: "0",
                    allowFullScreen: true,
                    mozallowfullscreen: "true",
                    webkitallowfullscreen: "true",
                    allow: "autoplay; fullscreen; xr-spatial-tracking",
                    "xr-spatial-tracking": "true",
                    "execution-while-out-of-viewport": "true",
                    "execution-while-not-rendered": "true",
                    "web-share": "true",
                    src: "https://sketchfab.com/models/ded2fbbc694542dfb691d2f08b466163/embed?autostart=1",
                    className: "w-full h-full",
                  } as any)}
                />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-[50px] z-10 bg-emerald-900 pointer-events-none"></div>
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              {translations.modelSection.caption[language]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
