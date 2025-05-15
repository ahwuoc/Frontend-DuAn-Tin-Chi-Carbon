"use client"

import { useState, useEffect, useCallback, type FormEvent } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"

// Define search result data structure
interface SearchResult {
  id: string
  title: {
    vi: string
    en: string
  }
  description: {
    vi: string
    en: string
  }
  url: string
  image?: string
  type: "page" | "product" | "news" | "service"
}

// Sample data with both languages
const sampleData: SearchResult[] = [
  {
    id: "1",
    title: {
      vi: "Khóa học chứng chỉ quốc tế từ CSU",
      en: "International Certificate Courses from CSU",
    },
    description: {
      vi: "Khóa học chứng chỉ quốc tế về carbon và phát triển bền vững từ Colorado State University.",
      en: "International certificate courses on carbon and sustainable development from Colorado State University.",
    },
    url: "/san-pham/khoa-hoc-chung-chi-quoc-te",
    image: "/images/certificate-sample.png",
    type: "product",
  },
  {
    id: "2",
    title: {
      vi: "Dự án tín chỉ carbon",
      en: "Carbon Credit Projects",
    },
    description: {
      vi: "Triển khai dự án tín chỉ carbon, tạo nguồn thu nhập bền vững từ việc bảo vệ rừng.",
      en: "Implement carbon credit projects, creating sustainable income from forest protection.",
    },
    url: "/san-pham/du-an-tin-chi-carbon",
    image: "/images/after-reforestation.png",
    type: "product",
  },
  {
    id: "3",
    title: {
      vi: "Carbon Toàn Thư 4.0",
      en: "Carbon Encyclopedia 4.0",
    },
    description: {
      vi: "Nền tảng kiến thức toàn diện về carbon và phát triển bền vững với trợ lý AI.",
      en: "Comprehensive knowledge platform on carbon and sustainable development with AI assistant.",
    },
    url: "/san-pham/carbon-toan-thu",
    image: "/images/logo.png",
    type: "product",
  },
  {
    id: "4",
    title: {
      vi: "Giới thiệu về Tín Chỉ Carbon Việt Nam",
      en: "About Carbon Credits Vietnam",
    },
    description: {
      vi: "Tìm hiểu về sứ mệnh và tầm nhìn của Tín Chỉ Carbon Việt Nam.",
      en: "Learn about the mission and vision of Carbon Credits Vietnam.",
    },
    url: "/gioi-thieu",
    image: "/images/about-image.jpg",
    type: "page",
  },
  {
    id: "5",
    title: {
      vi: "Tin tức mới nhất về carbon",
      en: "Latest Carbon News",
    },
    description: {
      vi: "Cập nhật tin tức mới nhất về thị trường carbon và phát triển bền vững.",
      en: "Get the latest updates on the carbon market and sustainable development.",
    },
    url: "/tin-tuc",
    image: "/images/news-hero.jpg",
    type: "news",
  },
  {
    id: "6",
    title: {
      vi: "Dịch vụ và công cụ tính toán",
      en: "Services and Calculation Tools",
    },
    description: {
      vi: "Các dịch vụ tư vấn và công cụ tính toán carbon footprint.",
      en: "Consulting services and carbon footprint calculation tools.",
    },
    url: "/dich-vu-va-cong-cu-tinh-toan",
    image: "/images/services-hero.jpg",
    type: "service",
  },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(query)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { language } = useLanguage()

  // Define translations directly to avoid any issues with the t function
  const translations = {
    en: {
      search_results: "Search Results",
      search_placeholder: "Search...",
      search: "Search",
      found: "Found",
      results_for: "results for",
      no_results_for: "No results found for",
      view_details: "View details",
      no_results_found: "No results found",
      search_information: "Search Information",
      page: "Page",
      product: "Product",
      news: "News",
      service: "Service",
      other: "Other",
    },
    vi: {
      search_results: "Kết quả tìm kiếm",
      search_placeholder: "Tìm kiếm...",
      search: "Tìm kiếm",
      found: "Tìm thấy",
      results_for: "kết quả cho",
      no_results_for: "Không tìm thấy kết quả nào cho",
      view_details: "Xem chi tiết",
      no_results_found: "Không tìm thấy kết quả",
      search_information: "Tìm kiếm thông tin",
      page: "Trang",
      product: "Sản phẩm",
      news: "Tin tức",
      service: "Dịch vụ",
      other: "Khác",
    },
  }

  // Get translation based on current language
  const t = (key: string): string => {
    return translations[language]?.[key] || translations.vi[key] || key
  }

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    router.push(`/tim-kiem?q=${encodeURIComponent(searchQuery)}`)
  }

  // Search function
  const performSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      const searchTerms = searchQuery.toLowerCase().split(" ")

      // Filter results based on current language
      const filteredResults = sampleData.filter((item) => {
        const titleMatch = searchTerms.some((term) =>
          item.title[language as keyof typeof item.title].toLowerCase().includes(term),
        )
        const descriptionMatch = searchTerms.some((term) =>
          item.description[language as keyof typeof item.description].toLowerCase().includes(term),
        )
        return titleMatch || descriptionMatch
      })

      setResults(filteredResults)
    },
    [language],
  )

  useEffect(() => {
    setIsLoading(true)
    // Simulate search delay
    const timer = setTimeout(() => {
      performSearch(query)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [query, performSearch])

  // Update search query when URL changes
  useEffect(() => {
    setSearchQuery(query)
  }, [query])

  // Display result type label
  const getResultTypeLabel = (type: string) => {
    switch (type) {
      case "page":
        return t("page")
      case "product":
        return t("product")
      case "news":
        return t("news")
      case "service":
        return t("service")
      default:
        return t("other")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{t("search_results")}</h1>

          {/* Search form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleSubmit} className="flex items-center">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("search_placeholder")}
                  className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <Button type="submit" className="ml-2 bg-green-600 hover:bg-green-700 py-3 px-6">
                {t("search")}
              </Button>
            </form>
          </div>

          {/* Display results */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <>
                {query && (
                  <p className="text-gray-600 mb-6">
                    {results.length > 0
                      ? `${t("found")} ${results.length} ${t("results_for")} "${query}"`
                      : `${t("no_results_for")} "${query}"`}
                  </p>
                )}

                {results.length > 0 ? (
                  <div className="space-y-6">
                    {results.map((result) => (
                      <div key={result.id} className="flex border-b border-gray-200 pb-6 last:border-0">
                        {result.image && (
                          <div className="flex-shrink-0 mr-4">
                            <div className="relative h-24 w-24 md:h-32 md:w-32 overflow-hidden rounded-lg">
                              <Image
                                src={result.image || "/placeholder.svg"}
                                alt={result.title[language as keyof typeof result.title]}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex-grow">
                          <div className="flex items-center mb-1">
                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full mr-2">
                              {getResultTypeLabel(result.type)}
                            </span>
                          </div>
                          <Link href={result.url} className="block">
                            <h2 className="text-xl font-semibold text-gray-900 hover:text-green-600 transition-colors mb-2">
                              {result.title[language as keyof typeof result.title]}
                            </h2>
                          </Link>
                          <p className="text-gray-600 mb-3">
                            {result.description[language as keyof typeof result.description]}
                          </p>
                          <Link
                            href={result.url}
                            className="text-green-600 hover:text-green-700 font-medium inline-flex items-center"
                          >
                            {t("view_details")}
                            <svg
                              className="w-4 h-4 ml-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : query ? (
                  <div className="text-center py-12">
                    <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">{t("no_results_found")}</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      {language === "en"
                        ? `No results found for "${query}". Please try again with different keywords.`
                        : `Không tìm thấy kết quả nào phù hợp với từ khóa "${query}". Vui lòng thử lại với từ khóa khác.`}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">{t("search_information")}</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      {language === "en"
                        ? "Enter keywords to search for information about Carbon Credits Vietnam's products, services, and news."
                        : "Nhập từ khóa để tìm kiếm thông tin về sản phẩm, d��ch vụ và tin tức của Tín Chỉ Carbon Việt Nam."}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
