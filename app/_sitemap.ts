import type { MetadataRoute } from "next";
import { getAllNewsSlugServer } from "@/services/news-server";

const SITEMAP_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://tinchicarbonvietnam.vn",
  staticRoutes: [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/gioi-thieu", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/san-pham", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/san-pham/carbon-toan-thu", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/san-pham/du-an-tin-chi-carbon", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/san-pham/khoa-hoc-chung-chi-quoc-te", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/tin-tuc", priority: 0.8, changeFrequency: "daily" as const },
    { path: "/gop-mam-xanh", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/chuong-trinh-tiep-thi-lien-ket", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/dang-ky-tu-van", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" as const },
  ],
  newsConfig: {
    priority: 0.6,
    changeFrequency: "monthly" as const,
  },
} as const;

// Type definitions
type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: ChangeFrequency;
  priority: number;
}

// Utility functions
function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-_]+$/i.test(slug) && slug.trim().length > 0;
}

function buildUrl(baseUrl: string, path: string): string {
  const cleanBaseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return path === "" ? cleanBaseUrl : `${cleanBaseUrl}${cleanPath}`;
}

function createStaticRoutes(baseUrl: string): SitemapEntry[] {
  return SITEMAP_CONFIG.staticRoutes.map((route) => ({
    url: buildUrl(baseUrl, route.path),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

function createNewsRoutes(baseUrl: string, newsSlugs: string[]): SitemapEntry[] {
  return newsSlugs
    .filter((slug): slug is string => {
      if (typeof slug !== "string") {
        console.warn("[Sitemap] Non-string slug skipped:", slug);
        return false;
      }
      
      if (!isValidSlug(slug)) {
        console.warn("[Sitemap] Invalid slug skipped:", slug);
        return false;
      }
      
      return true;
    })
    .map((slug) => ({
      url: buildUrl(baseUrl, `/tin-tuc/${slug}`),
      lastModified: new Date(),
      changeFrequency: SITEMAP_CONFIG.newsConfig.changeFrequency,
      priority: SITEMAP_CONFIG.newsConfig.priority,
    }));
}

// Main sitemap function
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    console.log("[Sitemap] Generating sitemap...");
    console.log("[Sitemap] Base URL:", SITEMAP_CONFIG.baseUrl);

    // Get news articles
    let newsArticles: string[] = [];
    try {
      newsArticles = await getAllNewsSlugServer();
      console.log(`[Sitemap] Found ${newsArticles.length} news articles`);
    } catch (error) {
      console.error("[Sitemap] Error fetching news articles:", error);
      // Continue with static routes only
    }

    // Create static routes
    const staticRoutes = createStaticRoutes(SITEMAP_CONFIG.baseUrl);
    console.log(`[Sitemap] Generated ${staticRoutes.length} static routes`);

    // Create news routes
    const newsRoutes = createNewsRoutes(SITEMAP_CONFIG.baseUrl, newsArticles);
    console.log(`[Sitemap] Generated ${newsRoutes.length} news routes`);

    // Combine all routes
    const allRoutes = [...staticRoutes, ...newsRoutes];
    console.log(`[Sitemap] Total routes: ${allRoutes.length}`);

    return allRoutes;
  } catch (error) {
    console.error("[Sitemap] Error generating sitemap:", error);
    
    // Fallback: return only static routes
    const fallbackRoutes = createStaticRoutes(SITEMAP_CONFIG.baseUrl);
    console.log("[Sitemap] Using fallback with static routes only");
    
    return fallbackRoutes;
  }
}
