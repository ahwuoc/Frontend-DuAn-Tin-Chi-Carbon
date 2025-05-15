"use client"

interface HillComponentProps {
  position: [number, number, number]
  scale: [number, number, number]
}

export function HillComponent({ position, scale }: HillComponentProps) {
  return (
    <mesh position={position} scale={scale} receiveShadow>
      <sphereGeometry args={[1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#8AE878" roughness={0.7} /> {/* Màu xanh cỏ tươi cho đồi */}
    </mesh>
  )
}
