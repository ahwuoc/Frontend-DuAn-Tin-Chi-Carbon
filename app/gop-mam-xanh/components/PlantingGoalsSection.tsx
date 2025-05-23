// components/PlantingGoalsSection.tsx
"use client";

import { useLanguage } from "@/context/language-context";
import translations from "@/app/gop-mam-xanh/language"; // Import translations từ thư mục gốc

interface PlantingGoalsSectionProps {
  treeCount: number;
  isLoading: boolean;
}

export default function PlantingGoalsSection({
  treeCount,
  isLoading,
}: PlantingGoalsSectionProps) {
  const { language } = useLanguage();

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            {translations.plantingGoals.title[language]}
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600">
            {translations.plantingGoals.description[language]}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-gray-700">
              {translations.plantingGoals.progress[language]}
            </span>
            <span className="font-semibold text-gray-700">
              {isLoading ? "..." : `${treeCount}/10,000`}
              <span className="text-sm text-gray-500 ml-1">
                (
                {isLoading
                  ? "..."
                  : `${((treeCount / 10000) * 100).toFixed(1)}%`}
                )
              </span>
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-green-600 h-4 rounded-full transition-all duration-500 ease-in-out"
              style={{
                width: `${isLoading ? 0 : (treeCount / 10000) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
