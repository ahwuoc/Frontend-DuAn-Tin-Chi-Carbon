"use client"

import { useRef, useState, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Sky, Environment, Sparkles } from "@react-three/drei"
import { Color } from "three"
import { Stars } from "@/components/effects/Stars"
import { Ground } from "@/components/forest/Ground"
import { GroundFlowers } from "@/components/forest/GroundFlowers"
import { ForestElements } from "@/components/forest/ForestElements"
import { CameraController } from "@/components/forest/CameraController"
import { CloudGroup } from "@/components/forest/CloudGroup"
import { TopNavigation } from "@/components/ui/TopNavigation"
import { ControlPanel } from "@/components/ui/ControlPanel"
import { InfoPanel } from "@/components/ui/InfoPanel"
import { Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Contributor, ForestElement } from "@/lib/types"
import { ElementTooltip } from "@/components/ui/ElementTooltip"
interface TropicalForestProps {
  contributors: Contributor[]
}

export function TropicalForest({ contributors }: TropicalForestProps) {
  const [showUI, setShowUI] = useState(true)
  const [isNight, setIsNight] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [minimizePanel, setMinimizePanel] = useState(false)
  const [selectedElement, setSelectedElement] = useState<ForestElement | null>(null)
  const [showNames, setShowNames] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredContributors, setFilteredContributors] = useState(contributors)
  const cameraControllerRef = useRef(null)
  const [language, setLanguage] = useState("en") // Default language


  const treeCount = 15
  const flowerDensity = 50
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query) {
      const filtered = contributors.filter((contributor) =>
        contributor.name.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredContributors(filtered)
    } else {
      setFilteredContributors(contributors)
    }
  }
  return (
    <div className="w-full h-full bg-gradient-to-b from-emerald-400 to-teal-600 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/vibrant-jungle-dream.png')] opacity-10 mix-blend-overlay"></div>

      <Canvas
        shadows
        camera={{ position: [20, 15, 20], fov: 55 }}
        dpr={[1, 2]} // Limit pixel ratio for better performance
        performance={{ min: 0.5 }} // Allow ThreeJS to reduce quality for performance
        className="transition-all duration-1000"
        style={{ background: isNight ? "linear-gradient(to bottom, #0f172a, #1e293b)" : "none" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={isNight ? 0.1 : 0.3} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={isNight ? 0.2 : 1.5}
            castShadow
            shadow-mapSize-width={512} // Reduce shadow map size from 1024 to 512
            shadow-mapSize-height={512}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />

          {/* Sky and environment */}
          <Sky
            distance={450000}
            sunPosition={isNight ? [0, -10, 0] : [10, 5, 10]}
            inclination={isNight ? 0 : 0.5}
            azimuth={isNight ? 0.25 : 0.25}
            rayleigh={isNight ? 2 : 0.5}
            turbidity={isNight ? 20 : 10}
            mieCoefficient={isNight ? 0.1 : 0.005}
            mieDirectionalG={isNight ? 0.8 : 0.8}
          />
          <Environment preset={isNight ? "night" : "forest"} background={false} />

          {/* Stars (only visible at night) */}
          {isNight && <Stars radius={100} depth={50} count={2500} factor={4} saturation={0} fade speed={1} />}

          {/* Solid green ground */}
          <Ground />

          {/* Flowers - replacing grass */}
          <GroundFlowers count={flowerDensity} />

          {/* Forest elements */}
          <ForestElements
            treeCount={treeCount}
            onSelect={setSelectedElement}
            contributors={filteredContributors}
            showNames={showNames}
            highlightedContributor={searchQuery}
          />

          {/* Atmospheric effects - don't use frustum culling for sparkles */}
          <Sparkles
            count={50}
            scale={50}
            size={isNight ? 4 : 2}
            speed={0.2}
            color={new Color(isNight ? 0.5 : 1, isNight ? 0.5 : 1, isNight ? 0.8 : 0.8)}
          />

          {/* More white clouds */}
          <CloudGroup isNight={isNight} />

          {/* Camera controls with keyboard movement */}
          <CameraController ref={cameraControllerRef} />

          {/* Element information tooltip */}
          {selectedElement && <ElementTooltip element={selectedElement} onClose={() => setSelectedElement(null)} />}
        </Suspense>
      </Canvas>

      {/* UI Controls Overlay - Enhanced design */}
      {showUI && (
        <>
          {/* Top Navigation Bar */}
          <TopNavigation
            isNight={isNight}
            setIsNight={setIsNight}
            showInfo={showInfo}
            setShowInfo={setShowInfo}
            showNames={showNames}
            setShowNames={setShowNames}
            onSearch={handleSearch}
            searchQuery={searchQuery}
          />

          {/* Enhanced Control Panel */}
          <ControlPanel minimizePanel={minimizePanel} setMinimizePanel={setMinimizePanel} setShowUI={setShowUI} />
        </>
      )}


      {showInfo && <InfoPanel treeCount={treeCount} onClose={() => setShowInfo(false)} contributors={contributors} totalStats={contributors} />}

      {!showUI && (
        <Button
          className="absolute bottom-4 right-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg z-10 rounded-full px-4"
          onClick={() => setShowUI(true)}
        >
          <Maximize size={16} className="mr-2" />
          Show Controls
        </Button>
      )}

      {/* Keyboard controls hint - Enhanced */}
      {!showUI && (
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-lg text-xs border border-emerald-100 shadow-md z-10">
          <p className="text-emerald-800 font-medium">
            {language === "vi" ? "Sử dụng WASD hoặc phím mũi tên để di chuyển" : "Use WASD or Arrow Keys to move"}
          </p>
        </div>
      )}
    </div>
  )
}