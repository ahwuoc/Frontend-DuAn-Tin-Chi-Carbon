export interface Contributor {
  id?: string
  name: string
  trees: number
  createdAt?: string
  updatedAt?: string
}

export interface TreePosition {
  position: [number, number, number]
  type: number
  scale: number
  contributor: Contributor
}

export interface ForestElement {
  type: string
  position: [number, number, number]
  description: string
  contributor?: Contributor
}

export interface TreeData {
  id: string
  type: number
  position: {
    x: number
    y: number
    z: number
  }
  scale: number
  contributorId: string
  createdAt: string
  updatedAt: string
}

export interface NewsItem {
  id: number
  title_vi: string
  title_en: string
  content_vi: string
  content_en: string
  excerpt_vi: string
  excerpt_en: string
  image_url: string
  author: string
  published_date: string
  category: string
  tags: string[]
  featured: boolean
  slug: string
}
