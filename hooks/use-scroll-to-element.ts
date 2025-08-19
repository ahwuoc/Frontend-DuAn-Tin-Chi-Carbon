import { useRef, useCallback } from "react"

/**
 * Custom hook to handle scrolling to a specific element
 * This hook provides a ref and scroll function for smooth scrolling
 * 
 * @returns Object with ref and scrollToElement function
 */
export function useScrollToElement() {
  const elementRef = useRef<HTMLDivElement>(null)
  
  const scrollToElement = useCallback((behavior: ScrollBehavior = "smooth") => {
    elementRef.current?.scrollIntoView({ behavior })
  }, [])
  
  return {
    elementRef,
    scrollToElement,
  }
}

/**
 * Custom hook to handle scroll to element with options
 * This hook provides more control over scroll behavior
 * 
 * @param options - Scroll options
 * @returns Object with ref and scrollToElement function
 */
export function useScrollToElementWithOptions(options: {
  behavior?: ScrollBehavior
  block?: ScrollLogicalPosition
  inline?: ScrollLogicalPosition
} = {}) {
  const elementRef = useRef<HTMLDivElement>(null)
  
  const scrollToElement = useCallback(() => {
    elementRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
      ...options,
    })
  }, [options])
  
  return {
    elementRef,
    scrollToElement,
  }
}
