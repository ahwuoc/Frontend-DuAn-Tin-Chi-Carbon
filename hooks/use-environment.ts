import { useState } from "react"

interface EnvironmentState {
  isNight: boolean
}

interface EnvironmentActions {
  toggleNight: () => void
}

export function useEnvironment() {
  const [environmentState, setEnvironmentState] = useState<EnvironmentState>({
    isNight: false,
  })

  const environmentActions: EnvironmentActions = {
    toggleNight: () => setEnvironmentState(prev => ({ ...prev, isNight: !prev.isNight })),
  }

  return { environmentState, environmentActions }
}
