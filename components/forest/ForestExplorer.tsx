"use client"

import { useState, useEffect } from "react"
import { TropicalForest } from "@/components/forest/TropicalForest"
import { getContributors } from "@/services/forest-service"
import { LoadingScreen } from "@/components/ui/LoadingScreen"

export default function ForestExplorer() {
  const [contributors, setContributors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getContributors()
        setContributors(data)
      } catch (error) {
        console.error("Failed to load contributors:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return <TropicalForest contributors={contributors} />
}