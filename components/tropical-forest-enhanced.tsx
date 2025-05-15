"use client"

import { Suspense, useRef, useMemo, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, Sky, Cloud, Sparkles, Html } from "@react-three/drei"
import { Color, MathUtils, Vector3 } from "three"
import * as THREE from "three" // Import THREE
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Sun,
  Moon,
  X,
  ChevronUp,
  ChevronDown,
  Maximize,
  Minimize,
  Leaf,
  Droplets,
  Mountain,
  Compass,
  Trees,
  Settings,
} from "lucide-react"

// Define types for donors
interface Donor {
  name: string
  treeCount: number
}

interface TropicalForestProps {
  donors?: Donor[]
  language?: string
}

function Stars({ radius = 100, depth = 50, count = 2500, factor = 4, saturation = 0, fade = true, speed = 1 }) {
  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = []
    const colors = []

    for (let i = 0; i < count; i++) {
      const vertex = new THREE.Vector3()
      vertex.x = MathUtils.randFloatSpread(radius)
      vertex.y = MathUtils.randFloatSpread(depth)
      vertex.z = MathUtils.randFloatSpread(radius)
      positions.push(vertex.x, vertex.y, vertex.z)

      const color = new THREE.Color()
      color.setHSL(Math.random(), saturation, Math.random() * 0.9 + 0.1)
      colors.push(color.r, color.g, color.b)
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))
    return geometry
  }, [radius, depth, count, saturation])

  const material = useRef()
  useFrame((state, delta) => {
    if (material.current) {
      material.current.uniforms.time.value += delta * speed
    }
  })

  return (
    <points>
      <bufferGeometry attach="geometry" {...geometry} />
      <shaderMaterial
        ref={material}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        vertexColors
        vertexShader={`
          uniform float time;
          varying float vOpacity;
          void main() {
            vec3 vPos = position;
            vPos.x += sin(position.y + time / 2.0) / 10.0;
            vPos.z += cos(position.x + time / 2.0) / 10.0;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);
            vOpacity = ${fade ? "clamp(position.y / float(${depth}), 0.0, 1.0)" : "1.0"};
            gl_PointSize = 2.0;
          }
        `}
        fragmentShader={`
          uniform float time;
          varying float vOpacity;
          void main() {
            gl_FragColor = vec4(color, vOpacity);
          }
        `}
        uniforms={{ time: { value: 0 } }}
      />
    </points>
  )
}

function ForestElements({ treeCount, onSelect, onHover, donors, language, highlightDonor }) {
  const elements = useMemo(() => {
    const newElements = []
    const treeTypes = ["Tropical Conifer", "Palm Tree", "Banana Tree", "Kapok Tree", "Bamboo Cluster", "Ficus Tree"]
    const descriptions = {
      "Tropical Conifer": language === "vi" ? "Cây lá kim nhiệt đới cao chót vót." : "Towering tropical conifer.",
      "Palm Tree": language === "vi" ? "Cây cọ duyên dáng với tán lá rộng." : "Graceful palm tree with broad leaves.",
      "Banana Tree": language === "vi" ? "Cây chuối với quả ngọt." : "Banana tree with sweet fruits.",
      "Kapok Tree": language === "vi" ? "Cây gạo hùng vĩ với thân cây lớn." : "Majestic kapok tree with a large trunk.",
      "Bamboo Cluster": language === "vi" ? "Cụm tre xanh tươi." : "Lush green bamboo cluster.",
      "Ficus Tree": language === "vi" ? "Cây đa cổ thụ với rễ trên không." : "Ancient ficus tree with aerial roots.",
      "Natural Lake": language === "vi" ? "Hồ nước tự nhiên trong xanh." : "Clear natural water feature.",
      "Forest Path": language === "vi" ? "Con đường mòn xuyên rừng." : "Winding forest path.",
    }

    for (let i = 0; i < treeCount; i++) {
      const type = treeTypes[Math.floor(Math.random() * treeTypes.length)]
      const x = MathUtils.randFloatSpread(70)
      const z = MathUtils.randFloatSpread(70)
      const y = -0.3

      // Assign a donor to some trees
      const donor =
        donors && donors.length > 0 && Math.random() < 0.3 ? donors[Math.floor(Math.random() * donors.length)] : null

      newElements.push({
        position: [x, y, z],
        type,
        description: descriptions[type],
        donor,
      })
    }

    // Add a natural lake
    newElements.push({
      position: [0, -0.4, 0],
      type: "Natural Lake",
      description: descriptions["Natural Lake"],
    })

    // Add a forest path
    newElements.push({
      position: [10, -0.4, 10],
      type: "Forest Path",
      description: descriptions["Forest Path"],
    })

    return newElements
  }, [treeCount, donors, language])

  return (
    <>
      {elements.map((element, index) => (
        <ClickableElement
          key={index}
          position={element.position}
          type={element.type}
          description={element.description}
          onSelect={onSelect}
          onHover={onHover}
          donor={element.donor}
          highlight={highlightDonor && element.donor === highlightDonor}
        />
      ))}
    </>
  )
}

