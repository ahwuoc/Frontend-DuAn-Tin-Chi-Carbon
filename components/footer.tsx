"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight, Send } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { useState } from "react"

export default function Footer() {
  const { language, t } = useLanguage()
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Xử lý gửi email đăng ký
      alert(t("newsletter_success"))
      setEmail("")
    }
  }

  const quickLinks = [
    { name: t("home"), href: "/" },
    { name: t("about"), href: "/gioi-thieu" },
    { name: t("news"), href: "/tin-tuc" },
    { name: t("contact"), href: "/lien-he" },
  ]

  // Xác định tên công ty dựa trên ngôn ngữ
  const companyName = language === "en" ? "Carbon Credits Vietnam" : t("company_name")

  return (
    <footer className="bg-gray-900 text-white relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-green-600"></div>

      {/* Newsletter Section */}
      <div className="bg-green-600 py-12 relative">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-2xl font-bold mb-2">{t("newsletter")}</h3>
              <p className="text-green-50">{t("newsletter_desc")}</p>
            </div>
            <div className="w-full md:w-auto flex-1 max-w-md">
              <form className="flex h-10" onSubmit={handleSubmit}>
                <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="email"
                    placeholder={t("email_placeholder")}
                    className="bg-white border-0 rounded-r-none pl-10 pr-4 h-10 text-gray-800 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-green-600"
                    required
                    aria-label={t("email_placeholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-gray-900 hover:bg-gray-800 rounded-l-none h-10 px-4 transition-colors duration-300"
                  aria-label={t("submit")}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap justify-between">
          {/* Company Info */}
          <div className="w-full md:w-1/2 lg:w-1/4 mb-8 lg:mb-0 pr-4">
            <h3 className="text-xl font-bold mb-6 relative inline-block">
              {companyName}
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-green-600 rounded-full"></span>
            </h3>
            <div className="relative h-16 w-64 mb-6 bg-white rounded-md p-2">
              <Image
                src={language === "en" ? "/images/logo-english.png" : "/images/logo-vietnamese.png"}
                alt={t("company_name")}
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">{t("company_description")}</p>
            <div className="flex space-x-3">
              <a
                href="https://www.facebook.com/tinchicarbonvn"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-green-600 transition-colors duration-300 w-10 h-10 rounded-full flex items-center justify-center"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/carboncreditvietnam/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-green-600 transition-colors duration-300 w-10 h-10 rounded-full flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/tccv-carbon-credits-vietnam/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-green-600 transition-colors duration-300 w-10 h-10 rounded-full flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="w-full md:w-1/2 lg:w-1/6 mb-8 lg:mb-0">
            <h3 className="text-xl font-bold mb-6 relative inline-block">
              {t("quick_links")}
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-green-600 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((item, index) => (
                <li key={index}>
                  <span className="text-gray-300 group flex items-center cursor-default whitespace-nowrap">
                    <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="w-full md:w-1/2 lg:w-1/3 mb-8 lg:mb-0 pl-0 lg:pl-4">
            <h3 className="text-xl font-bold mb-6 relative inline-block">
              {t("contact_info")}
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-green-600 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-gray-800 p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                  <MapPin className="h-5 w-5 text-green-500" />
                </div>
                <span className="text-gray-300">
                  {language === "vi"
                    ? "Tầng 2, Toà nhà CT4 - The Pride, Tố Hữu, Hà Đông, Hà Nội, Việt Nam"
                    : "2nd Floor, CT4 Building - The Pride, To Huu, Ha Dong, Hanoi, Vietnam"}
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-gray-800 p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                  <Phone className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-gray-300">
                  <p>092.3370.804</p>
                  <p>085.8721.592</p>
                  <p>082.220.8881</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-gray-800 p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                  <Mail className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-gray-300">
                  <p>minhtq@carboncreditvietnam.vn</p>
                  <p>phuongmh@carboncreditvietnam.vn</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div className="w-full md:w-1/2 lg:w-1/4 mb-8 lg:mb-0 pl-0 lg:pl-4">
            <h3 className="text-xl font-bold mb-6 relative inline-block">
              {t("business_hours")}
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-green-600 rounded-full"></span>
            </h3>
            <ul className="space-y-3 mb-6">
              <li className="flex justify-between">
                <span className="text-gray-300">{t("monday_friday")}:</span>
                <span className="text-white font-medium">8:00 - 17:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-300">{t("saturday")}:</span>
                <span className="text-white font-medium">8:00 - 12:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-300">{t("sunday")}:</span>
                <span className="text-white font-medium">{t("closed")}</span>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-gray-800">
              <Link href="/dang-ky-tu-van">
                <Button className="bg-green-600 hover:bg-green-700 w-full">{t("contact_now")}</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} {t("company_name")}.{" " + t("copyright")}
            </p>
            <div className="flex space-x-4 text-sm text-gray-400">
              <Link href="/chinh-sach-quyen-rieng-tu" className="hover:text-white transition-colors">
                {t("privacy_policy")}
              </Link>
              <Link href="/dieu-khoan-su-dung" className="hover:text-white transition-colors">
                {t("terms_of_use")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
