import { useMemo } from "react"

interface CameraSettings {
  position: [number, number, number]
  fov: number
  dpr: number
  performance: string
}

export function useCameraSettings() {
  const cameraSettings: CameraSettings = useMemo(() => ({
    position: [0, 5, 10],
    fov: 55,
    dpr: 1,
    performance: "medium",
  }), [])

  return { cameraSettings }
}
