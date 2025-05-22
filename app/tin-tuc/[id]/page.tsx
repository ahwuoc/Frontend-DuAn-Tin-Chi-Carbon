"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { apiNews } from "../../fetch/fetch.news";

interface NewsItem {
  _id: string;
  title: string;
  content: string; // Nội dung HTML từ Tiptap
  userId?: string;
  category?: string;
  status?: string;
  image?: string; // Ảnh minh họa
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  __v?: number;
  author?: string;
  excerpt_vi?: string;
}

export default function NewsDetailPage() {
  const { id } = useParams() as { id: string };
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    async function fetchNews() {
      setIsLoading(true);
      try {
        const res = await apiNews.getById(id);
        if (res && res.payload && res.payload.data) {
          setNewsItem(res.payload.data);
        } else {
          setNewsItem(null);
        }
      } catch (err) {
        console.error("Error fetching news detail:", err);
        setNewsItem(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNews();
  }, [id]);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? dateString : format(date, "dd/MM/yyyy");
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] text-xl text-gray-600 dark:text-gray-400">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Đang tải...
      </div>
    );
  }

  if (!newsItem && !isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] text-xl text-red-600 dark:text-red-400">
        Không tìm thấy tin tức này.
      </div>
    );
  }

  return (
    <article className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 leading-tight mb-4">
            {newsItem.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500 dark:text-gray-400 text-sm">
            {newsItem.createdAt && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(newsItem.createdAt)}</span>
              </div>
            )}
            {newsItem.author && (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{newsItem.author}</span>
              </div>
            )}
          </div>
        </header>
        {newsItem.image && (
          <div className="relative w-full h-60 md:h-80 lg:h-96 rounded-lg overflow-hidden mb-10 shadow-lg">
            <Image
              src={newsItem.image}
              alt={newsItem.title || "Article Image"}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
            />
          </div>
        )}
        <section className="prose dark:prose-invert max-w-none mb-10">
          <div
            className="content-images"
            dangerouslySetInnerHTML={{ __html: newsItem.content }}
          />
        </section>
        {newsItem.tags && newsItem.tags.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Tags:
            </h3>
            <div className="flex flex-wrap gap-2">
              {newsItem.tags.map((tag, index) => (
                <Link
                  href={`/tin-tuc/tag/${encodeURIComponent(tag)}`}
                  key={index}
                >
                  <div className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm cursor-pointer transition-colors">
                    {tag}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="mt-12">
          <Link href="/tin-tuc">
            <Button
              variant="outline"
              className="text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}