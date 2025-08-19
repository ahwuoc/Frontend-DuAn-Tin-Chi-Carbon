import { useState } from "react"

interface UIState {
  showUI: boolean
  showInfo: boolean
  minimizePanel: boolean
}

interface UIActions {
  toggleUI: () => void
  toggleInfo: () => void
  toggleMinimizePanel: () => void
}

export function useUIState() {
  const [uiState, setUIState] = useState<UIState>({
    showUI: true,
    showInfo: false,
    minimizePanel: false,
  })

  const uiActions: UIActions = {
    toggleUI: () => setUIState(prev => ({ ...prev, showUI: !prev.showUI })),
    toggleInfo: () => setUIState(prev => ({ ...prev, showInfo: !prev.showInfo })),
    toggleMinimizePanel: () => setUIState(prev => ({ ...prev, minimizePanel: !prev.minimizePanel })),
  }

  return { uiState, uiActions }
}
