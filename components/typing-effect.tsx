"use client"

import { useState, useEffect } from "react"

interface TypingEffectProps {
  texts: string[]
  typingSpeed?: number
  deletingSpeed?: number
  delayBetweenTexts?: number
  className?: string
}

export default function TypingEffect({
  texts,
  typingSpeed = 50,
  deletingSpeed = 25,
  delayBetweenTexts = 1000,
  className = "",
}: TypingEffectProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (texts.length === 0) return

    let timeout: NodeJS.Timeout

    if (isTyping) {
      if (displayedText.length < texts[currentTextIndex].length) {
        timeout = setTimeout(() => {
          setDisplayedText(texts[currentTextIndex].substring(0, displayedText.length + 1))
        }, typingSpeed)
      } else {
        setIsPaused(true)
        timeout = setTimeout(() => {
          setIsPaused(false)
          setIsTyping(false)
        }, delayBetweenTexts)
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.substring(0, displayedText.length - 1))
        }, deletingSpeed)
      } else {
        setIsTyping(true)
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [texts, currentTextIndex, displayedText, isTyping, isPaused, typingSpeed, deletingSpeed, delayBetweenTexts])

  return (
    <span className={`${className} font-medium`}>
      {displayedText}
      <span
        className={`inline-block w-0.5 h-5 ml-0.5 bg-current align-middle ${isPaused ? "opacity-0" : "animate-blink"}`}
      ></span>
    </span>
  )
}
