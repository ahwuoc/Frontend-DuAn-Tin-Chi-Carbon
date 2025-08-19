"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLocalLanguage } from "@/hooks/use-local-language"
import { aboutLanguage } from "./language"

const AboutPageClient = () => {
  const { lang } = useLocalLanguage(aboutLanguage)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] bg-black">
        <div className="absolute inset-0 z-0">
          <video
            src="https://res.cloudinary.com/dyticflm3/video/upload/v1744623694/rice_paddle_vid_2_yu27im.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full opacity-60"
            aria-hidden="true"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">{lang.about_page_title}</h1>
          <p className="text-white text-lg max-w-xl">{lang.about_page_subtitle}</p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/mother-1505055_1280.jpg"
                alt={lang.about_us_section}
                fill
                className="object-cover"
                aria-hidden="true"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-800">{lang.about_us_section}</h2>
              <p className="text-lg text-gray-600 mb-6">{lang.about_us_content}</p>
              <p className="text-lg text-gray-600 mb-6">{lang.about_us_content_2}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-bold mb-6 text-gray-800">{lang.vision_mission}</h2>
              <p className="text-lg text-gray-600 mb-6">
                <strong>{lang.vision}</strong> {lang.vision_content}
              </p>
              <p className="text-lg text-gray-600 mb-6">
                <strong>{lang.mission}</strong> {lang.mission_content}
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl order-1 md:order-2">
              <Image
                src="/images/grandmother-4992686_1920.jpg"
                alt={lang.vision_mission}
                fill
                className="object-cover"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/landscape-1504936_1280.jpg"
                alt={lang.core_values}
                fill
                className="object-cover"
                aria-hidden="true"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-800">{lang.core_values}</h2>
              <ul className="space-y-4 text-lg text-gray-600">
                <li className="flex items-start">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    1
                  </div>
                  <span>
                    <strong>{lang.core_value_1}</strong> {lang.core_value_1_desc}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    2
                  </div>
                  <span>
                    <strong>{lang.core_value_2}</strong> {lang.core_value_2_desc}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    3
                  </div>
                  <span>
                    <strong>{lang.core_value_3}</strong> {lang.core_value_3_desc}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    4
                  </div>
                  <span>
                    <strong> {lang.core_value_4_desc}</strong>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link href="/dang-ky-tu-van">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg">
                {lang.contact_now}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPageClient
