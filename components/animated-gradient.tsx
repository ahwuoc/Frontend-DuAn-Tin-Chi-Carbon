"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/context/language-context";

interface AnimatedGradientProps {
  className?: string;
}

export default function AnimatedGradient({
  className = "",
}: AnimatedGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create gradient animation
    let hue = 0;
    const animate = () => {
      hue = (hue + 0.1) % 360;

      // Create gradient
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height,
      );
      gradient.addColorStop(0, `hsl(${hue}, 70%, 60%)`);
      gradient.addColorStop(0.5, `hsl(${(hue + 60) % 360}, 70%, 60%)`);
      gradient.addColorStop(1, `hsl(${(hue + 120) % 360}, 70%, 60%)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Get the text based on the current language
  const readyText = language === "en" ? "Ready to start?" : "Sẵn sàng bắt đầu?";
  const contactText =
    language === "en"
      ? "Contact us for free consultation"
      : "Liên hệ với chúng tôi để được tư vấn miễn phí";

  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full ${className}`}
      />
      <div className="absolute inset-0 flex flex-col items-start justify-center text-center max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">
          {readyText}
        </h2>
        <p className="text-base md:text-lg text-white/90">{contactText}</p>
      </div>
    </div>
  );
}
