"use client"

interface PathProps {
  position: [number, number, number]
  onClick: () => void
}

export function Path({ position, onClick }: PathProps) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={onClick}>
      <circleGeometry args={[1, 16]} />
      <meshStandardMaterial color="#D7CCC8" roughness={0.7} metalness={0.1} /> {/* Màu be cho đường mòn */}
    </mesh>
  )
}