function ClickableElement({ position, type, description, onSelect, onHover, donor, highlight }) {
  const mesh = useRef()
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)

  const handleClick = (e) => {
    e.stopPropagation()
    setActive(!active)
    onSelect({ position, type, description, donor })
  }

  const handlePointerOver = (e) => {
    e.stopPropagation()
    setHovered(true)
    onHover({ position, donor })
  }

  const handlePointerOut = (e) => {
    e.stopPropagation()
    setHovered(false)
    onHover(null)
  }

  const color = highlight ? "yellow" : hovered ? "orange" : "white"

  let geometry
  let material

  switch (type) {
    case "Tropical Conifer":
      geometry = <coneGeometry args={[0.5, 2, 32]} />
      material = <meshStandardMaterial color={color} />
      break
    case "Palm Tree":
      geometry = <cylinderGeometry args={[0.3, 0.3, 3, 32]} />
      material = <meshStandardMaterial color={color} />
      break
    case "Banana Tree":
      geometry = <sphereGeometry args={[0.4, 32, 32]} />
      material = <meshStandardMaterial color={color} />
      break
    case "Kapok Tree":
      geometry = <boxGeometry args={[0.6, 2.5, 0.6]} />
      material = <meshStandardMaterial color={color} />
      break
    case "Bamboo Cluster":
      geometry = <cylinderGeometry args={[0.2, 0.2, 2, 32]} />
      material = <meshStandardMaterial color={color} />
      break
    case "Ficus Tree":
      geometry = <sphereGeometry args={[0.5, 32, 32]} />
      material = <meshStandardMaterial color={color} />
      break
    case "Natural Lake":
      geometry = <circleGeometry args={[3, 32]} />
      material = <meshStandardMaterial color="blue" transparent opacity={0.7} />
      break
    case "Forest Path":
      geometry = <planeGeometry args={[5, 5]} />
      material = <meshStandardMaterial color="brown" side={THREE.DoubleSide} />
      break
    default:
      geometry = <boxGeometry args={[1, 1, 1]} />
      material = <meshStandardMaterial color={color} />
  }

  return (
    <mesh
      ref={mesh}
      position={position}
      scale={active ? 1.2 : 1}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      castShadow
      receiveShadow
    >
      {geometry}
      {material}
    </mesh>
  )
}

