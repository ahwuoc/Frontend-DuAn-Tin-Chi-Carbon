import { createClient } from "@/lib/supabase/client";
import type { NewsItem } from "@/lib/types";

// Configuration
const NEWS_CONFIG = {
  defaultLimit: 6,
  maxLimit: 50,
  searchFields: ["title_vi", "title_en", "content_vi", "content_en"] as const,
} as const;

// Custom error types
class NewsServiceError extends Error {
  constructor(
    public operation: string,
    public originalError: any,
    message?: string
  ) {
    super(message || `News service error in ${operation}`);
    this.name = "NewsServiceError";
  }
}

// Utility functions
function validateLimit(limit: number): number {
  if (limit <= 0) return NEWS_CONFIG.defaultLimit;
  if (limit > NEWS_CONFIG.maxLimit) return NEWS_CONFIG.maxLimit;
  return limit;
}

function validateSlug(slug: string): boolean {
  return typeof slug === "string" && slug.trim().length > 0;
}

function validateCategory(category: string): boolean {
  return typeof category === "string" && category.trim().length > 0;
}

function validateSearchQuery(query: string): boolean {
  return typeof query === "string" && query.trim().length > 0;
}

function sanitizeSearchQuery(query: string): string {
  return query.trim().replace(/[%_]/g, "\\$&"); // Escape special characters
}

function buildSearchFilter(query: string): string {
  const sanitizedQuery = sanitizeSearchQuery(query);
  return NEWS_CONFIG.searchFields
    .map(field => `${field}.ilike.%${sanitizedQuery}%`)
    .join(",");
}

export async function getFeaturedNews(): Promise<NewsItem | null> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("featured", true)
      .eq("status", "published") // Only published news
      .order("published_date", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      throw new NewsServiceError("getFeaturedNews", error);
    }

    return data as unknown as NewsItem | null;
  } catch (error) {
    console.error("[NewsService] Error fetching featured news:", error);
    return null;
  }
}

export async function getRecentNews(
  limit = NEWS_CONFIG.defaultLimit,
  excludeId?: number
): Promise<NewsItem[]> {
  try {
    const validatedLimit = validateLimit(limit);
    const supabase = createClient();

    let query = supabase
      .from("news")
      .select("*")
      .eq("status", "published") // Only published news
      .order("published_date", { ascending: false })
      .limit(validatedLimit);

    if (excludeId && typeof excludeId === "number" && excludeId > 0) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query;

    if (error) {
      throw new NewsServiceError("getRecentNews", error);
    }

    return (data || []) as unknown as NewsItem[];
  } catch (error) {
    console.error("[NewsService] Error fetching recent news:", error);
    return [];
  }
}

export async function getNewsByCategory(
  category: string,
  limit = 10
): Promise<NewsItem[]> {
  try {
    if (!validateCategory(category)) {
      console.warn("[NewsService] Invalid category provided:", category);
      return [];
    }

    const validatedLimit = validateLimit(limit);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("category", category.trim())
      .eq("status", "published") // Only published news
      .order("published_date", { ascending: false })
      .limit(validatedLimit);

    if (error) {
      throw new NewsServiceError("getNewsByCategory", error);
    }

    return (data || []) as unknown as NewsItem[];
  } catch (error) {
    console.error(`[NewsService] Error fetching news for category ${category}:`, error);
    return [];
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  try {
    if (!validateSlug(slug)) {
      console.warn("[NewsService] Invalid slug provided:", slug);
      return null;
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("slug", slug.trim())
      .eq("status", "published") // Only published news
      .single();

    if (error) {
      // Don't throw error for "not found" - this is expected
      if (error.code === "PGRST116") {
        console.log(`[NewsService] News not found with slug: ${slug}`);
        return null;
      }
      throw new NewsServiceError("getNewsBySlug", error);
    }

    return (data || []) as unknown as NewsItem | null;
  } catch (error) {
    console.error(`[NewsService] Error fetching news with slug ${slug}:`, error);
    return null;
  }
}

export async function searchNews(query: string): Promise<NewsItem[]> {
  try {
    if (!validateSearchQuery(query)) {
      console.warn("[NewsService] Invalid search query provided:", query);
      return [];
    }

    const supabase = createClient();
    const searchFilter = buildSearchFilter(query);

    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("status", "published") // Only published news
      .or(searchFilter)
      .order("published_date", { ascending: false })
      .limit(NEWS_CONFIG.maxLimit);

    if (error) {
      throw new NewsServiceError("searchNews", error);
    }

    return (data || []) as unknown as NewsItem[];
  } catch (error) {
    console.error(`[NewsService] Error searching news for "${query}":`, error);
    return [];
  }
}

export async function getNewsCategories(): Promise<string[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("news")
      .select("category")
      .eq("status", "published")
      .not("category", "is", null);

    if (error) {
      throw new NewsServiceError("getNewsCategories", error);
    }

    // Get unique categories
    const categories = [...new Set(data?.map(item => item.category).filter(Boolean))];
    return categories.sort() as unknown as string[];
  } catch (error) {
    console.error("[NewsService] Error fetching news categories:", error);
    return [];
  }
}

export async function getNewsCount(): Promise<number> {
  try {
    const supabase = createClient();

    const { count, error } = await supabase
      .from("news")
      .select("*", { count: "exact", head: true })
      .eq("status", "published");

    if (error) {
      throw new NewsServiceError("getNewsCount", error);
    }

    return count || 0;
  } catch (error) {
    console.error("[NewsService] Error fetching news count:", error);
    return 0;
  }
}

// Export error type for external use
export { NewsServiceError };
