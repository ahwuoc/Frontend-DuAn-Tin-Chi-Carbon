import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight } from "lucide-react"
import { getFeaturedNewsServer, getRecentNewsServer, getCategoriesServer } from "@/services/news-server"
import { format } from "date-fns"

export const metadata: Metadata = {
  title: "Tin tức & Sự kiện | Tín Chỉ Carbon Việt Nam",
  description: "Cập nhật tin tức mới nhất về tín chỉ carbon và phát triển bền vững tại Việt Nam",
  alternates: {
    languages: {
      en: "/en/news",
      vi: "/tin-tuc",
    },
  },
}

export default async function NewsPageServer() {
  const featuredNews = await getFeaturedNewsServer()
  const recentNews = await getRecentNewsServer(6, featuredNews?.id)
  const categories = await getCategoriesServer()

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy")
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] bg-black">
        <div className="absolute inset-0 z-0">
          {/* Video Background */}
          <div className="absolute inset-0 w-full h-full">
            <video
              src="https://res.cloudinary.com/dyticflm3/video/upload/v1744623688/farmer_harvest_sl2oge.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              fetchPriority="high"
              poster="/images/vietnam-farmer-639204_1920.jpg"
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
          </div>
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">TIN TỨC & SỰ KIỆN</h1>
          <p className="text-white text-lg max-w-xl">
            Cập nhật tin tức mới nhất về tín chỉ carbon và phát triển bền vững
          </p>
        </div>
      </section>

      {/* News Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Main Content */}
            <div className="w-full md:w-2/3">
              {/* Search Bar - This will be client-side */}
              <div className="mb-12 relative">
                <form action="/tim-kiem" method="GET">
                  <input
                    type="text"
                    name="q"
                    placeholder="Tìm kiếm tin tức..."
                    className="w-full pl-12 py-6 text-lg border rounded-md"
                  />
                  <button type="submit" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </button>
                </form>
              </div>

              {/* Featured Article */}
              {featuredNews && (
                <div className="mb-12">
                  <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl mb-6">
                    <Image
                      src={featuredNews.image_url || "/placeholder.svg?height=400&width=800"}
                      alt={featuredNews.title_vi}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="flex items-center gap-4 mb-4 text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(featuredNews.published_date)}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>{featuredNews.author}</span>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-gray-800">{featuredNews.title_vi}</h2>
                  <p className="text-lg text-gray-600 mb-6">{featuredNews.excerpt_vi}</p>
                  <Link href={`/tin-tuc/${featuredNews.slug}`}>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Đọc thêm <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}

              {/* News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recentNews.map((news) => (
                  <Card key={news.id} className="hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48">
                      <Image
                        src={news.image_url || "/placeholder.svg?height=192&width=400"}
                        alt={news.title_vi}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-4 mb-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(news.published_date)}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          <span>{news.author}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl">{news.title_vi}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-gray-600">{news.excerpt_vi}</p>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/tin-tuc/${news.slug}`}>
                        <Button variant="link" className="text-green-600 p-0 hover:text-green-700">
                          Đọc thêm <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Pagination - This would be implemented with server actions in a real app */}
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  <Button variant="outline" className="w-10 h-10 p-0">
                    1
                  </Button>
                  <Button variant="outline" className="w-10 h-10 p-0">
                    2
                  </Button>
                  <Button variant="outline" className="w-10 h-10 p-0">
                    3
                  </Button>
                  <Button variant="outline" className="w-10 h-10 p-0">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full md:w-1/3">
              {/* Categories */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Danh mục</h3>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <Link href={`/tin-tuc/danh-muc/${encodeURIComponent(category)}`} key={index}>
                      <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer">
                        <span>{category}</span>
                        <ArrowRight className="h-4 w-4 text-green-600" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Posts */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Bài viết gần đây</h3>
                <div className="space-y-4">
                  {recentNews.slice(0, 4).map((post) => (
                    <Link href={`/tin-tuc/${post.slug}`} key={post.id}>
                      <div className="flex gap-4">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={post.image_url || "/placeholder.svg?height=80&width=80"}
                            alt={post.title_vi}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 hover:text-green-600 transition-colors duration-200">
                            {post.title_vi}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">{formatDate(post.published_date)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Thẻ</h3>
                <div className="flex flex-wrap gap-2">
                  {/* Extract unique tags from all news items */}
                  {Array.from(new Set(recentNews.flatMap((news) => news.tags || []))).map((tag, index) => (
                    <Link href={`/tin-tuc/tag/${encodeURIComponent(tag)}`} key={index}>
                      <div className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full cursor-pointer text-sm">
                        {tag}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
