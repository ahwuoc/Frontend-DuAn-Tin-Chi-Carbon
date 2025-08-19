"use client"

import { Suspense, useRef, useMemo, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, Sky, Cloud, Sparkles, Html } from "@react-three/drei"
import { Color, MathUtils, Vector3 } from "three"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Info, Sun, Moon, X, ChevronUp, ChevronDown, Maximize, Minimize } from "lucide-react"
import { useTropicalForest } from "../hooks"  

interface Donor {
  name: string
  treeCount: number
}

interface TropicalForestProps {
  donors?: Donor[]
  language?: string
}

export default function TropicalForest({ donors = [], language = "vi" }: TropicalForestProps) {
  const { state, actions, performanceSettings, cameraSettings } = useTropicalForest(donors, language)
  
  const { showUI, isNight, showInfo, minimizePanel, selectedElement } = state
  const { toggleUI, toggleNight, toggleInfo, toggleMinimizePanel, setSelectedElement } = actions

  return (
    <div className="w-full h-full bg-gradient-to-b from-sky-300 to-sky-500 relative">
      <Canvas
        shadows
        camera={cameraSettings}
        dpr={cameraSettings.dpr}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={isNight ? 0.1 : 0.3} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={isNight ? 0.2 : 1.5}
            castShadow
            shadow-mapSize-width={performanceSettings.shadowMapSize}
            shadow-mapSize-height={performanceSettings.shadowMapSize}
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
          <GroundFlowers count={performanceSettings.flowerDensity} />

          {/* Forest elements */}
          <ForestElements treeCount={performanceSettings.treeCount} onSelect={setSelectedElement} donors={donors} language={language} />

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
          <CameraController />

          {/* Element information tooltip */}
          {selectedElement && (
            <Html position={selectedElement.position}>
              <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg text-sm w-48 transform -translate-x-1/2 -translate-y-full mb-2">
                <h3 className="font-bold">{selectedElement.type}</h3>
                <p>{selectedElement.description}</p>
                <button
                  className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedElement(null)}
                >
                  <X size={14} />
                </button>
              </div>
            </Html>
          )}
        </Suspense>
      </Canvas>

      {/* UI Controls Overlay - Keep the same */}
      {showUI && (
        <>
          {/* Top Navigation Bar */}
          <div className="absolute top-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-800 font-semibold">
                Tropical Forest Explorer
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={toggleNight}
              >
                {isNight ? <Moon size={14} /> : <Sun size={14} />}
                {isNight ? "Night" : "Day"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={toggleInfo}
              >
                <Info size={14} />
                Info
              </Button>
            </div>
          </div>

          {/* Simplified Control Panel */}
          <div
            className={`absolute ${minimizePanel ? "bottom-0 left-0 right-0" : "bottom-4 left-4 w-80"} bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden transition-all duration-300`}
          >
            <div className="flex justify-between items-center p-2 bg-green-800 text-white">
              <h3 className="font-semibold">Forest Settings</h3>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white hover:text-white hover:bg-green-700"
                  onClick={toggleMinimizePanel}
                >
                  {minimizePanel ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white hover:text-white hover:bg-green-700"
                  onClick={toggleUI}
                >
                  <Minimize size={14} />
                </Button>
              </div>
            </div>

            {!minimizePanel && (
              <div className="p-3">
                <Tabs defaultValue="environment">
                  <TabsList className="w-full">
                    <TabsTrigger value="environment" className="flex-1">
                      Environment
                    </TabsTrigger>
                    <TabsTrigger value="controls" className="flex-1">
                      Controls
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="environment" className="pt-3">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Time of Day</label>
                          <Switch checked={isNight} onCheckedChange={toggleNight} />
                        </div>
                        <p className="text-xs text-gray-500">Toggle between day and night</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium">Tree Count</label>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{performanceSettings.treeCount}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium">Flower Count</label>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{performanceSettings.flowerDensity}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="controls" className="pt-3">
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">Điều khiển bàn phím:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="font-semibold">Di chuyển:</p>
                          <ul className="space-y-1">
                            <li>W / ↑ - Di chuyển tiến</li>
                            <li>S / ↓ - Di chuyển lùi</li>
                            <li>A / ← - Di chuyển sang trái</li>
                            <li>D / → - Di chuyển sang phải</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold">Độ cao:</p>
                          <ul className="space-y-1">
                            <li>E - Di chuyển lên</li>
                            <li>Q - Di chuyển xuống</li>
                          </ul>
                          <p className="font-semibold mt-2">Tốc độ:</p>
                          <ul className="space-y-1">
                            <li>Shift - Chạy nhanh</li>
                          </ul>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="font-semibold">Điều khiển chuột:</p>
                        <ul className="space-y-1">
                          <li>Kéo chuột - Nhìn xung quanh</li>
                          <li>Giữ chuột phải - Phóng to (như ống nhòm)</li>
                          <li>Cuộn chuột - Phóng to/thu nhỏ</li>
                        </ul>
                      </div>
                      <div className="mt-3 p-2 bg-green-50 rounded-md border border-green-200">
                        <p className="text-xs text-green-800">
                          <span className="font-semibold">Mẹo:</span> Di chuyển có gia tốc và giảm tốc tự nhiên. Giữ
                          Shift để chạy nhanh với hiệu ứng lắc đầu nhẹ. Tiếp cận gần các đối tượng để xem chi tiết.
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

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute top-16 left-4 w-80 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">Tropical Forest</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleInfo}>
              <X size={14} />
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            <p>This tropical forest features:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{performanceSettings.treeCount} trees with detailed root systems</li>
              <li>Multiple tropical tree species (palm, banana, kapok, bamboo, and ficus)</li>
              <li>{performanceSettings.flowerDensity} beautiful tropical flowers</li>
              <li>A natural water feature</li>
              <li>Winding forest paths</li>
              <li>Day and night lighting modes</li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">Click on any element in the forest to learn more about it.</p>
          </div>
        </div>
      )}

      {/* Show UI button (when UI is hidden) */}
      {!showUI && (
        <Button className="absolute bottom-4 right-4" onClick={toggleUI}>
          <Maximize size={16} className="mr-2" />
          Show Controls
        </Button>
      )}

      {/* Keyboard controls hint */}
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-lg text-xs">
        Use WASD or Arrow Keys to move
      </div>
    </div>
  )
}

function CloudGroup({ isNight }) {
  const cloudPositions = useMemo(() => {
    const positions = []
    for (let i = 0; i < 5; i++) {
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
  }, []) // Empty dependency array is fine here since we want static cloud positions

  return (
    <>
      {cloudPositions.map((cloud, index) => (
        <Cloud
          key={`cloud-${index}`}
          position={cloud.position}
          scale={cloud.scale}
          rotation={cloud.rotation}
          seed={cloud.seed}
          speed={0}
          opacity={1}
          color="white"
          segments={8}
        />
      ))}
    </>
  )
}

function CameraController() {
  const { camera, gl } = useThree()
  const orbitControlsRef = useRef<any>(null)
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
  const isAltPressed = useRef(false)
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
        if ('fov' in camera && camera.fov !== zoomFOV.current) {
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
    if (isZooming.current && 'fov' in camera) {
      camera.fov = MathUtils.lerp(camera.fov, zoomFOV.current, delta * 5)
      camera.updateProjectionMatrix()
    } else if ('fov' in camera && camera.fov !== defaultFOV.current) {
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

    // For left/right movement - use WORLD coordinates, not camera-relative
    if (left || right) {
      // Create a vector pointing directly to the left/right in world space
      sideVector.set(
        -1 * (left ? 1 : 0) + 1 * (right ? 1 : 0), // X axis (world space)
        0, // No Y movement
        0, // No Z movement
      )

      // Rotate this vector to align with camera's horizontal rotation
      sideVector.applyAxisAngle(new Vector3(0, 1, 0), camera.rotation.y)

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

    // Update orbit controls target with smooth following
    if (orbitControlsRef.current) {
      const targetDistance = 10
      const targetDirection = new Vector3()
      camera.getWorldDirection(targetDirection)
      const targetPosition = new Vector3()
      targetPosition.copy(camera.position)
      targetPosition.add(targetDirection.multiplyScalar(targetDistance))
      orbitControlsRef.current.target.lerp(targetPosition, 0.1)
    }
  })

  return (
    <OrbitControls
      ref={orbitControlsRef}
      camera={camera}
      domElement={gl.domElement}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      keyPanSpeed={0}
      minPolarAngle={Math.PI * 0.25}
      maxPolarAngle={Math.PI - 0.1}
      minDistance={0.1} // Allow very close zoom
      maxDistance={50}
      zoomSpeed={0.5}
      rotateSpeed={0.5}
      enableDamping={true}
      dampingFactor={0.1}
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

function GroundFlowers({ count = 50 }) {
  const flowerPatches = useMemo(() => {
    const patches = []
    const patchCount = count

    for (let i = 0; i < patchCount; i++) {
      const x = MathUtils.randFloatSpread(80)
      const z = MathUtils.randFloatSpread(80)

      const distanceFromCenter = Math.sqrt(x * x + z * z)
      if (distanceFromCenter > 5 || Math.random() > 0.7) {
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
  const flowerGroupRef = useRef<any>(null)

  // Optimize flower animation with throttling
  useFrame(({ clock }) => {
    if (flowerGroupRef.current) {
      const time = clock.getElapsedTime() * 0.5 // Slow down animation
      for (let i = 0; i < flowerGroupRef.current.children.length; i += 2) {
        const flower = flowerGroupRef.current.children[i]
        if (flower) {
          flower.rotation.z = Math.sin(time + i * 100) * 0.03
        }
      }
    }
  })

  // Group flowers by distance for better culling
  const nearFlowers = useMemo(() => flowerPatches.filter((_, i) => i % 3 === 0), [flowerPatches])
  const midFlowers = useMemo(() => flowerPatches.filter((_, i) => i % 3 === 1), [flowerPatches])
  const farFlowers = useMemo(() => flowerPatches.filter((_, i) => i % 3 === 2), [flowerPatches])

  return (
    <group ref={flowerGroupRef}>
      {/* Always render near flowers without culling */}
      <group>
        {nearFlowers.map((patch, index) => (
          <EnhancedFlower key={index} {...patch} />
        ))}
      </group>

      {/* Mid-distance flowers */}
      <group>
        {midFlowers.map((patch, index) => (
          <EnhancedFlower key={index} {...patch} />
        ))}
      </group>

      {/* Far flowers */}
      <group>
        {farFlowers.map((patch, index) => (
          <EnhancedFlower key={index} {...patch} />
        ))}
      </group>
    </group>
  )
}

// Enhanced flower with more details and beauty
function EnhancedFlower({ position, rotation, scale, color, secondaryColor, flowerType }) {
  const stemColor = new Color(0x2e7d32)

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Enhanced stem with leaves */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.8, 8]} />
        <meshStandardMaterial color={stemColor} />
      </mesh>

      {/* Add leaves to stem */}
      <mesh position={[0.1, 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.1, 0.3, 4]} />
        <meshStandardMaterial color="#4CAF50" side={2} />
      </mesh>

      <mesh position={[-0.1, 0.4, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <coneGeometry args={[0.1, 0.3, 4]} />
        <meshStandardMaterial color="#4CAF50" side={2} />
      </mesh>

      {flowerType === 0 && (
        // Enhanced tropical flower with layered petals
        <group position={[0, 0.8, 0]}>
          {/* Inner petals */}
          {[...Array(8)].map((_, i) => (
            <mesh key={i} rotation={[0, (i / 8) * Math.PI * 2, 0]} position={[0.15, 0, 0]} rotation-x={Math.PI / 4}>
              <boxGeometry args={[0.4, 0.08, 0.08]} />
              <meshStandardMaterial color={color} />
            </mesh>
          ))}

          {/* Outer petals */}
          {[...Array(8)].map((_, i) => (
            <mesh
              key={`outer-${i}`}
              rotation={[0, (i / 8) * Math.PI * 2 + Math.PI / 8, 0]}
              position={[0.25, -0.05, 0]}
              rotation-x={Math.PI / 3}
            >
              <boxGeometry args={[0.5, 0.06, 0.06]} />
              <meshStandardMaterial color={secondaryColor} />
            </mesh>
          ))}

          {/* Center */}
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="yellow" />
          </mesh>

          {/* Stamen */}
          {[...Array(12)].map((_, i) => (
            <mesh key={`stamen-${i}`} position={[0, 0.1, 0]} rotation={[0, (i / 12) * Math.PI * 2, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.2, 4]} />
              <meshStandardMaterial color="orange" />
              <mesh position={[0, 0.12, 0]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshStandardMaterial color="gold" />
              </mesh>
            </mesh>
          ))}
        </group>
      )}

      {flowerType === 1 && (
        // Enhanced orchid-like flower
        <group position={[0, 0.8, 0]}>
          {/* Main petals */}
          {[...Array(3)].map((_, i) => (
            <mesh key={i} rotation={[0, (i / 3) * Math.PI * 2, 0]} position={[0.1, 0, 0]} rotation-x={Math.PI / 3}>
              <planeGeometry args={[0.25, 0.4]} />
              <meshStandardMaterial color={color} side={2} />
            </mesh>
          ))}

          {/* Secondary petals */}
          {[...Array(3)].map((_, i) => (
            <mesh
              key={`sec-${i}`}
              rotation={[0, (i / 3) * Math.PI * 2 + Math.PI / 3, 0]}
              position={[0.08, 0.1, 0]}
              rotation-x={Math.PI / 4}
            >
              <planeGeometry args={[0.2, 0.3]} />
              <meshStandardMaterial color={secondaryColor} side={2} />
            </mesh>
          ))}

          {/* Center */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="white" />
          </mesh>

          {/* Detailed center */}
          <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.1, 8]} />
            <meshStandardMaterial color="yellow" />
          </mesh>
        </group>
      )}

      {flowerType === 2 && (
        // Enhanced bird of paradise-like flower
        <group position={[0, 0.8, 0]}>
          {/* Base */}
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <coneGeometry args={[0.12, 0.3, 8]} />
            <meshStandardMaterial color={color} />
          </mesh>

          {/* Main "beak" */}
          <mesh position={[0, 0.15, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.25, 0.4]} />
            <meshStandardMaterial color="orange" side={2} />
          </mesh>

          {/* Secondary "feathers" */}
          <mesh position={[0.1, 0.1, 0.05]} rotation={[Math.PI / 2, Math.PI / 6, 0]}>
            <planeGeometry args={[0.15, 0.3]} />
            <meshStandardMaterial color={secondaryColor} side={2} />
          </mesh>

          <mesh position={[-0.1, 0.1, 0.05]} rotation={[Math.PI / 2, -Math.PI / 6, 0]}>
            <planeGeometry args={[0.15, 0.3]} />
            <meshStandardMaterial color={secondaryColor} side={2} />
          </mesh>

          {/* Stamen */}
          <mesh position={[0, 0.2, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.2, 4]} />
            <meshStandardMaterial color="blue" />
          </mesh>
        </group>
      )}

      {flowerType === 3 && (
        // Tropical lily-like flower
        <group position={[0, 0.8, 0]}>
          {/* Petals */}
          {[...Array(6)].map((_, i) => (
            <mesh key={i} rotation={[0, (i / 6) * Math.PI * 2, 0]} position={[0.15, 0, 0]} rotation-x={Math.PI / 4}>
              <cylinderGeometry args={[0.08, 0.2, 0.4, 8]} />
              <meshStandardMaterial color={color} />
            </mesh>
          ))}

          {/* Center */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
            <meshStandardMaterial color="yellow" />
          </mesh>

          {/* Stamen */}
          {[...Array(6)].map((_, i) => (
            <mesh key={`stamen-${i}`} position={[0, 0.2, 0]} rotation={[0, (i / 6) * Math.PI * 2, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.2, 4]} />
              <meshStandardMaterial color="gold" />
              <mesh position={[0, 0.12, 0]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial color="orange" />
              </mesh>
            </mesh>
          ))}
        </group>
      )}

      {flowerType === 4 && (
        // Exotic tropical flower with multiple layers
        <group position={[0, 0.8, 0]}>
          {/* Base layer */}
          {[...Array(5)].map((_, i) => (
            <mesh key={i} rotation={[0, (i / 5) * Math.PI * 2, 0]} position={[0.2, -0.1, 0]} rotation-x={Math.PI / 6}>
              <planeGeometry args={[0.4, 0.2]} />
              <meshStandardMaterial color={color} side={2} />
            </mesh>
          ))}

          {/* Middle layer */}
          {[...Array(5)].map((_, i) => (
            <mesh
              key={`mid-${i}`}
              rotation={[0, (i / 5) * Math.PI * 2 + Math.PI / 5, 0]}
              position={[0.15, 0, 0]}
              rotation-x={Math.PI / 4}
            >
              <planeGeometry args={[0.3, 0.15]} />
              <meshStandardMaterial color={secondaryColor} side={2} />
            </mesh>
          ))}

          {/* Inner layer */}
          {[...Array(5)].map((_, i) => (
            <mesh
              key={`inner-${i}`}
              rotation={[0, (i / 5) * Math.PI * 2, 0]}
              position={[0.1, 0.1, 0]}
              rotation-x={Math.PI / 3}
            >
              <planeGeometry args={[0.2, 0.1]} />
              <meshStandardMaterial color="white" side={2} />
            </mesh>
          ))}

          {/* Center */}
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="gold" />
          </mesh>

          {/* Stamen */}
          {[...Array(8)].map((_, i) => (
            <mesh key={`stamen-${i}`} position={[0, 0.05, 0]} rotation={[0, (i / 8) * Math.PI * 2, Math.PI / 6]}>
              <cylinderGeometry args={[0.01, 0.01, 0.15, 4]} />
              <meshStandardMaterial color="orange" />
              <mesh position={[0, 0.08, 0]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshStandardMaterial color="red" />
              </mesh>
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}

// Optimize the ForestElements function to reduce tree count
function ForestElements({ treeCount = 15, onSelect, donors = [], language = "vi" }) {
  // Define root color and other variables for tree components
  const rootColor = new Color("#6d4c41")
  const radius = 0.5
  const depth = 0.3
  const count = 6
  const factor = 0.7

  const treePositions = useMemo(() => {
    const positions = []
    for (let i = 0; i < treeCount; i++) {
      const x = Math.random() * 120 - 60
      const z = Math.random() * 120 - 60

      const distanceFromCenter = Math.sqrt(x * x + z * z)
      const distanceFromLake = Math.sqrt(Math.pow(x - 10, 2) + Math.pow(z - 10, 2))
      if (distanceFromCenter > 5 && distanceFromLake > 8) {
        const donor = donors[i % donors.length] || null

        positions.push({
          position: [x, 0, z],
          type: Math.floor(Math.random() * 5),
          scale: 0.8 + Math.random() * 0.5,
          donor: donor,
        })
      }
    }
    return positions
  }, [treeCount, donors.length]) 

  const pathPoints = useMemo(() => {
    const points = []
    // Reduce path points from 20 to 10
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2
      const radius = 15 + Math.sin(i * 0.5) * 5
      points.push([Math.cos(angle) * radius, -0.4, Math.sin(angle) * radius])
    }
    return points
  }, []) // Empty dependency array is fine here since path points are static

  // Handle element selection
  const handleTreeClick = (position, treeType, donor) => {
    const treeDescriptions = [
      "A native tropical conifer with buttress roots for stability in shallow soil.",
      "A tall palm tree with a slender trunk and distinctive fronds, common in tropical coastlines.",
      "A banana tree with large, paddle-shaped leaves and possibly fruit clusters.",
      "A kapok tree with a distinctive buttressed base and umbrella-like canopy, providing habitat for many species.",
      "A cluster of bamboo, technically a grass but growing tall like trees, providing structure to the forest.",
      "A ficus tree with aerial roots that can grow into additional trunks, creating a complex structure.",
    ]

    const treeNames = ["Tropical Conifer", "Palm Tree", "Banana Tree", "Kapok Tree", "Bamboo Cluster", "Ficus Tree"]

    onSelect({
      type: treeNames[treeType],
      position,
      description: donor
        ? `${treeDescriptions[treeType]} ${language === "vi" ? "Cây này được đóng góp bởi" : "This tree was contributed by"} ${donor.name} (${donor.treeCount} ${language === "vi" ? "cây" : "trees"}).`
        : treeDescriptions[treeType],
    })
  }

  const handleWaterClick = (position) => {
    onSelect({
      type: "Natural Lake",
      position,
      description: "A freshwater lake that supports diverse aquatic life and provides water for the forest ecosystem.",
    })
  }

  const handlePathClick = (position) => {
    onSelect({
      type: "Forest Path",
      position,
      description: "A natural path formed by animal and human movement through the forest.",
    })
  }

  // Optimize lake elements
  const lakeCenter = [10, -0.49, 10]
  const lakeElements = useMemo(() => {
    const elements = []

    // Main lake body
    elements.push({
      position: [lakeCenter[0], lakeCenter[1], lakeCenter[2]],
      radius: 7,
      color: "#3498db",
    })

    // Reduce edge count from 24 to 12
    const edgeCount = 12
    for (let i = 0; i < edgeCount; i++) {
      const angle = (i / edgeCount) * Math.PI * 2
      const distance = 5 + Math.random() * 3
      const x = lakeCenter[0] + Math.cos(angle) * distance
      const z = lakeCenter[2] + Math.sin(angle) * distance
      const radius = 1.5 + Math.random() * 3

      elements.push({
        position: [x, lakeCenter[1], z],
        radius: radius,
        color: "#3498db",
      })
    }

    // Reduce inner circles from 10 to 5
    for (let i = 0; i < 5; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * 4
      const x = lakeCenter[0] + Math.cos(angle) * distance
      const z = lakeCenter[2] + Math.sin(angle) * distance

      elements.push({
        position: [x, lakeCenter[1] - 0.01, z],
        radius: 1 + Math.random() * 2,
        color: "#2980b9",
      })
    }

    return elements
  }, []) // Empty dependency array is fine here since lake elements are static

  return (
    <>
      {/* Trees - no culling */}
      {treePositions.map((tree, index) => {
        // Render different tree types based on the type value
        const TreeComponent = () => {
          switch (tree.type) {
            case 0:
              return (
                <ConiferTree
                  position={[0, 0, 0]}
                  scale={[tree.scale, tree.scale, tree.scale]}
                  onClick={() => handleTreeClick(tree.position, 0, tree.donor)}
                  onPointerOver={() => {
                    /* Handle hover effect */
                  }}
                  onPointerOut={() => {
                    /* Handle hover out effect */
                  }}
                />
              )
            case 1:
              return (
                <PalmTree
                  position={[0, 0, 0]}
                  scale={[tree.scale, tree.scale, tree.scale]}
                  onClick={() => handleTreeClick(tree.position, 1, tree.donor)}
                  onPointerOver={() => {
                    /* Handle hover effect */
                  }}
                  onPointerOut={() => {
                    /* Handle hover out effect */
                  }}
                />
              )
            case 2:
              return (
                <BananaTree
                  position={[0, 0, 0]}
                  scale={[tree.scale, tree.scale, tree.scale]}
                  onClick={() => handleTreeClick(tree.position, 2, tree.donor)}
                  onPointerOver={() => {
                    /* Handle hover effect */
                  }}
                  onPointerOut={() => {
                    /* Handle hover out effect */
                  }}
                />
              )
            case 3:
              return (
                <KapokTree
                  position={[0, 0, 0]}
                  scale={[tree.scale, tree.scale, tree.scale]}
                  onClick={() => handleTreeClick(tree.position, 3, tree.donor)}
                  onPointerOver={() => {
                    /* Handle hover effect */
                  }}
                  onPointerOut={() => {
                    /* Handle hover out effect */
                  }}
                />
              )
            case 4:
              return (
                <BambooCluster
                  position={[0, 0, 0]}
                  scale={[tree.scale, tree.scale, tree.scale]}
                  onClick={() => handleTreeClick(tree.position, 4, tree.donor)}
                  onPointerOver={() => {
                    /* Handle hover effect */
                  }}
                  onPointerOut={() => {
                    /* Handle hover out effect */
                  }}
                />
              )
            default:
              return (
                <FicusTree
                  position={[0, 0, 0]}
                  scale={[tree.scale, tree.scale, tree.scale]}
                  onClick={() => handleTreeClick(tree.position, 5, tree.donor)}
                  onPointerOver={() => {
                    /* Handle hover effect */
                  }}
                  onPointerOut={() => {
                    /* Handle hover out effect */
                  }}
                />
              )
          }
        }

        return (
          <group key={index} position={tree.position}>
            <TreeComponent />
            {/* Add donor name label above tree */}
            {tree.donor && (
              <Html position={[0, 8, 0]} center>
                <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs whitespace-nowrap">
                  {tree.donor.name} ({tree.donor.treeCount})
                </div>
              </Html>
            )}
          </group>
        )
      })}

      {/* Paths - no culling */}
      {pathPoints.map((point, index) => (
        <Path key={index} position={point} onClick={() => handlePathClick(point)} />
      ))}

      {/* Cloud-like lake */}
      <group>
        {/* Lake elements */}
        {lakeElements.map((element, index) => (
          <mesh
            key={`lake-${index}`}
            position={element.position}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
            onClick={() => handleWaterClick(element.position)}
          >
            <circleGeometry args={[element.radius, 16]} /> {/* Reduce segments from 32 to 16 */}
            <meshStandardMaterial
              color={element.color}
              roughness={0.1}
              metalness={0.8}
              transparent={true}
              opacity={0.9}
            />
          </mesh>
        ))}

        {/* Water plants - reduce from 15 to 8 */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          const radiusVariation = 0.7 + Math.random() * 0.3
          const baseRadius = 7 * radiusVariation
          const x = lakeCenter[0] + Math.cos(angle) * baseRadius
          const z = lakeCenter[2] + Math.sin(angle) * baseRadius

          return (
            <mesh key={`plant-${i}`} position={[x, -0.3, z]} rotation={[0, Math.random() * Math.PI, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.4, 6]} />
              <meshStandardMaterial color="#27ae60" />

              <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.5, 0.5]} />
                <meshStandardMaterial color="#2ecc71" side={2} />
              </mesh>
            </mesh>
          )
        })}

        {/* Rocks - reduce from 12 to 6 */}
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2
          const distance = 7 + Math.random() * 2
          const x = lakeCenter[0] + Math.cos(angle) * distance
          const z = lakeCenter[2] + Math.sin(angle) * distance
          const scale = 0.3 + Math.random() * 0.4

          return (
            <mesh
              key={`rock-${i}`}
              position={[x, -0.3 + scale / 2, z]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
              scale={[scale, scale, scale]}
            >
              <dodecahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#7f8c8d" roughness={0.9} />
            </mesh>
          )
        })}
      </group>

      {/* Hills - no culling */}
      <HillComponent position={[-15, 0, -15]} scale={[10, 5, 10]} />
      <HillComponent position={[20, 0, -10]} scale={[15, 3, 15]} />
      <HillComponent position={[-25, 0, 20]} scale={[12, 4, 12]} />
      <HillComponent position={[30, 0, 25]} scale={[8, 6, 8]} />
      <HillComponent position={[0, 0, -30]} scale={[14, 2, 14]} />
    </>
  )
}

// Optimize the Hill component
function Hill({ position, scale }) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <coneGeometry args={[1, 1, 8, 1, true]} /> {/* Reduce segments from 16 to 8 */}
      <meshStandardMaterial color="#4CAF50" roughness={0.8} />
    </mesh>
  )
}

// Original conifer tree
function ConiferTree({ position, scale, onClick, onPointerOver, onPointerOut }) {
  // Simple tree representation with cone and cylinder
  return (
    <group
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Trunk */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.4, 4, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>

      {/* Foliage */}
      <mesh position={[0, 5, 0]} castShadow>
        <coneGeometry args={[2, 6, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.8} />
      </mesh>

      {/* Tree Roots */}
      <TreeRoots position={[0, 0, 0]} />
    </group>
  )
}

// Palm tree
function PalmTree({ position, scale, onClick, onPointerOver, onPointerOut }) {
  return (
    <group
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Trunk - taller and more slender than conifer */}
      <mesh position={[0, 4, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 8, 8]} />
        <meshStandardMaterial color="#A0522D" roughness={0.9} />
      </mesh>

      {/* Palm fronds */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const tiltAngle = Math.PI / 6 // Tilt angle for the fronds

        return (
          <group key={i} position={[0, 8, 0]} rotation={[tiltAngle, angle, 0]}>
            {/* Frond stem */}
            <mesh position={[0, 1.5, 0]} rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.1, 3, 5]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>

            {/* Frond leaves */}
            {[...Array(10)].map((_, j) => {
              const leafPos = j * 0.3 - 1.5
              const leafScale = 0.8 - Math.abs(leafPos) * 0.2

              return (
                <mesh
                  key={`leaf-${j}`}
                  position={[leafPos, 1.5, 0]}
                  rotation={[0, 0, Math.PI / 2 + (leafPos > 0 ? -0.3 : 0.3)]}
                  scale={[leafScale, leafScale, leafScale]}
                >
                  <planeGeometry args={[0.8, 3]} />
                  <meshStandardMaterial color="#2E8B57" side={2} />
                </mesh>
              )
            })}
          </group>
        )
      })}

      {/* Simple root system */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.3, 0.2, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={1} />
      </mesh>
    </group>
  )
}

// Banana tree
function BananaTree({ position, scale, onClick, onPointerOver, onPointerOut }) {
  return (
    <group
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Trunk - shorter and thicker than palm */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 4, 8]} />
        <meshStandardMaterial color="#556B2F" roughness={0.8} />
      </mesh>

      {/* Large banana leaves */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const height = 3 + i * 0.3

        return (
          <group key={i} position={[0, height, 0]} rotation={[0.2, angle, 0]}>
            {/* Leaf stem */}
            <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 1, 5]} />
              <meshStandardMaterial color="#556B2F" />
            </mesh>

            {/* Leaf */}
            <mesh position={[0, 0, 1]} rotation={[Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.5, 3]} />
              <meshStandardMaterial color="#9ACD32" side={2} />
            </mesh>
          </group>
        )
      })}

      {/* Banana bunch (optional) */}
      {Math.random() > 0.5 && (
        <group position={[0, 3, 0]} rotation={[0, Math.random() * Math.PI * 2, 0]}>
          <mesh position={[0.5, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.5, 5]} />
            <meshStandardMaterial color="#556B2F" />
          </mesh>

          {/* Bananas */}
          {[...Array(8)].map((_, i) => (
            <mesh key={i} position={[0.5, -0.2 - i * 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
              <capsuleGeometry args={[0.05, 0.2, 4, 8]} />
              <meshStandardMaterial color="#FFD700" />
            </mesh>
          ))}
        </group>
      )}

      {/* Simple root system */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.4, 0.2, 8]} />
        <meshStandardMaterial color="#556B2F" roughness={1} />
      </mesh>
    </group>
  )
}

// Kapok/Ceiba tree with buttress roots
function KapokTree({ position, scale, onClick, onPointerOver, onPointerOut }) {
  return (
    <group
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Main trunk - wide and tall */}
      <mesh position={[0, 5, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.8, 10, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>

      {/* Umbrella-like canopy */}
      <group position={[0, 10, 0]}>
        {/* Main branches */}
        {[...Array(5)].map((_, i) => {
          const angle = (i / 5) * Math.PI * 2

          return (
            <group key={i} rotation={[0, angle, 0]}>
              <mesh position={[1.5, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
                <cylinderGeometry args={[0.15, 0.25, 3, 6]} />
                <meshStandardMaterial color="#8B4513" />
              </mesh>

              {/* Foliage clusters */}
              <mesh position={[3, 0.5, 0]}>
                <sphereGeometry args={[1.2, 8, 8]} />
                <meshStandardMaterial color="#006400" roughness={0.8} />
              </mesh>
            </group>
          )
        })}

        {/* Top foliage */}
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[1.5, 8, 8]} />
          <meshStandardMaterial color="#006400" roughness={0.8} />
        </mesh>
      </group>

      {/* Elaborate buttress roots */}
      <group position={[0, 0, 0]}>
        {/* Central base */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[1, 0.8, 1, 8]} />
          <meshStandardMaterial color="#8B4513" roughness={1} />
        </mesh>

        {/* Buttress roots */}
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2
          const x = Math.cos(angle) * 1.5
          const z = Math.sin(angle) * 1.5

          return (
            <mesh key={i} position={[x / 2, 0.5, z / 2]} rotation={[0, angle, 0]} scale={[1.5, 1, 0.2]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#8B4513" roughness={1} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

// Bamboo cluster
function BambooCluster({ position, scale, onClick, onPointerOver, onPointerOut }) {
  // Generate positions for individual bamboo stalks
  const stalkPositions = useMemo(() => {
    const positions = []
    for (let i = 0; i < 7; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * 0.8
      positions.push({
        x: Math.cos(angle) * distance,
        z: Math.sin(angle) * distance,
        height: 5 + Math.random() * 3,
        thickness: 0.1 + Math.random() * 0.1,
        tilt: [Math.random() * 0.2 - 0.1, 0, Math.random() * 0.2 - 0.1],
      })
    }
    return positions
  }, []) // Empty dependency array is fine here since we want static bamboo positions

  return (
    <group
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Individual bamboo stalks */}
      {stalkPositions.map((stalk, i) => (
        <group key={i} position={[stalk.x, 0, stalk.z]} rotation={stalk.tilt}>
          {/* Main stalk */}
          <mesh position={[0, stalk.height / 2, 0]} castShadow>
            <cylinderGeometry args={[stalk.thickness, stalk.thickness, stalk.height, 8]} />
            <meshStandardMaterial color="#90EE90" roughness={0.5} />
          </mesh>

          {/* Bamboo segments/nodes */}
          {[...Array(Math.floor(stalk.height))].map((_, j) => (
            <mesh key={j} position={[0, j + 0.5, 0]} castShadow>
              <torusGeometry args={[stalk.thickness, stalk.thickness * 0.2, 8, 16]} />
              <meshStandardMaterial color="#006400" roughness={0.7} />
            </mesh>
          ))}

          {/* Bamboo leaves at the top */}
          {[...Array(5)].map((_, j) => {
            const leafAngle = (j / 5) * Math.PI * 2

            return (
              <group key={j} position={[0, stalk.height - 0.5, 0]} rotation={[0, leafAngle, 0]}>
                <mesh position={[0.3, 0.3, 0]} rotation={[0, 0, Math.PI / 4]}>
                  <planeGeometry args={[0.8, 0.15]} />
                  <meshStandardMaterial color="#228B22" side={2} />
                </mesh>
              </group>
            )
          })}
        </group>
      ))}

      {/* Base/roots */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[1, 0.8, 0.2, 8]} />
        <meshStandardMaterial color="#556B2F" roughness={1} />
      </mesh>
    </group>
  )
}

// Ficus/Banyan tree with aerial roots
function FicusTree({ position, scale, onClick, onPointerOver, onPointerOut }) {
  return (
    <group
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Main trunk */}
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.6, 6, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>

      {/* Main canopy */}
      <mesh position={[0, 6, 0]} castShadow>
        <sphereGeometry args={[3, 8, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.8} />
      </mesh>

      {/* Aerial roots */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const x = Math.cos(angle) * 1.5
        const z = Math.sin(angle) * 1.5

        return (
          <mesh key={i} position={[x, 3, z]} castShadow>
            <cylinderGeometry args={[0.05, 0.1, 6, 5]} />
            <meshStandardMaterial color="#8B4513" roughness={0.9} />
          </mesh>
        )
      })}

      {/* Secondary trunks from aerial roots */}
      {[...Array(3)].map((_, i) => {
        const angle = (i / 3) * Math.PI * 2
        const x = Math.cos(angle) * 1.8
        const z = Math.sin(angle) * 1.8

        return (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 1.5, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.3, 3, 6]} />
              <meshStandardMaterial color="#8B4513" roughness={0.9} />
            </mesh>

            <mesh position={[0, 3, 0]} castShadow>
              <sphereGeometry args={[1, 6, 6]} />
              <meshStandardMaterial color="#228B22" roughness={0.8} />
            </mesh>
          </group>
        )
      })}

      {/* Base root system */}
      <TreeRoots position={[0, 0, 0]} />
    </group>
  )
}

function TreeRoots({ position }) {
  // Create visible roots for the tree
  const rootColor = new Color("#6d4c41") // Brown color for roots

  return (
    <group position={position}>
      {/* Main root base connecting to trunk */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.4, 0.3, 8]} />
        <meshStandardMaterial color={rootColor} roughness={1} />
      </mesh>

      {/* Surface roots extending outward */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const length = 0.8 + Math.random() * 0.7
        const xPos = Math.cos(angle) * length * 0.7
        const zPos = Math.sin(angle) * length * 0.7

        return (
          <group key={i} position={[0, 0, 0]}>
            {/* Main surface root */}
            <mesh
              position={[xPos / 2, 0.05, zPos / 2]}
              rotation={[0, angle, 0]}
              scale={[length, 0.2, 0.3]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={rootColor} roughness={1} />
            </mesh>

            {/* Secondary root branches */}
            {Math.random() > 0.5 && (
              <mesh
                position={[xPos * 0.8, 0, zPos * 0.8]}
                rotation={[0, angle + Math.PI / 4, 0]}
                scale={[length * 0.6, 0.15, 0.2]}
                castShadow
                receiveShadow
              >
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={rootColor} roughness={1} />
              </mesh>
            )}

            {/* Root knobs/bumps */}
            <mesh position={[xPos, 0.1, zPos]} scale={[0.3, 0.2, 0.3]} castShadow receiveShadow>
              <sphereGeometry args={[1, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={rootColor} roughness={1} />
            </mesh>
          </group>
        )
      })}

      {/* Aerial/buttress roots (typical of tropical trees) */}
      {[...Array(4)].map((_, i) => {
        const angle = (i / 4) * Math.PI * 2
        const xPos = Math.cos(angle) * 0.6
        const zPos = Math.sin(angle) * 0.6

        return (
          <mesh
            key={`aerial-${i}`}
            position={[xPos, 0.5, zPos]}
            rotation={[0, 0, Math.PI / 4 - angle / 2]}
            scale={[0.2, 1, 0.2]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.1, 0.3, 1, 6]} />
            <meshStandardMaterial color={rootColor} roughness={1} />
          </mesh>
        )
      })}
    </group>
  )
}

function Path({ position, onClick }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={onClick}>
      <circleGeometry args={[0.8, 16]} />
      <meshStandardMaterial color="#D2B48C" roughness={0.9} />
    </mesh>
  )
}

// Optimize the Hill component
function HillComponent({ position, scale }) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <coneGeometry args={[1, 1, 8, 1, true]} /> {/* Reduce segments from 16 to 8 */}
      <meshStandardMaterial color="#4CAF50" roughness={0.8} />
    </mesh>
  )
}

