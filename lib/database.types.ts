export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      news: {
        Row: {
          id: number
          title_vi: string
          title_en: string
          content_vi: string
          content_en: string
          excerpt_vi: string
          excerpt_en: string
          image_url: string | null
          author: string
          published_date: string
          category: string | null
          tags: string[] | null
          featured: boolean
          slug: string
        }
        Insert: {
          id?: number
          title_vi: string
          title_en: string
          content_vi: string
          content_en: string
          excerpt_vi: string
          excerpt_en: string
          image_url?: string | null
          author: string
          published_date?: string
          category?: string | null
          tags?: string[] | null
          featured?: boolean
          slug: string
        }
        Update: {
          id?: number
          title_vi?: string
          title_en?: string
          content_vi?: string
          content_en?: string
          excerpt_vi?: string
          excerpt_en?: string
          image_url?: string | null
          author?: string
          published_date?: string
          category?: string | null
          tags?: string[] | null
          featured?: boolean
          slug?: string
        }
      }
    }
  }
}
