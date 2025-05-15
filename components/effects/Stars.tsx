"use client"

import { useMemo } from "react"
import { Color } from "three"

interface StarsProps {
  radius?: number
  depth?: number
  count?: number
  factor?: number
  saturation?: number
  fade?: boolean
  speed?: number
}

export function Stars({
  radius = 100,
  depth = 50,
  count = 5000,
  factor = 4,
  saturation = 0,
  fade = false,
  speed = 1,
}: StarsProps) {
  // Generate stars
  const positions = useMemo(() => {
    const temp = []
    const spherical = []

    for (let i = 0; i < count; i++) {
      const theta = 2 * Math.PI * Math.random()
      const phi = Math.acos(2 * Math.random() - 1)
      const r = Math.pow(Math.random(), factor) * radius

      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)

      temp.push(x, y, z)
      spherical.push(r, theta, phi)
    }

    return { positions: new Float32Array(temp), spherical: new Float32Array(spherical) }
  }, [count, factor, radius])

  // Generate colors
  const colors = useMemo(() => {
    const temp = []
    const color = new Color()

    for (let i = 0; i < count; i++) {
      const r = 0.8 + 0.2 * Math.random()
      const g = 0.8 + 0.2 * Math.random()
      const b = 0.8 + 0.2 * Math.random()

      color.setRGB(r, g, b).offsetHSL(0, saturation, 0)

      temp.push(color.r, color.g, color.b)
    }

    return new Float32Array(temp)
  }, [count, saturation])

  // Generate sizes
  const sizes = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      temp.push(Math.random() * 2)
    }
    return new Float32Array(temp)
  }, [count])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.positions.length / 3}
          array={positions.positions}
          itemSize={3}
        />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={sizes.length} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={1}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={fade ? 0.75 : 1}
      />
    </points>
  )
}