// Optimize the Stars component to reduce rendering load
function Stars({ radius = 100, depth = 50, count = 2500, factor = 4, saturation = 0, fade = false, speed = 1 }) {
  // Reduce star count from 5000 to 2500
  const [positions] = useState(() => {
    return Array.from({ length: count }, () => {
      const z = Math.random() * depth - depth / 2
      const u = Math.random() * 2 * Math.PI
      const t = Math.random()
      const r = radius * Math.sqrt(t)
      const x = r * Math.cos(u)
      const y = r * Math.sin(u)
      return [x, y, z]
    })
  }) 

  const shader = useRef<any>(null)
  useFrame((state, delta) => {
    if (shader.current) {
      shader.current.uniforms.uTime.value += delta * speed * 0.5 // Slow down animation
    }
  })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={new Float32Array(positions.flat())}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={shader}
        blending={1}
        depthWrite={false}
        fragmentShader={`
          uniform float uTime;
          varying float vDistance;
          void main() {
            float fade = smoothstep(0.0, 1.0, abs(vDistance) / 50.0);
            gl_FragColor = vec4(0.5 + 0.5 * sin(uTime + gl_PointCoord.xyx + vec3(0, 2, 4)), 1, 1) * vec4(1.0,1.0,1.0, ${fade ? "fade" : "1.0"} );
          }
        `}
        vertexShader={`
          uniform float uTime;
          varying float vDistance;
          void main() {
            vec3 pos = position;
            pos.z += sin(uTime / 2.0 + position.x / factor) * factor;
            vDistance = pos.z;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = ${factor.toFixed(1)};
          }
        `}
        uniforms={{ uTime: { value: 0 } }}
      />
    </points>
  )
}
