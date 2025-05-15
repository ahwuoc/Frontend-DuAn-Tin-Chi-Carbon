"use client"

import { useEffect, useState } from "react"

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)
  const [isHidden, setIsHidden] = useState(true)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsHidden(false)
    }

    const updateCursorType = () => {
      const target = document.elementFromPoint(position.x, position.y)
      if (!target) return

      const computedStyle = window.getComputedStyle(target)
      setIsPointer(computedStyle.cursor === "pointer")
    }

    const handleMouseLeave = () => {
      setIsHidden(true)
    }

    window.addEventListener("mousemove", updatePosition)
    window.addEventListener("mousemove", updateCursorType)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", updatePosition)
      window.removeEventListener("mousemove", updateCursorType)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [position])

  if (typeof window === "undefined") return null

  return (
    <>
      <div
        className={`fixed w-8 h-8 rounded-full border-2 border-green-500 pointer-events-none z-50 transition-transform duration-200 ease-out ${
          isPointer ? "scale-150" : "scale-100"
        } ${isHidden ? "opacity-0" : "opacity-100"}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) ${isPointer ? "scale(1.5)" : "scale(1)"}`,
        }}
      />
      <div
        className={`fixed w-2 h-2 bg-green-500 rounded-full pointer-events-none z-50 transition-opacity duration-200 ${
          isHidden ? "opacity-0" : "opacity-100"
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  )
}
