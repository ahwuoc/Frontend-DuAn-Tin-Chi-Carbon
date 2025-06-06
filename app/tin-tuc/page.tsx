"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useEffect, useRef, useState } from "react";
import { apiNews, INews } from "@/app/fetch/fetch.news";
import { formatDateUtil } from "../utils/common";
import Link from "next/link";
import DOMPurify from "dompurify"; // Import DOMPurify để làm sạch HTML

export default function NewsPage() {
  const { t, language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [news, setNews] = useState<INews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const preloadedVideo = document.querySelector(
      'video[data-preloaded="true"]',
    ) as HTMLVideoElement;
    if (videoRef.current && preloadedVideo) {
      videoRef.current.currentTime = preloadedVideo.currentTime;
      videoRef.current.play().catch((err) => {
        console.log("Video display play failed:", err);
      });
    }
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await apiNews.getAll();
        if (response?.payload) {
          setNews(response.payload.data);
        } else {
          throw new Error("Không lấy được danh sách tin tức");
        }
      } catch (err: any) {
        console.error("Lỗi khi lấy dữ liệu tin tức:", err);
        setError("Không thể tải danh sách tin tức. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Thử lại
        </Button>
      </div>
    );
  }

  const safeNews = Array.isArray(news) ? news : [];
  // Lấy tin tức nổi bật đầu tiên có trạng thái "published"
  const featuredNews =
    safeNews.find((item) => item.status === "published") ?? null;
  // Lấy các tin tức khác cho phần lưới, bỏ qua tin tức nổi bật và chỉ lấy tin đã xuất bản
  const gridNews = safeNews
    .filter(
      (item) => item.status === "published" && item._id !== featuredNews?._id,
    )
    .slice(0, 6);
  // Lấy 4 bài viết gần đây nhất, chỉ lấy tin đã xuất bản
  const recentPosts = safeNews
    .filter((item) => item.status === "published")
    .slice(0, 4);

  /**
   * Hàm làm sạch và render HTML từ Tiptap.
   * Sử dụng DOMPurify để ngăn chặn các cuộc tấn công XSS.
   * @param htmlContent Chuỗi HTML cần hiển thị.
   * @returns Đối tượng có thuộc tính __html để sử dụng với dangerouslySetInnerHTML.
   */
  const renderRichText = (htmlContent: string | undefined) => {
    // Đảm bảo htmlContent là một chuỗi trước khi xử lý
    if (!htmlContent) {
      return { __html: "" };
    }
    // Sử dụng DOMPurify để làm sạch HTML
    // USE_PROFILES: { html: true } cho phép các thẻ HTML thông thường như p, strong, ul, li, v.v.
    const cleanHtml = DOMPurify.sanitize(htmlContent, {
      USE_PROFILES: { html: true },
    });
    return { __html: cleanHtml };
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] bg-black">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 w-full h-full">
            <video
              ref={videoRef}
              src="https://res.cloudinary.com/dyticflm3/video/upload/v1744623688/farmer_harvest_sl2oge.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="/images/vietnam-farmer-639204_1920.jpg"
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
          </div>
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            {language === "en" ? "NEWS & EVENTS" : "TIN TỨC & SỰ KIỆN"}
          </h1>
          <p className="text-white text-lg max-w-xl">
            {language === "en"
              ? "Get the latest updates on carbon credits and sustainable development"
              : "Cập nhật tin tức mới nhất về tín chỉ carbon và phát triển bền vững"}
          </p>
        </div>
      </section>

      {/* News Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Main Content */}
            <div className="w-full md:w-2/3">
              {/* Search Bar */}
              <div className="mb-12 relative">
                <Input
                  type="text"
                  placeholder={t("search_news")}
                  className="pl-12 py-6 text-lg"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Featured Article */}
              {featuredNews && (
                <div className="mb-12">
                  <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl mb-6">
                    <Image
                      src={
                        featuredNews.image ||
                        "/placeholder.svg?height=400&width=800"
                      }
                      alt={featuredNews.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-4 mb-4 text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDateUtil(featuredNews.createdAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {/* userId là null, hiển thị giá trị mặc định */}
                      <span>Admin</span>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-gray-800">
                    {featuredNews.title}
                  </h2>
                  {/* Dùng dangerouslySetInnerHTML để render nội dung từ Tiptap */}
                  <div
                    // Thêm class 'prose' của Tailwind Typography để định dạng nội dung HTML
                    className="text-lg text-gray-600 mb-6 prose max-w-none"
                    dangerouslySetInnerHTML={renderRichText(
                      featuredNews.content
                        ? featuredNews.content.substring(0, 250) + "..."
                        : "",
                    )}
                  />
                  <Link href={`/tin-tuc/${featuredNews._id}`}>
                    <Button
                      variant="link"
                      className="text-green-600 p-0 hover:text-green-700"
                    >
                      Đọc thêm <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              )}

              {/* News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Array.isArray(gridNews) &&
                  gridNews.map((newsItem: any, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="relative h-48">
                        <Image
                          src={
                            newsItem.image ||
                            "/placeholder.svg?height=192&width=400"
                          }
                          alt={newsItem.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-4 mb-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{formatDateUtil(newsItem.createdAt)}</span>
                          </div>
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            <span>Admin</span>
                          </div>
                        </div>
                        <CardTitle className="text-xl">
                          {newsItem.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        {/* Dùng dangerouslySetInnerHTML để render nội dung tóm tắt đã cắt */}
                        <div
                          className="text-gray-600 prose-sm max-w-none" // prose-sm để định dạng nhỏ hơn
                          dangerouslySetInnerHTML={renderRichText(
                            newsItem.content
                              ? newsItem.content.substring(0, 100) + "..."
                              : "", // Đảm bảo content không phải undefined
                          )}
                        />
                      </CardContent>
                      <CardFooter>
                        <Link href={`/tin-tuc/${newsItem._id}`}>
                          <Button
                            variant="link"
                            className="text-green-600 p-0 hover:text-green-700"
                          >
                            Đọc thêm <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
              </div>

              {/* Pagination */}
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
                <h3 className="text-2xl font-bold mb-6 text-gray-800">
                  {t("categories")}
                </h3>
                <div className="space-y-2">
                  {Array.from(new Set(news.map((n) => n.category))).map(
                    (category, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer"
                      >
                        <span>{category}</span>
                        <ArrowRight className="h-4 w-4 text-green-600" />
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Recent Posts */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">
                  {t("recent_posts")}
                </h3>
                <div className="space-y-4">
                  {Array.isArray(recentPosts) &&
                    recentPosts.map((post, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={
                              post.image ||
                              "/placeholder.svg?height=80&width=80"
                            }
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Link href={`/tin-tuc/${post._id}`}>
                            <h4 className="font-medium text-gray-800 hover:text-green-600 transition-colors duration-200 cursor-pointer">
                              {post.title}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDateUtil(post.createdAt)}
                            </p>
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800">
                  {t("tags")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(news.flatMap((n) => n.tags || []))).map(
                    (tag, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full cursor-pointer text-sm"
                      >
                        {tag}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
