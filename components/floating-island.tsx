"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import type * as THREE from "three"
import { useLanguage } from "@/context/language-context"

// Island component that renders the 3D model
function Island({
  ownerName,
  treeId,
  onClick,
  hovered,
}: {
  ownerName: string
  treeId: string
  onClick: () => void
  hovered: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const treesRef = useRef<THREE.Group>(null)
  const cloudsRef = useRef<THREE.Group>(null)

  // Animation on hover
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05

      // Rotate slightly when hovered
      if (hovered) {
        groupRef.current.rotation.y += delta * 0.2
      }
    }

    // Animate trees when hovered
    if (treesRef.current && hovered) {
      treesRef.current.children.forEach((tree, i) => {
        tree.position.y = Math.sin(state.clock.elapsedTime * 0.5 + i * 0.2) * 0.03 + 0.03
      })
    }

    // Animate clouds
    if (cloudsRef.current) {
      cloudsRef.current.children.forEach((cloud, i) => {
        cloud.position.x = Math.sin(state.clock.elapsedTime * 0.2 + i) * 0.3
        cloud.position.z = Math.cos(state.clock.elapsedTime * 0.2 + i) * 0.3
      })
    }
  })

  return (
    <group ref={groupRef} onClick={onClick}>
      {/* Base island */}
      <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 0, 2, 6]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Top surface */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[2, 2, 0.2, 6]} />
        <meshStandardMaterial color="#7CFC00" />
      </mesh>

      {/* Mountain */}
      <mesh position={[0, 1, 0]} castShadow>
        <coneGeometry args={[1, 2.5, 6]} />
        <meshStandardMaterial color="#D2B48C" />
      </mesh>

      {/* Snow cap */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <coneGeometry args={[0.5, 0.6, 6]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Lake */}
      <mesh position={[0.8, 0.15, 0.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.7, 32]} />
        <meshStandardMaterial color="#4FC3F7" transparent opacity={0.8} />
      </mesh>

      {/* Trees */}
      <group ref={treesRef}>
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * Math.PI * 2
          const radius = 1.5 * Math.random() + 0.5
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          const scale = 0.1 + Math.random() * 0.15

          return (
            <group key={i} position={[x, 0.1, z]} scale={[scale, scale, scale]}>
              {/* Tree trunk */}
              <mesh castShadow>
                <cylinderGeometry args={[0.2, 0.3, 0.5, 5]} />
                <meshStandardMaterial color="#8B4513" />
              </mesh>

              {/* Tree leaves */}
              <mesh position={[0, 0.8, 0]} castShadow>
                <coneGeometry args={[0.8, 1.5, 6]} />
                <meshStandardMaterial color="#2E8B57" />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* Rocks */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 1.2 * Math.random() + 0.5
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const scale = 0.1 + Math.random() * 0.1

        return (
          <mesh key={i} position={[x, 0.1, z]} scale={[scale, scale, scale]} castShadow>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#A9A9A9" />
          </mesh>
        )
      })}

      {/* Clouds */}
      <group ref={cloudsRef}>
        {Array.from({ length: 5 }).map((_, i) => {
          const y = 2 + i * 0.2

          return (
            <mesh key={i} position={[i - 2, y, 0]} castShadow>
              <sphereGeometry args={[0.3, 8, 8]} />
              <meshStandardMaterial color="white" />
            </mesh>
          )
        })}
      </group>

      {/* Name plate */}
      <group position={[0, -0.6, 1.5]} rotation={[0, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.3, 0.05]} />
          <meshStandardMaterial color="#D2B48C" />
        </mesh>
      </group>
    </group>
  )
}

// Main component for the floating island display
interface FloatingIslandProps {
  ownerName: string
  treeId: string
  onIslandClick: () => void
}

export default function FloatingIsland({ ownerName, treeId, onIslandClick }: FloatingIslandProps) {
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
        <Island ownerName={ownerName} treeId={treeId} onClick={onIslandClick} hovered={hovered} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          minDistance={3}
          maxDistance={8}
        />
      </Canvas>

      {/* Owner info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
        <div className="text-lg font-semibold">{ownerName}</div>
        <div className="text-sm">ID: {treeId}</div>
        <button
          onClick={onIslandClick}
          className="mt-2 px-3 py-1 bg-green-600 hover:bg-green-700 rounded-md text-sm transition-colors"
        >
          {language === "vi" ? "Xem chi tiết" : "View details"}
        </button>
      </div>
    </div>
  )
}
