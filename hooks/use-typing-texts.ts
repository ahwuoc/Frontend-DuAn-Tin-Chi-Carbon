import { useLanguage } from "@/context/language-context"

/**
 * Custom hook to get typing effect texts based on current language
 * This hook provides typing texts for different languages
 * 
 * @param texts - Object containing vi and en arrays of texts
 * @returns Array of texts for current language
 */
export function useTypingTexts(texts: {
  vi: string[]
  en: string[]
}) {
  const { language } = useLanguage()
  
  return texts[language as keyof typeof texts]
}

/**
 * Custom hook for home page typing texts specifically
 * This hook provides the specific typing texts used in the home page
 * 
 * @returns Array of typing texts for current language
 */
export function useHomeTypingTexts() {
  const { language } = useLanguage()
  
  const typingTexts = {
    vi: [
      "CARBON TOÀN THƯ 4.0",
      "DỰ ÁN TÍN CHỈ CARBON",
      "KHÓA HỌC CHỨNG CHỈ QUỐC TẾ",
    ],
    en: [
      "CARBON ENCYCLOPEDIA 4.0",
      "CARBON CREDIT PROJECTS",
      "INTERNATIONAL CERTIFICATE COURSES",
    ],
  }
  
  return typingTexts[language as keyof typeof typingTexts]
}
