import { useMemo } from "react"

interface PerformanceSettings {
  treeCount: number
  flowerDensity: number
  shadowMapSize: number
}

export function usePerformanceSettings() {
  const performanceSettings: PerformanceSettings = useMemo(() => ({
    treeCount: 15,
    flowerDensity: 50,
    shadowMapSize: 1024,
  }), [])

  return { performanceSettings }
}
