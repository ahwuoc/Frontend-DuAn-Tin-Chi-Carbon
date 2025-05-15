"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Cookie, X } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  })
  const { language, t } = useLanguage()

  const translations = {
    vi: {
      title: "Chúng tôi sử dụng cookie",
      description:
        "Chúng tôi sử dụng cookie trên trang web của mình để xem cách bạn tương tác với trang web. Khi chấp nhận, bạn đồng ý cho phép chúng tôi sử dụng các cookie này.",
      privacyPolicy: "Chính sách quyền riêng tư",
      cookieOptions: "Tùy chọn cookie",
      necessaryCookies: "Cookie cần thiết",
      necessaryDesc: "Các cookie này cần thiết để trang web hoạt động và không thể tắt.",
      analyticsCookies: "Cookie phân tích",
      analyticsDesc: "Giúp chúng tôi hiểu cách bạn sử dụng trang web và cải thiện trải nghiệm người dùng.",
      marketingCookies: "Cookie tiếp thị",
      marketingDesc: "Được sử dụng để theo dõi hiệu quả của quảng cáo và cung cấp nội dung phù hợp.",
      hideOptions: "Ẩn tùy chọn",
      customize: "Tùy chỉnh",
      savePreferences: "Lưu tùy chọn",
      acceptAll: "Chấp nhận tất cả",
    },
    en: {
      title: "We use cookies",
      description:
        "We use cookies on our website to see how you interact with it. By accepting, you agree to allow us to use these cookies.",
      privacyPolicy: "Privacy Policy",
      cookieOptions: "Cookie Options",
      necessaryCookies: "Necessary Cookies",
      necessaryDesc: "These cookies are essential for the website to function and cannot be turned off.",
      analyticsCookies: "Analytics Cookies",
      analyticsDesc: "Help us understand how you use the website and improve user experience.",
      marketingCookies: "Marketing Cookies",
      marketingDesc: "Used to track the effectiveness of advertising and provide relevant content.",
      hideOptions: "Hide Options",
      customize: "Customize",
      savePreferences: "Save Preferences",
      acceptAll: "Accept All",
    },
  }

  const currentLang = language === "vi" ? translations.vi : translations.en

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem("cookieConsent")
    if (!hasAccepted) {
      // Add a small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptAllCookies = () => {
    setCookiePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
    })
    localStorage.setItem("cookieConsent", "all")
    setIsVisible(false)
  }

  const acceptSelectedCookies = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(cookiePreferences))
    setIsVisible(false)
  }

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen)
  }

  const handlePreferenceChange = (type: keyof typeof cookiePreferences) => {
    if (type === "necessary") return // Cannot change necessary cookies

    setCookiePreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-xl z-50 animate-fade-in">
      <div className="container mx-auto">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-full hidden sm:block">
              <Cookie className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">{currentLang.title}</h3>
              <p className="text-sm text-gray-600 max-w-2xl">
                {currentLang.description}{" "}
                <Link href="/chinh-sach-quyen-rieng-tu" className="text-green-600 hover:underline">
                  {currentLang.privacyPolicy}
                </Link>
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {isSettingsOpen && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-bold mb-3">{currentLang.cookieOptions}</h4>
            <div className="space-y-3">
              {[
                {
                  id: "necessary",
                  label: currentLang.necessaryCookies,
                  description: currentLang.necessaryDesc,
                  disabled: true,
                },
                {
                  id: "analytics",
                  label: currentLang.analyticsCookies,
                  description: currentLang.analyticsDesc,
                },
                {
                  id: "marketing",
                  label: currentLang.marketingCookies,
                  description: currentLang.marketingDesc,
                },
              ].map((cookie) => (
                <div key={cookie.id} className="flex items-start">
                  <div className="flex items-center h-5 mt-1">
                    <input
                      id={cookie.id}
                      type="checkbox"
                      checked={cookiePreferences[cookie.id as keyof typeof cookiePreferences]}
                      onChange={() => handlePreferenceChange(cookie.id as keyof typeof cookiePreferences)}
                      disabled={cookie.disabled}
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor={cookie.id}
                      className={`font-medium ${cookie.disabled ? "text-gray-700" : "text-gray-700"}`}
                    >
                      {cookie.label}
                    </label>
                    <p className="text-gray-500">{cookie.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSettings}
            className="text-sm border-green-600 text-green-600 hover:bg-green-50"
          >
            {isSettingsOpen ? currentLang.hideOptions : currentLang.customize}
          </Button>
          {isSettingsOpen ? (
            <Button size="sm" onClick={acceptSelectedCookies} className="bg-green-600 hover:bg-green-700 text-sm">
              {currentLang.savePreferences}
            </Button>
          ) : (
            <Button size="sm" onClick={acceptAllCookies} className="bg-green-600 hover:bg-green-700 text-sm">
              {currentLang.acceptAll}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
