import { useState } from "react"


interface SelectionState{
    selectedElement:any
}

interface SelectionActions {
   setSelectedElement:(element:any) => void
}

export function useSelection() {
  const [selectionState, setSelectionState] = useState<SelectionState>({
    selectedElement: null,
  })

  const selectionActions: SelectionActions = {
    setSelectedElement: (element) => setSelectionState(prev => ({ ...prev, selectedElement: element })),
  }

  return { selectionState, selectionActions }
}
