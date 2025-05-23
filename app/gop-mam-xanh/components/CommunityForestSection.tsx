// components/CommunityForestSection.tsx
"use client";

import ForestExplorer from "@/components/forest/ForestExplorer";
import { useLanguage } from "@/context/language-context";
import translations from "@/app/gop-mam-xanh/language"; // Import translations từ thư mục gốc

interface CommunityForestSectionProps {
  treeCount: number;
  contributorCount: number;
  co2Reduction: number;
  isLoading: boolean;
}

export default function CommunityForestSection({
  treeCount,
  contributorCount,
  co2Reduction,
  isLoading,
}: CommunityForestSectionProps) {
  const { language } = useLanguage();

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {translations.communityForest.title[language]}
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600">
            {translations.communityForest.description[language]}
          </p>
        </div>
        <div
          id="community-forest"
          className="bg-white rounded-xl shadow-xl overflow-hidden border border-emerald-100"
        >
          <div className="h-[800px] relative">
            <ForestExplorer />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-emerald-100">
            <div className="p-6 text-center border-b md:border-b-0 md:border-r border-emerald-100">
              <div className="text-3xl font-bold text-emerald-600">
                {isLoading ? (
                  <span className="inline-block w-16 h-8 bg-emerald-100 animate-pulse rounded"></span>
                ) : (
                  treeCount || 0
                )}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {translations.communityForest.treeCount[language]}
              </div>
            </div>
            <div className="p-6 text-center border-b md:border-b-0 md:border-r border-emerald-100">
              <div className="text-3xl font-bold text-emerald-600">
                {isLoading ? (
                  <span className="inline-block w-12 h-8 bg-emerald-100 animate-pulse rounded"></span>
                ) : (
                  contributorCount || 0
                )}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {translations.communityForest.contributorCount[language]}
              </div>
            </div>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-emerald-600">
                {isLoading ? (
                  <span className="inline-block w-24 h-8 bg-emerald-100 animate-pulse rounded"></span>
                ) : (
                  `${(co2Reduction || 0).toLocaleString()} kg`
                )}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {translations.communityForest.co2Reduction[language]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
