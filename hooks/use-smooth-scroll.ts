"use client"

import { useEffect } from "react"

export function useSmoothScroll() {
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a")

      if (!link) return

      const href = link.getAttribute("href")
      if (!href || !href.startsWith("#")) return

      const targetElement = document.querySelector(href)
      if (!targetElement) return

      e.preventDefault()

      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }

    document.addEventListener("click", handleLinkClick)

    return () => {
      document.removeEventListener("click", handleLinkClick)
    }
  }, [])
}
