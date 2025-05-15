import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, User, Tag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getNewsBySlugServer, getAllNewsSlugServer } from "@/services/news-server"
import { format } from "date-fns"

// Generate static params for all news articles
export async function generateStaticParams() {
  const slugs = await getAllNewsSlugServer()
  return slugs.map((slug) => ({ slug }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const news = await getNewsBySlugServer(params.slug)

  if (!news) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    }
  }

  return {
    title: `${news.title_vi} | Tín Chỉ Carbon Việt Nam`,
    description: news.excerpt_vi,
    alternates: {
      languages: {
        en: `/en/news/${params.slug}`,
        vi: `/tin-tuc/${params.slug}`,
      },
    },
    openGraph: {
      title: news.title_vi,
      description: news.excerpt_vi,
      images: [
        {
          url: news.image_url || "/og-image.png",
          width: 1200,
          height: 630,
          alt: news.title_vi,
        },
      ],
    },
  }
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const news = await getNewsBySlugServer(params.slug)

  if (!news) {
    notFound()
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy")
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/tin-tuc">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại Tin tức
        </Button>
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{news.title_vi}</h1>

        <div className="flex items-center gap-6 mb-8 text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(news.published_date)}</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span>{news.author}</span>
          </div>
          {news.category && (
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              <span>{news.category}</span>
            </div>
          )}
        </div>

        <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl mb-8">
          <Image
            src={news.image_url || "/placeholder.svg?height=400&width=800"}
            alt={news.title_vi}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: news.content_vi }} />
        </div>

        {news.tags && news.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Thẻ:</h3>
            <div className="flex flex-wrap gap-2">
              {news.tags.map((tag, index) => (
                <span key={index} className="px-4 py-2 bg-gray-50 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
