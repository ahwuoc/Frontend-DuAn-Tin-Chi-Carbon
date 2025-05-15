"use client"

import { useState } from "react"
import { useLanguage } from "@/context/language-context"
import CertificateGenerator from "./certificate-generator"

interface TreeCertificateProps {
  name: string
  treeCount: number
  treeId: string
  note?: string
  date?: Date
  showVideo?: boolean
  onGenerated?: (videoUrl: string) => void
}

export default function TreeCertificate({
  name,
  treeCount,
  treeId,
  note,
  date = new Date(),
  showVideo = false,
  onGenerated,
}: TreeCertificateProps) {
  const { language } = useLanguage()
  // Video certificate là lựa chọn duy nhất hiện tại
  const [isDownloading, setIsDownloading] = useState(false)
  const [certificateVideoUrl, setCertificateVideoUrl] = useState<string | null>(null)

  const formattedDate = new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)

  const handleVideoGenerated = (videoUrl: string) => {
    setCertificateVideoUrl(videoUrl)
    if (onGenerated) {
      onGenerated(videoUrl)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <CertificateGenerator
          name={name}
          treeCount={treeCount}
          treeId={treeId}
          note={note}
          date={date}
          onGenerated={handleVideoGenerated}
        />
      </div>
    </div>
  )
}
