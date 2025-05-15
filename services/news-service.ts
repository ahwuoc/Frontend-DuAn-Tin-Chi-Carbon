import { createClient } from "@/lib/supabase/client"
import type { NewsItem } from "@/lib/types"

export async function getFeaturedNews(): Promise<NewsItem | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("featured", true)
    .order("published_date", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error("Error fetching featured news:", error)
    return null
  }

  return data
}

export async function getRecentNews(limit = 6, excludeId?: number): Promise<NewsItem[]> {
  const supabase = createClient()

  let query = supabase.from("news").select("*").order("published_date", { ascending: false }).limit(limit)

  if (excludeId) {
    query = query.neq("id", excludeId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching recent news:", error)
    return []
  }

  return data || []
}

export async function getNewsByCategory(category: string, limit = 10): Promise<NewsItem[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("category", category)
    .order("published_date", { ascending: false })
    .limit(limit)

  if (error) {
    console.error(`Error fetching news for category ${category}:`, error)
    return []
  }

  return data || []
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("news").select("*").eq("slug", slug).single()

  if (error) {
    console.error(`Error fetching news with slug ${slug}:`, error)
    return null
  }

  return data
}

export async function searchNews(query: string): Promise<NewsItem[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .or(`title_vi.ilike.%${query}%,title_en.ilike.%${query}%,content_vi.ilike.%${query}%,content_en.ilike.%${query}%`)
    .order("published_date", { ascending: false })

  if (error) {
    console.error(`Error searching news for "${query}":`, error)
    return []
  }

  return data || []
}