// Enhanced TropicalForest component
export default function TropicalForestEnhanced({ donors = [], language = "vi" }: TropicalForestProps) {
  const [showUI, setShowUI] = useState(true)
  const [isNight, setIsNight] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [minimizePanel, setMinimizePanel] = useState(false)
  const [selectedElement, setSelectedElement] = useState(null)
  const [hoveredElement, setHoveredElement] = useState(null)
  const [searchMode, setSearchMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [foundDonor, setFoundDonor] = useState(null)
  const [qualityMode, setQualityMode] = useState<"low" | "medium" | "high">("low") // Default to low for better performance

  // Adjust settings based on quality mode
  const treeCount = qualityMode === "low" ? 8 : qualityMode === "medium" ? 12 : 15
  const flowerDensity = qualityMode === "low" ? 20 : qualityMode === "medium" ? 35 : 50
  const shadowMapSize = qualityMode === "low" ? 256 : qualityMode === "medium" ? 512 : 1024
  const pixelRatio = qualityMode === "low" ? [0.5, 1] : qualityMode === "medium" ? [0.75, 1.5] : [1, 2]
  const enableShadows = qualityMode !== "low"
  const enableClouds = qualityMode !== "low"
  const enableSparkles = qualityMode === "high"

  // Handle search functionality
  const handleSearch = () => {
    if (!searchQuery) return

    const found = donors.find((donor) => donor.name.toLowerCase().includes(searchQuery.toLowerCase()))

    if (found) {
      setFoundDonor(found)
      // In a real implementation, you would focus the camera on the donor's tree
      alert(language === "vi" ? `Đã tìm thấy cây của ${found.name}!` : `Found ${found.name}'s tree!`)
    } else {
      alert(language === "vi" ? "Không tìm thấy người đóng góp với tên này" : "No contributor found with this name")
    }
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-emerald-400 to-teal-600 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-10 mix-blend-overlay"></div>

      <Canvas
        shadows={enableShadows}
        camera={{ position: [20, 15, 20], fov: 55 }}
        dpr={pixelRatio}
        performance={{ min: qualityMode === "low" ? 0.3 : 0.5 }}
        frameloop={qualityMode === "low" ? "demand" : "always"}
        gl={{
          powerPreference: "high-performance",
          antialias: qualityMode !== "low",
          depth: true,
          stencil: false,
          alpha: false,
        }}
        className="transition-all duration-1000"
        style={{ background: isNight ? "linear-gradient(to bottom, #0f172a, #1e293b)" : "none" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={isNight ? 0.1 : 0.3} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={isNight ? 0.2 : 1.5}
            castShadow
            shadow-mapSize-width={shadowMapSize} // Reduce shadow map size from 1024 to 512
            shadow-mapSize-height={shadowMapSize}
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
            onHover={setHoveredElement}
            donors={donors}
            language={language}
            highlightDonor={foundDonor}
          />

          {/* Atmospheric effects - only show on medium and high quality */}
          {enableSparkles && (
            <Sparkles
              count={30}
              scale={50}
              size={isNight ? 4 : 2}
              speed={0.2}
              color={new Color(isNight ? 0.5 : 1, isNight ? 0.5 : 1, isNight ? 0.8 : 0.8)}
            />
          )}

          {/* More white clouds - only on medium and high quality */}
          {enableClouds && <CloudGroup isNight={isNight} qualityMode={qualityMode} />}

          {/* Camera controls with keyboard movement */}
          <CameraController />

          {/* Element information tooltip */}
          {selectedElement && (
            <Html position={selectedElement.position}>
              <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-xl text-sm w-56 transform -translate-x-1/2 -translate-y-full mb-2 border border-emerald-100 select-none pointer-events-auto">
                <h3 className="font-bold text-emerald-800 flex items-center gap-2">
                  {selectedElement.type === "Tropical Conifer" && <Trees size={16} className="text-emerald-600" />}
                  {selectedElement.type === "Palm Tree" && <Trees size={16} className="text-emerald-600" />}
                  {selectedElement.type === "Banana Tree" && <Leaf size={16} className="text-emerald-600" />}
                  {selectedElement.type === "Kapok Tree" && <Trees size={16} className="text-emerald-600" />}
                  {selectedElement.type === "Bamboo Cluster" && <Trees size={16} className="text-emerald-600" />}
                  {selectedElement.type === "Ficus Tree" && <Trees size={16} className="text-emerald-600" />}
                  {selectedElement.type === "Natural Lake" && <Droplets size={16} className="text-blue-600" />}
                  {selectedElement.type === "Forest Path" && <Compass size={16} className="text-amber-600" />}
                  {selectedElement.type}
                </h3>
                <p className="text-gray-700 mt-1">{selectedElement.description}</p>
                {selectedElement.donor && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="font-semibold text-emerald-700">
                      {language === "vi" ? "Người đóng góp" : "Contributor"}:
                    </p>
                    <p className="text-gray-700">
                      {selectedElement.donor.name} - {selectedElement.donor.treeCount}{" "}
                      {language === "vi" ? "cây" : "trees"}
                    </p>
                  </div>
                )}
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 transition-colors"
                  onClick={() => setSelectedElement(null)}
                >
                  <X size={14} />
                </button>
              </div>
            </Html>
          )}

          {/* Hover information tooltip */}
          {hoveredElement && !selectedElement && (
            <Html position={hoveredElement.position}>
              <div className="bg-white/80 backdrop-blur-md px-2 py-1 rounded-lg shadow-lg text-sm transform -translate-x-1/2 -translate-y-full mb-2 border border-emerald-100 select-none pointer-events-none">
                {hoveredElement.donor && (
                  <p className="font-medium text-emerald-700">
                    {hoveredElement.donor.name} - {hoveredElement.donor.treeCount} {language === "vi" ? "cây" : "trees"}
                  </p>
                )}
              </div>
            </Html>
          )}
        </Suspense>
      </Canvas>

      {showUI && (
        <>
          {/* Top Navigation Bar - Optimized */}
          <div className="absolute top-0 left-0 right-0 bg-white/80 backdrop-blur-md p-3 flex justify-between items-center shadow-md z-10 border-b border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 text-white p-2 rounded-lg">
                <Trees size={20} />
              </div>
              <div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-800 font-semibold border-emerald-200">
                  {language === "vi" ? "Khám phá rừng nhiệt đới" : "Tropical Forest Explorer"}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200"
                onClick={() => {
                  // Cycle through quality modes: low -> medium -> high -> low
                  setQualityMode((prev) => {
                    if (prev === "low") return "medium"
                    if (prev === "medium") return "high"
                    return "low"
                  })
                }}
              >
                <Settings size={14} />
                {qualityMode === "low"
                  ? language === "vi"
                    ? "Chất lượng: Thấp"
                    : "Quality: Low"
                  : qualityMode === "medium"
                    ? language === "vi"
                      ? "Chất lượng: TB"
                      : "Quality: Medium"
                    : language === "vi"
                      ? "Chất lượng: Cao"
                      : "Quality: High"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-1.5 transition-all duration-300 ${
                  isNight
                    ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200"
                    : "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200"
                }`}
                onClick={() => setIsNight(!isNight)}
              >
                {isNight ? <Moon size={14} /> : <Sun size={14} />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200"
                onClick={() => setShowUI(false)}
              >
                <Minimize size={14} />
              </Button>
            </div>
          </div>

          {/* Enhanced Control Panel */}
          <div
            className={`absolute ${
              minimizePanel ? "bottom-0 left-0 right-0" : "bottom-4 left-4 w-80"
            } bg-white/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden transition-all duration-300 border border-emerald-100 z-10`}
          >
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
              <h3 className="font-semibold flex items-center gap-2">
                <Mountain size={16} />
                {language === "vi" ? "Cài đặt rừng" : "Forest Settings"}
              </h3>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:text-white hover:bg-emerald-700/50 rounded-full"
                  onClick={() => setMinimizePanel(!minimizePanel)}
                >
                  {minimizePanel ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:text-white hover:bg-emerald-700/50 rounded-full"
                  onClick={() => setShowUI(false)}
                >
                  <Minimize size={14} />
                </Button>
              </div>
            </div>

            {!minimizePanel && (
              <div className="p-4">
                <Tabs defaultValue="environment" className="w-full">
                  <TabsList className="w-full grid grid-cols-2 mb-2 bg-emerald-50">
                    <TabsTrigger
                      value="environment"
                      className="data-[state=active]:bg-white data-[state=active]:text-emerald-700"
                    >
                      {language === "vi" ? "Môi trường" : "Environment"}
                    </TabsTrigger>
                    <TabsTrigger
                      value="controls"
                      className="data-[state=active]:bg-white data-[state=active]:text-emerald-700"
                    >
                      {language === "vi" ? "Điều khiển" : "Controls"}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="environment" className="pt-2">
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium flex items-center gap-1.5 text-emerald-800">
                            {isNight ? (
                              <Moon size={14} className="text-indigo-600" />
                            ) : (
                              <Sun size={14} className="text-amber-500" />
                            )}
                            {language === "vi" ? "Thời gian" : "Time of Day"}
                          </label>
                          <Switch
                            checked={isNight}
                            onCheckedChange={setIsNight}
                            className="data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-amber-500"
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          {language === "vi" ? "Chuyển đổi giữa ngày và đêm" : "Toggle between day and night"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium flex items-center gap-1.5 text-emerald-800">
                            <Trees size={14} className="text-emerald-600" />
                            {language === "vi" ? "Số lượng cây" : "Tree Count"}
                          </label>
                          <span className="text-xs bg-emerald-100 px-2 py-1 rounded-full text-emerald-800 font-medium">
                            {treeCount}
                          </span>
                        </div>
                        <div className="px-1">
                          <Slider
                            defaultValue={[treeCount]}
                            max={20}
                            min={5}
                            step={1}
                            disabled
                            className="cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium flex items-center gap-1.5 text-emerald-800">
                            <Leaf size={14} className="text-emerald-600" />
                            {language === "vi" ? "Số lượng hoa" : "Flower Count"}
                          </label>
                          <span className="text-xs bg-emerald-100 px-2 py-1 rounded-full text-emerald-800 font-medium">
                            {flowerDensity}
                          </span>
                        </div>
                        <div className="px-1">
                          <Slider
                            defaultValue={[flowerDensity]}
                            max={100}
                            min={10}
                            step={5}
                            disabled
                            className="cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="controls" className="pt-2">
                    <div className="space-y-3 text-sm">
                      <p className="font-medium text-emerald-800">
                        {language === "vi" ? "Điều khiển bàn phím:" : "Keyboard Controls:"}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-emerald-50 p-2 rounded-lg">
                          <p className="font-semibold text-emerald-800 mb-1">
                            {language === "vi" ? "Di chuyển:" : "Movement:"}
                          </p>
                          <ul className="space-y-1 text-gray-700">
                            <li className="flex items-center gap-1">
                              <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                                W
                              </span>{" "}
                              /
                              <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                                ↑
                              </span>
                              - {language === "vi" ? "Di chuyển tiến" : "Move forward"}
                            </li>
                            <li className="flex items-center gap-1">
                              <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                                S
                              </span>{" "}
                              /
                              <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                                ↓
                              </span>
                              - {language === "vi" ? "Di chuyển lùi" : "Move backward"}
                            </li>
                            <li className="flex items-center gap-1">
                              <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                                A
                              </span>{" "}
                              /
                              <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                                ←
                              </span>
                              - {language === "vi" ? "Di chuyển trái" : "Move left"}
                            </li>
                            <li className="flex items-center gap-1">
                              <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                                D
                              </span>{" "}
                              /
                              <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                                →
                              </span>
                              - {language === "vi" ? "Di chuyển phải" : "Move right"}
                            </li>
                          </ul>
                        </div>
                        <div className="bg-emerald-50 p-2 rounded-lg">
                          <p className="font-semibold text-emerald-800 mb-1">
                            {language === "vi" ? "Độ cao:" : "Height:"}
                          </p>
                          <ul className="space-y-1 text-gray-700">
                            <li className="flex items-center gap-1">
                              <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                                E
                              </span>
                              - {language === "vi" ? "Di chuyển lên" : "Move up"}
                            </li>
                            <li className="flex items-center gap-1">
                              <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                                Q
                              </span>
                              - {language === "vi" ? "Di chuyển xuống" : "Move down"}
                            </li>
                          </ul>
                          <p className="font-semibold text-emerald-800 mt-2 mb-1">
                            {language === "vi" ? "Tốc độ:" : "Speed:"}
                          </p>
                          <ul className="space-y-1 text-gray-700">
                            <li className="flex items-center gap-1">
                              <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                                Shift
                              </span>
                              - {language === "vi" ? "Chạy nhanh" : "Run fast"}
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="bg-emerald-50 p-2 rounded-lg mt-2">
                        <p className="font-semibold text-emerald-800 mb-1">
                          {language === "vi" ? "Điều khiển chuột:" : "Mouse Controls:"}
                        </p>
                        <ul className="space-y-1 text-gray-700">
                          <li>{language === "vi" ? "Kéo chuột - Nhìn xung quanh" : "Drag mouse - Look around"}</li>
                          <li>
                            {language === "vi"
                              ? "Giữ chuột phải - Phóng to (như ống nhòm)"
                              : "Hold right mouse - Zoom in (like binoculars)"}
                          </li>
                          <li>{language === "vi" ? "Cuộn chuột - Phóng to/thu nhỏ" : "Mouse wheel - Zoom in/out"}</li>
                        </ul>
                      </div>
                      <div className="mt-2 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                        <p className="text-xs text-emerald-800">
                          <span className="font-semibold">{language === "vi" ? "Mẹo:" : "Tip:"}</span>{" "}
                          {language === "vi"
                            ? "Di chuyển có gia tốc và giảm tốc tự nhiên. Giữ Shift để chạy nhanh với hiệu ứng lắc đầu nhẹ. Tiếp cận gần các đối tượng để xem chi tiết."
                            : "Movement has natural acceleration and deceleration. Hold Shift to run fast with a slight head bobbing effect. Approach objects closely to see details."}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </>
      )}

      {/* Enhanced Info Panel */}
      {showInfo && (
        <div className="absolute top-20 left-4 w-80 bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-xl z-10 border border-emerald-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg text-emerald-800 flex items-center gap-2">
              <Trees className="text-emerald-600" size={20} />
              {language === "vi" ? "Rừng Nhiệt Đới" : "Tropical Forest"}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-emerald-100"
              onClick={() => setShowInfo(false)}
            >
              <X size={14} />
            </Button>
          </div>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-lg border border-emerald-100">
              <p className="text-emerald-800">
                {language === "vi" ? "Rừng nhiệt đới này có:" : "This tropical forest features:"}
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-gray-700">
                <li className="flex items-start gap-1.5">
                  <Trees size={14} className="text-emerald-600 mt-1 flex-shrink-0" />
                  <span>
                    {treeCount}{" "}
                    {language === "vi" ? "cây với hệ thống rễ chi tiết" : "trees with detailed root systems"}
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Trees size={14} className="text-emerald-600 mt-1 flex-shrink-0" />
                  <span>
                    {language === "vi"
                      ? "Nhiều loài cây nhiệt đới (cọ, chuối, gạo, tre và đa)"
                      : "Multiple tropical tree species (palm, banana, kapok, bamboo, and ficus)"}
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Leaf size={14} className="text-emerald-600 mt-1 flex-shrink-0" />
                  <span>
                    {flowerDensity} {language === "vi" ? "bông hoa nhiệt đới đẹp" : "beautiful tropical flowers"}
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Droplets size={14} className="text-blue-600 mt-1 flex-shrink-0" />
                  <span>{language === "vi" ? "Một hồ nước tự nhiên" : "A natural water feature"}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Compass size={14} className="text-amber-600 mt-1 flex-shrink-0" />
                  <span>{language === "vi" ? "Những con đường mòn quanh co" : "Winding forest paths"}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Sun size={14} className="text-amber-500 mt-1 flex-shrink-0" />
                  <span>{language === "vi" ? "Chế độ ánh sáng ngày và đêm" : "Day and night lighting modes"}</span>
                </li>
              </ul>
            </div>
            <div className="bg-emerald-600 text-white p-3 rounded-lg text-sm">
              <p className="font-medium mb-1">
                {language === "vi" ? "Khám phá khu rừng nhiệt đới" : "Explore the tropical forest"}
              </p>
              <p className="text-emerald-50 text-xs">
                {language === "vi"
                  ? "Nhấp vào bất kỳ yếu tố nào trong rừng để tìm hiểu thêm về nó."
                  : "Click on any element in the forest to learn more about it."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Show UI button (when UI is hidden) - Enhanced */}
      {!showUI && (
        <Button
          className="absolute bottom-4 right-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg z-10 rounded-full px-4"
          onClick={() => setShowUI(true)}
        >
          <Maximize size={16} className="mr-2" />
          {language === "vi" ? "Hiện điều khiển" : "Show Controls"}
        </Button>
      )}

      {/* Keyboard controls hint - Enhanced */}
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-lg text-xs border border-emerald-100 shadow-md z-10">
        <p className="text-emerald-800 font-medium">
          {language === "vi" ? "Sử dụng WASD hoặc phím mũi tên để di chuyển" : "Use WASD or Arrow Keys to move"}
        </p>
      </div>

      {/* Quality indicator */}
      <div className="absolute top-16 left-4 bg-white/80 backdrop-blur-md px-2 py-1 rounded-lg text-xs border border-emerald-100 shadow-md z-10">
        <p className="text-emerald-800 font-medium flex items-center gap-1.5">
          <Settings size={12} />
          {language === "vi" ? "Chất lượng: " : "Quality: "}
          <span
            className={
              qualityMode === "low" ? "text-amber-600" : qualityMode === "medium" ? "text-emerald-600" : "text-blue-600"
            }
          >
            {qualityMode === "low"
              ? language === "vi"
                ? "Thấp"
                : "Low"
              : qualityMode === "medium"
                ? language === "vi"
                  ? "Trung bình"
                  : "Medium"
                : language === "vi"
                  ? "Cao"
                  : "High"}
          </span>
        </p>
      </div>
    </div>
  )
}

function CloudGroup({ isNight, qualityMode }) {
  // Generate cloud positions
  const cloudCount = qualityMode === "low" ? 2 : qualityMode === "medium" ? 3 : 5
  const cloudSegments = qualityMode === "low" ? 4 : qualityMode === "medium" ? 6 : 8

  const cloudPositions = useMemo(() => {
    const positions = []
    // Keep the reduced cloud count (5)
    for (let i = 0; i < cloudCount; i++) {
      const x = Math.random() * 200 - 100
      const y = 90 + Math.random() * 60
      const z = Math.random() * 200 - 100

      positions.push({
        position: [x, y, z],
        scale: 6 + Math.random() * 10,
        rotation: [0, Math.random() * Math.PI * 2, 0],
        seed: Math.floor(Math.random() * 100),
      })
    }
    return positions
  }, [cloudCount, qualityMode, isNight])

  return (
    <>
      {cloudPositions.map((cloud, index) => (
        <Cloud
          key={index}
          position={cloud.position}
          scale={cloud.scale}
          rotation={cloud.rotation}
          seed={cloud.seed}
          speed={0}
          opacity={isNight ? 0.4 : 0.8}
          color="white"
          segments={cloudSegments} // Reduce segments from 12 to 8
          depthTest={true}
          castShadow={false}
          receiveShadow={false}
          transparent={true}
          fog={false}
        />
      ))}
    </>
  )
}

// Cải tiến CameraController với tốc độ nhanh hơn và di chuyển sang trái/phải trực tiếp
function CameraController() {
  const { camera, gl } = useThree()
  const orbitControlsRef = useRef()
  const minHeight = 1.0 // Minimum height above ground

  // Movement state with improved smoothing
  const keys = useRef({})
  const velocity = useRef(new Vector3(0, 0, 0))
  const targetVelocity = useRef(new Vector3(0, 0, 0))
  const normalSpeed = 0.4 // Tăng tốc độ di chuyển bình thường (từ 0.15)
  const sprintSpeed = 0.8 // Tăng tốc độ chạy nhanh (từ 0.4)
  const moveSpeed = useRef(normalSpeed)
  const acceleration = 0.12 // Tăng gia tốc (từ 0.08)
  const deceleration = 0.2 // Tăng giảm tốc (từ 0.15)
  const dampingFactor = 0.92 // General movement damping
  const currentHeight = useRef(camera.position.y)
  const defaultFOV = useRef(55) // Default FOV
  const zoomFOV = useRef(30) // Zoomed FOV
  const isZooming = useRef(false)
  const isAltPressed = useRef(isAltPressed)
  const headBobActive = useRef(false)
  const headBobTimer = useRef(0)
  const headBobAmount = 0.05
  const headBobSpeed = 10
  const isSprinting = useRef(false)

  // Add throttling for smoother movement
  const lastUpdate = useRef(0)
  const updateInterval = 16 // ms (roughly 60fps)

  // Set up keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key.toLowerCase()] = true

      // Set higher speed when shift is pressed
      if (e.key === "Shift") {
        moveSpeed.current = sprintSpeed
        isSprinting.current = true
        headBobActive.current = true
      }
    }

    const handleKeyUp = (e) => {
      keys.current[e.key.toLowerCase()] = false

      // Reset speed when shift is released
      if (e.key === "Shift") {
        moveSpeed.current = normalSpeed
        isSprinting.current = false
        // Keep head bobbing for a moment after stopping sprint
        setTimeout(() => {
          headBobActive.current = false
        }, 300)
      }
    }

    // Handle mouse events for zooming
    const handleMouseDown = (e) => {
      if (e.button === 2) {
        // Right mouse button
        isZooming.current = true
        if (camera.fov !== zoomFOV.current) {
          defaultFOV.current = camera.fov // Store current FOV
        }
      }
    }

    const handleMouseUp = (e) => {
      if (e.button === 2) {
        // Right mouse button released
        isZooming.current = false
      }
    }

    // Prevent context menu on right click
    const handleContextMenu = (e) => {
      e.preventDefault()
    }

    // Handle Alt key for UI interaction
    const handleAltKey = (e) => {
      if (e.key === "Alt") {
        e.preventDefault()
        isAltPressed.current = e.type === "keydown"
      }
    }

    // Handle WASD keys for movement
    const handleWASDKeys = (e) => {
      // Prevent default behavior for WASD keys to avoid scrolling
      if (["w", "a", "s", "d", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key.toLowerCase())) {
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("contextmenu", handleContextMenu)
    window.addEventListener("keydown", handleAltKey)
    window.addEventListener("keyup", handleAltKey)
    window.addEventListener("keydown", handleWASDKeys)

    // Store initial height
    currentHeight.current = Math.max(camera.position.y, minHeight)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("contextmenu", handleContextMenu)
      window.removeEventListener("keydown", handleAltKey)
      window.removeEventListener("keyup", handleAltKey)
      window.removeEventListener("keydown", handleWASDKeys)
    }
  }, [camera])

  // Handle FOV changes for zoom effect
  useFrame((state, delta) => {
    // Apply zoom effect with smooth transition
    if (isZooming.current) {
      camera.fov = MathUtils.lerp(camera.fov, zoomFOV.current, delta * 5)
      camera.updateProjectionMatrix()
    } else if (camera.fov !== defaultFOV.current) {
      camera.fov = MathUtils.lerp(camera.fov, defaultFOV.current, delta * 5)
      camera.updateProjectionMatrix()
    }

    if (orbitControlsRef.current) {
      // Dynamically adjust the minimum polar angle based on camera height
      const heightFactor = Math.max(0, Math.min(1, (camera.position.y - minHeight) / 10))
      orbitControlsRef.current.minPolarAngle = Math.PI * 0.25 * (1 - heightFactor)

      // Disable controls when Alt is pressed (for UI interaction)
      orbitControlsRef.current.enabled = !isAltPressed.current
    }

    // Apply head bobbing effect when moving and sprinting
    if (
      headBobActive.current &&
      (keys.current["w"] ||
        keys.current["a"] ||
        keys.current["s"] ||
        keys.current["d"] ||
        keys.current["arrowup"] ||
        keys.current["arrowleft"] ||
        keys.current["arrowdown"] ||
        keys.current["arrowright"])
    ) {
      headBobTimer.current += delta * headBobSpeed * (isSprinting.current ? 1.5 : 1)
      const bobOffset = Math.sin(headBobTimer.current) * headBobAmount * (isSprinting.current ? 1.2 : 0.7)
      camera.position.y += bobOffset - (camera.userData.lastBobOffset || 0)
      camera.userData.lastBobOffset = bobOffset
    } else if (camera.userData.lastBobOffset) {
      // Smoothly reset head bob when stopping
      camera.position.y -= camera.userData.lastBobOffset
      camera.userData.lastBobOffset = 0
    }
  })

  // Handle camera movement with performance optimizations and smoothing
  useFrame((state, delta) => {
    // Throttle updates for better performance
    const now = state.clock.getElapsedTime() * 1000
    if (now - lastUpdate.current < updateInterval) return
    lastUpdate.current = now

    // Get current camera direction
    const direction = new Vector3()
    const frontVector = new Vector3()
    const sideVector = new Vector3()

    // Calculate movement directions
    const forward = keys.current["w"] || keys.current["arrowup"]
    const backward = keys.current["s"] || keys.current["arrowdown"]
    const left = keys.current["a"] || keys.current["arrowleft"]
    const right = keys.current["d"] || keys.current["arrowright"]
    const up = keys.current["e"]
    const down = keys.current["q"]

    // Store the current Y position before any movement
    const currentY = camera.position.y

    // Calculate target velocity based on input
    targetVelocity.current.set(0, 0, 0)

    // Get camera direction for forward/backward
    camera.getWorldDirection(direction)

    // For forward/backward movement - use camera direction
    if (forward || backward) {
      frontVector
        .set(direction.x, 0, direction.z)
        .normalize()
        .multiplyScalar((forward ? 1 : 0) - (backward ? 1 : 0))

      targetVelocity.current.add(frontVector)
    }

    // For left/right movement - use camera-relative coordinates
    if (left || right) {
      // Create a vector perpendicular to the camera direction for proper strafing
      sideVector
        .crossVectors(camera.up, direction)
        .normalize()
        .multiplyScalar((left ? 1 : 0) - (right ? 1 : 0))
      targetVelocity.current.add(sideVector)
    }

    // Normalize and scale by speed if there's movement
    if (targetVelocity.current.length() > 0) {
      targetVelocity.current.normalize().multiplyScalar(moveSpeed.current)
    }

    // Smoothly interpolate current velocity towards target velocity
    const accelerationFactor = targetVelocity.current.length() > 0 ? acceleration : deceleration
    velocity.current.lerp(targetVelocity.current, accelerationFactor)

    // Apply damping to gradually slow down
    velocity.current.multiplyScalar(dampingFactor)

    // Only move if velocity is significant
    if (velocity.current.length() > 0.001) {
      // Move horizontally
      camera.position.x += velocity.current.x
      camera.position.z += velocity.current.z

      // Restore the exact Y position
      camera.position.y = currentY
    }

    // Handle vertical movement separately with smooth acceleration
    if (up) {
      camera.position.y += moveSpeed.current * 0.8 // Slightly slower vertical movement
      currentHeight.current = camera.position.y
    } else if (down) {
      const newHeight = camera.position.y - moveSpeed.current * 0.8
      if (newHeight >= minHeight) {
        camera.position.y = newHeight
        currentHeight.current = newHeight
      } else {
        camera.position.y = minHeight
        currentHeight.current = minHeight
      }
    }

    // Ensure camera is above minimum height
    if (camera.position.y < minHeight) {
      camera.position.y = minHeight
      currentHeight.current = minHeight
    }

    // Disable automatic target following to allow free looking
    // Comment out or remove the following code that was causing the camera to auto-center
    /*
    if (orbitControlsRef.current) {
      const targetDistance = 10
      const targetDirection = new Vector3()
      camera.getWorldDirection(targetDirection)
      const targetPosition = new Vector3()
      targetPosition.copy(camera.position)
      targetPosition.add(targetDirection.multiplyScalar(targetDistance))
      orbitControlsRef.current.target.lerp(targetPosition, 0.1)
    }
    */
  })

  return (
    <OrbitControls
      ref={orbitControlsRef}
      args={[camera, gl.domElement]}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      keyPanSpeed={0}
      minPolarAngle={Math.PI * 0.1} // Giảm giới hạn góc để có thể nhìn lên cao hơn
      maxPolarAngle={Math.PI - 0.1}
      minDistance={0.1} // Allow very close zoom
      maxDistance={50}
      zoomSpeed={0.5}
      rotateSpeed={0.5}
      enableDamping={true}
      dampingFactor={0.1}
      autoRotate={false} // Đảm bảo không tự động xoay
      target={[0, 0, 0]} // Đặt target cố định
      keys={{
        LEFT: null,
        RIGHT: null,
        UP: null,
        BOTTOM: null,
      }}
    />
  )
}

// Optimize the Ground component
function Ground() {
  return (
    <group>
      {/* Base ground plane - reduce segments */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[150, 150, 25, 25]} /> {/* Reduce segments from 50x50 to 25x25 */}
        <meshStandardMaterial color="#2e7d32" roughness={0.8} metalness={0.1} wireframe={false} />
      </mesh>

      {/* Reduce terrain variations from 30 to 15 */}
      {[...Array(15)].map((_, i) => {
        const x = Math.random() * 140 - 70
        const z = Math.random() * 140 - 70
        const radius = 3 + Math.random() * 8
        const height = 0.2 + Math.random() * 0.8

        return (
          <mesh
            key={`elevation-${i}`}
            position={[x, -0.5 + height / 2, z]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <circleGeometry args={[radius, 8]} /> {/* Reduce segments from 16 to 8 */}
            <meshStandardMaterial color={Math.random() > 0.7 ? "#3a8c40" : "#2e7d32"} roughness={0.9} metalness={0.1} />
          </mesh>
        )
      })}

      {/* Reduce depressions from 15 to 8 */}
      {[...Array(8)].map((_, i) => {
        const x = Math.random() * 140 - 70
        const z = Math.random() * 140 - 70
        const radius = 2 + Math.random() * 5
        const depth = 0.1 + Math.random() * 0.3

        return (
          <mesh
            key={`depression-${i}`}
            position={[x, -0.5 - depth / 2, z]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <circleGeometry args={[radius, 8]} /> {/* Reduce segments from 16 to 8 */}
            <meshStandardMaterial color={"#1e5c22"} roughness={0.9} metalness={0.1} />
          </mesh>
        )
      })}
    </group>
  )
}

// Optimize the GroundFlowers component to reduce the number of objects
function GroundFlowers({ count = 50 }) {
  // Reduce flower count from 100 to 50
  const flowerPatches = useMemo(() => {
    const patches = []
    const patchCount = count

    for (let i = 0; i < patchCount; i++) {
      const x = MathUtils.randFloatSpread(80)
      const z = MathUtils.randFloatSpread(80)

      // Avoid placing flowers on the path
      const distanceFromCenter = Math.sqrt(x * x + z * z)
      if (distanceFromCenter > 5 || Math.random() > 0.7) {
        // Random flower color
        const colorIndex = Math.floor(Math.random() * 8)
        const colors = [
          new Color("#FF1493"),
          new Color("#FF4500"),
          new Color("#FFD700"),
          new Color("#9932CC"),
          new Color("#00FFFF"),
          new Color("#FF00FF"),
          new Color("#FF69B4"),
          new Color("#FFA500"),
        ]

        patches.push({
          position: [x, -0.2, z],
          rotation: [0, Math.random() * Math.PI * 2, 0],
          scale: [0.8 + Math.random() * 0.4, 0.8 + Math.random() * 0.4, 0.8 + Math.random() * 0.4],
          color: colors[colorIndex],
          secondaryColor: colors[(colorIndex + 3) % 8],
          flowerType: Math.floor(Math.random() * 5),
        })
      }
    }
    return patches
  }, [count])

  // Reference for animation
  const flowerGroupRef = useRef()

  // Optimize flower animation with throttling
  useFrame(({ clock }) => {
    if (flowerGroupRef.current) {
      const time = clock.getElapsedTime() * 0.5 // Slow down animation
      // Only update every other flower to reduce calculations
      for (let i = 0; i < flowerPatches.length; i += 2) {
        const flower = flowerGroupRef.current.children[i]
        if (flower) {
          flower.rotation.y = Math.sin(time + i) * 0.2
          flower.position.y = Math.cos(time + i) * 0.05 - 0.2
        }
      }
    }
  })

  return (
    <group ref={flowerGroupRef}>
      {flowerPatches.map((patch, index) => (
        <Flower
          key={index}
          position={patch.position}
          rotation={patch.rotation}
          scale={patch.scale}
          color={patch.color}
          secondaryColor={patch.secondaryColor}
          flowerType={patch.flowerType}
        />
      ))}
    </group>
  )
}

function Flower({ position, rotation, scale, color, secondaryColor, flowerType }) {
  const stemHeight = 0.5
  const stemRadius = 0.05
  const petalSize = 0.2

  let petalGeometry
  switch (flowerType) {
    case 0:
      petalGeometry = <sphereGeometry args={[petalSize, 16, 16]} />
      break
    case 1:
      petalGeometry = <boxGeometry args={[petalSize, petalSize, petalSize]} />
      break
    case 2:
      petalGeometry = <coneGeometry args={[petalSize, petalSize * 2, 16]} />
      break
    case 3:
      petalGeometry = <cylinderGeometry args={[petalSize, petalSize, petalSize * 2, 16]} />
      break
    default:
      petalGeometry = <tetrahedronGeometry args={[petalSize]} />
  }

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Stem */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[stemRadius, stemRadius, stemHeight, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Flower petals */}
      {[...Array(5)].map((_, i) => {
        const angle = (i / 5) * Math.PI * 2
        const x = Math.cos(angle) * stemHeight
        const z = Math.sin(angle) * stemHeight
        return (
          <mesh key={i} position={[x, stemHeight / 2, z]} rotation={[0, angle, 0]} castShadow receiveShadow>
            {petalGeometry}
            <meshStandardMaterial color={i % 2 === 0 ? color : secondaryColor} roughness={0.8} metalness={0.1} />
          </mesh>
        )
      })}
    </group>
  )
}
