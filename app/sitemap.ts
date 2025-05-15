import type { MetadataRoute } from "next"
import { getAllNewsSlugServer } from "@/services/news-server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all news slugs
  const newsArticles = await getAllNewsSlugServer()

  // Base URL
  const baseUrl = "https://tinchicarbonvietnam.vn"

  // Static routes
  const routes = [
    "",
    "/gioi-thieu",
    "/san-pham",
    "/san-pham/carbon-toan-thu",
    "/san-pham/du-an-tin-chi-carbon",
    "/san-pham/khoa-hoc-chung-chi-quoc-te",
    "/tin-tuc",
    "/gop-mam-xanh",
    "/chuong-trinh-tiep-thi-lien-ket",
    "/dang-ky-tu-van",
    "/faq",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  // News article routes
  const newsRoutes = newsArticles.map((slug) => ({
    url: `${baseUrl}/tin-tuc/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...routes, ...newsRoutes]
}
