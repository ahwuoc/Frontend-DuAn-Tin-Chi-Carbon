"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  DollarSign,
  TrendingUp,
  Users,
  Gift,
  Clock,
  Shield,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { affiliateLanguage } from "./language";

export default function AffiliateProgram() {
  const { language } = useLanguage();
  const lang = affiliateLanguage[language];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-black">
        <div className="absolute inset-0 z-0">
          <video
            src="https://res.cloudinary.com/dyticflm3/video/upload/v1744623697/rice_paddle_vid_b3r8sj.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <span className="inline-block py-1 px-3 bg-green-600 text-white text-sm font-medium rounded-full mb-4">
            {lang.hero.badge}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            {lang.hero.title}
          </h1>
          <p className="text-white text-xl max-w-2xl mb-8">
            {lang.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/quan-ly/tiep-thi-lien-ket">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
              >
                {lang.hero.registerNow}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-green-600 text-green-600 bg-white hover:bg-green-600 hover:text-white hover:border-green-600 px-8 py-6 text-lg transition-colors"
            >
              {lang.hero.learnMore}
            </Button>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {lang.overview.badge}
            </span>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              {lang.overview.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {lang.overview.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/images/cloud-4136344_1920.jpg"
                alt={lang.overview.badge}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-6 text-gray-800">
                {lang.overview.howItWorks}
              </h3>
              <div className="space-y-6">
                {lang.overview.steps.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-green-100 p-3 rounded-full mr-4 flex-shrink-0">
                      <span className="font-bold text-green-600">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">
                        {step.title}
                      </h4>
                      <p className="text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {lang.benefits.badge}
            </span>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              {lang.benefits.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {lang.benefits.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {lang.benefits.items.map((benefit, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 hover:bg-green-50"
              >
                <CardContent className="p-8">
                  <div className="bg-green-100 p-4 rounded-full inline-block mb-6">
                    {index === 0 && (
                      <DollarSign className="h-12 w-12 text-green-600" />
                    )}
                    {index === 1 && (
                      <Clock className="h-12 w-12 text-green-600" />
                    )}
                    {index === 2 && (
                      <TrendingUp className="h-12 w-12 text-green-600" />
                    )}
                    {index === 3 && (
                      <Gift className="h-12 w-12 text-green-600" />
                    )}
                    {index === 4 && (
                      <Users className="h-12 w-12 text-green-600" />
                    )}
                    {index === 5 && (
                      <Shield className="h-12 w-12 text-green-600" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {lang.commission.badge}
            </span>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              {lang.commission.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {lang.commission.description}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-green-50">
                    <th className="py-4 px-6 text-left text-lg font-semibold text-gray-800 border-b">
                      {lang.commission.table.headers.product}
                    </th>
                    <th className="py-4 px-6 text-center text-lg font-semibold text-gray-800 border-b">
                      {lang.commission.table.headers.basicCommission}
                    </th>
                    <th className="py-4 px-6 text-center text-lg font-semibold text-gray-800 border-b">
                      {lang.commission.table.headers.vipCommission}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lang.commission.table.rows.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-4 px-6 border-b">
                        {row.product}
                      </td>
                      <td className="py-4 px-6 text-center border-b">
                        {row.basic}
                      </td>
                      <td className="py-4 px-6 text-center border-b">
                        {row.vip}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                {lang.commission.vipSection.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {lang.commission.vipSection.description}
              </p>
              <ul className="space-y-2">
                {lang.commission.vipSection.conditions.map(
                  (condition, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        {condition}
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Registration CTA Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4 text-gray-800">
              {lang.registration.title}
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              {lang.registration.description}
            </p>
            <Link href="/dang-nhap">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-10 py-6 text-lg"
              >
                {lang.registration.button}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {lang.faq.badge}
            </span>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              {lang.faq.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {lang.faq.description}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {lang.faq.questions.map((faq, index) => (
              <div key={index} className="mb-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer">
                      <h3 className="text-xl font-bold text-gray-800">
                        {faq.question}
                      </h3>
                      <div className="w-5 h-5 border-2 border-green-600 rounded-full flex items-center justify-center group-open:bg-green-600 transition-all duration-300">
                        <span className="transform group-open:rotate-180 transition-transform duration-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-600 group-open:text-white"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </span>
                      </div>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 animate-fadeIn">
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-2">
                {lang.cta.title}
              </h2>
              <p className="text-white/80 text-lg">
                {lang.cta.description}
              </p>
            </div>
            <Link href="/dang-ky?affiliate=true">
              <Button className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 text-lg font-medium">
                {lang.cta.button}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
