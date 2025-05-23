// components/FaqSection.tsx
"use client";

import { useLanguage } from "@/context/language-context";
import translations from "@/app/gop-mam-xanh/language"; // Import translations từ thư mục gốc

export default function FaqSection() {
  const { language } = useLanguage();

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {translations.faqSection.title[language]}
          </h2>
        </div>

        <div className="space-y-6">
          {[
            translations.faqSection.q1,
            translations.faqSection.q2,
            translations.faqSection.q3,
            translations.faqSection.q4,
          ].map((faqItem, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">
                {faqItem.question[language]}
              </h3>
              <p className="text-gray-600">{faqItem.answer[language]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
