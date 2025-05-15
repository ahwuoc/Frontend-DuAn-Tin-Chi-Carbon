"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import type * as THREE from "three"
import { useLanguage } from "@/context/language-context"

// Define the tree model props
interface TreeModelProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  ownerName: string
  treeId: string
  onClick?: () => void
  hovered?: boolean
}

// Tree model component
function TreeModel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  ownerName,
  treeId,
  onClick,
  hovered,
}: TreeModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const leavesRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()

  // Simulate wind effect on leaves when hovered
  useFrame((state, delta) => {
    if (groupRef.current && leavesRef.current) {
      // Rotate the tree slightly for a natural look
      groupRef.current.rotation.y += delta * 0.05

      // If hovered, animate the leaves
      if (hovered && leavesRef.current) {
        leavesRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.02
        leavesRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 2) * 0.02
      }
    }
  })

  // For now, we'll create a simple tree model
  // This would be replaced with a proper GLTF model later
  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation as any}
      scale={[scale, scale, scale]}
      onClick={onClick}
    >
      {/* Tree trunk */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 1, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* Tree leaves */}
      <group ref={leavesRef}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <coneGeometry args={[1, 2, 8]} />
          <meshStandardMaterial color="#2E8B57" roughness={0.6} />
        </mesh>
        <mesh position={[0, 2.2, 0]} castShadow>
          <coneGeometry args={[0.7, 1.5, 8]} />
          <meshStandardMaterial color="#3CB371" roughness={0.6} />
        </mesh>
      </group>

      {/* Ground/grass */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color="#7CFC00" roughness={0.8} />
      </mesh>

      {/* Small animal (bird) */}
      <mesh position={[0.5, 1.8, 0.5]} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FF6347" />
      </mesh>

      {/* Name plate */}
      <group position={[0, -0.1, 0.8]}>
        <mesh castShadow>
          <boxGeometry args={[1, 0.3, 0.05]} />
          <meshStandardMaterial color="#D2B48C" />
        </mesh>
        {/* Name would be added as a texture or HTML overlay */}
      </group>
    </group>
  )
}

// Main component for the interactive tree display
interface InteractiveTreeProps {
  ownerName: string
  treeId: string
  onTreeClick: () => void
}

export default function InteractiveTree({ ownerName, treeId, onTreeClick }: InteractiveTreeProps) {
  const [hovered, setHovered] = useState(false)
  const { language } = useLanguage()

  return (
    <div
      className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas shadows dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <PerspectiveCamera makeDefault position={[0, 1, 5]} />
        <TreeModel ownerName={ownerName} treeId={treeId} onClick={onTreeClick} hovered={hovered} />
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2} />
      </Canvas>

      {/* Owner info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
        <div className="text-lg font-semibold">{ownerName}</div>
        <div className="text-sm">ID: {treeId}</div>
        <button
          onClick={onTreeClick}
          className="mt-2 px-3 py-1 bg-green-600 hover:bg-green-700 rounded-md text-sm transition-colors"
        >
          {language === "vi" ? "Xem chi tiết" : "View details"}
        </button>
      </div>
    </div>
  )
}
