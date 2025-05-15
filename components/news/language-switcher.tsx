"use client"

import { useLanguage } from "@/context/language-context"
import { useEffect, useState } from "react"
import type { NewsItem } from "@/lib/types"

interface LanguageSwitcherProps {
  news: NewsItem
}

export default function NewsLanguageSwitcher({ news }: LanguageSwitcherProps) {
  const { language } = useLanguage()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  useEffect(() => {
    setTitle(language === "en" ? news.title_en : news.title_vi)
    setContent(language === "en" ? news.content_en : news.content_vi)
  }, [language, news])

  return (
    <>
      <h1 className="text-4xl font-bold mb-6">{title}</h1>
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </>
  )
}
