import { useUIState } from "./use-ui-state"
import { useEnvironment } from "./use-environment"
import { useSelection } from "./use-selection"
import { usePerformanceSettings } from "./use-performance-settings"
import { useCameraSettings } from "./use-camera-settings"

interface Donor {
  name: string
  treeCount: number
}

export function useTropicalForest(donors: Donor[] = [], language: string = "vi") {
  const { uiState, uiActions } = useUIState()
  const { environmentState, environmentActions } = useEnvironment()
  const { selectionState, selectionActions } = useSelection()
  const { performanceSettings } = usePerformanceSettings()
  const { cameraSettings } = useCameraSettings()

  // Combine all states
  const state = {
    ...uiState,
    ...environmentState,
    ...selectionState,
  }

  // Combine all actions
  const actions = {
    ...uiActions,
    ...environmentActions,
    ...selectionActions,
  }

  return {
    state,
    actions,
    performanceSettings,
    cameraSettings,
  }
}
