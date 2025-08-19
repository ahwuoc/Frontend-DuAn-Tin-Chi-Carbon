import { useLanguage } from "@/context/language-context"

/**
 * Custom hook to handle local language file usage
 * This hook provides a consistent way to use local language files across components
 * 
 * @param languageFile - The language file object with vi/en properties
 * @returns Object with language and lang properties
 */
export function useLocalLanguage<T extends { vi: Record<string, string>; en: Record<string, string> }>(
  languageFile: T
) {
  const { language } = useLanguage()
  
  const lang = languageFile[language as keyof typeof languageFile]
  
  return {
    language,
    lang,
  }
}

/**
 * Custom hook to get text from language file with type safety
 * This hook provides a helper function to safely get text from language files
 * 
 * @param languageFile - The language file object
 * @returns Function to get text by key
 */
export function useLanguageText<T extends Record<string, { vi: string; en: string }>>(
  languageFile: T
) {
  const { language } = useLanguage()
  
  const getText = (key: keyof T): string => {
    const translation = languageFile[key]
    if (
      typeof translation === "object" &&
      translation !== null &&
      "vi" in translation &&
      "en" in translation
    ) {
      return (translation as { vi: string; en: string })[language]
    }
    console.warn(
      `Translation key "${String(key)}" not found or not a simple {vi, en} object.`
    )
    return String(key)
  }
  
  return {
    language,
    getText,
  }
}
