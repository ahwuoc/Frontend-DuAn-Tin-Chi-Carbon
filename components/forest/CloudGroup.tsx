"use client"

import { useMemo } from "react"
import { Cloud } from "@react-three/drei"

interface CloudGroupProps {
  isNight: boolean
}

export function CloudGroup({ isNight }: CloudGroupProps) {
  // Generate cloud positions
  const cloudPositions = useMemo(() => {
    const positions = []
    // Giảm số lượng đám mây từ 5 xuống 3
    for (let i = 0; i < 3; i++) {
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
  }, [])

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
          opacity={0.8}
          color={isNight ? "#B0BEC5" : "#FFFFFF"} // Màu trắng tươi cho đám mây
          segments={6} // Giảm từ 8 xuống 6
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
