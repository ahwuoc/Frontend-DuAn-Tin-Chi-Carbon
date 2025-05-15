import { createServerClient } from "@/lib/supabase/server"
import type { NewsItem } from "@/lib/types"

export async function getFeaturedNewsServer(): Promise<NewsItem | null> {
  const supabase = createServerClient()

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

export async function getRecentNewsServer(limit = 6, excludeId?: number): Promise<NewsItem[]> {
  const supabase = createServerClient()

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

export async function getNewsBySlugServer(slug: string): Promise<NewsItem | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("news").select("*").eq("slug", slug).single()

  if (error) {
    console.error(`Error fetching news with slug ${slug}:`, error)
    return null
  }

  return data
}

export async function getAllNewsSlugServer(): Promise<string[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("news").select("slug")

  if (error) {
    console.error("Error fetching news slugs:", error)
    return []
  }

  return (data || []).map((item) => item.slug)
}

export async function getCategoriesServer(): Promise<string[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("news").select("category").not("category", "is", null)

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  // Extract unique categories
  const categories = [...new Set(data.map((item) => item.category))]
  return categories
}
