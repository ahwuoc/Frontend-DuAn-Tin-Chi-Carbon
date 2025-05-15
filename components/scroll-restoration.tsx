"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function ScrollRestoration() {
  const pathname = usePathname()

  useEffect(() => {
    // Set scroll position to top immediately when pathname changes
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual"
      document.documentElement.style.scrollBehavior = "auto"
      document.body.style.scrollBehavior = "auto"
      window.scrollTo(0, 0)

      // Reset scroll behavior after setting position
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = ""
        document.body.style.scrollBehavior = ""
      }, 0)
    }
  }, [pathname])

  return null
}
