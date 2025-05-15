"use client"

import { useEffect, useState } from "react"

export default function PreloadVideo() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const videoSources = [
        "https://i4rba5q0kc4herk0.public.blob.vercel-storage.com/%E1%BA%A2nh%20minh%20h%E1%BB%8Da/rice%20paddle%20vid%20-%20Copy-7cYaE7ujNNgtdFVHP39kYPZYMjOKmr.mp4",
      ]

      // Preload videos
      videoSources.forEach((src) => {
        const video = document.createElement("video")
        video.preload = "auto"
        video.src = src
        video.onloadeddata = () => {
          setIsLoaded(true)
        }
        video.onerror = () => {
          console.warn("Failed to preload video:", src)
          setIsLoaded(true) // Continue anyway
        }
      })
    } catch (error) {
      console.error("Error in PreloadVideo:", error)
      setIsLoaded(true) // Continue anyway
    }
  }, [])

  return null
}
