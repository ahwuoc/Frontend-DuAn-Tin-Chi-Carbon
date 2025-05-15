"use client"

import { Text } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useRef, useState } from "react"
import type { Contributor } from "@/lib/types"
import type { Group } from "three"

interface NameLabel3DProps {
  position: [number, number, number]
  contributor: Contributor
  isHighlighted?: boolean
}

export function NameLabel3D({ position, contributor, isHighlighted = false }: NameLabel3DProps) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const { camera } = useThree()

  // Hiệu ứng nhấp nháy nhẹ cho nhãn tên và luôn xoay theo camera
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Hiệu ứng nhấp nháy nhẹ cho nhãn tên được highlight
      if (isHighlighted) {
        const time = clock.getElapsedTime()
        groupRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1)
      } else {
        groupRef.current.scale.setScalar(1)
      }

      // Luôn quay về phía camera để đảm bảo nhãn tên luôn đọc được
      groupRef.current.quaternion.copy(camera.quaternion)
    }
  })

  // Tính toán màu sắc dựa trên số cây đóng góp
  const getContributorColor = () => {
    if (isHighlighted) return "#FF4081" // Màu hồng tươi cho người đóng góp được highlight

    // Màu dựa trên số cây đóng góp
    if (contributor.trees >= 20) return "#FFD700" // Vàng cho người đóng góp nhiều
    if (contributor.trees >= 10) return "#C0C0C0" // Bạc cho người đóng góp trung bình
    return "#CD7F32" // Đồng cho người đóng góp ít
  }

  return (
    <group
      position={position}
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Tăng kích thước chữ để dễ đọc hơn */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.5} // Tăng kích thước chữ từ 0.3 lên 0.5
        color={getContributorColor()}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02} // Thêm viền để dễ đọc hơn
        outlineColor="#000000"
      >
        {contributor.name}
      </Text>

      {/* Hiển thị số cây đóng góp bên dưới tên */}
      <Text
        position={[0, -0.3, 0]} // Đặt dưới tên
        fontSize={0.3} // Nhỏ hơn tên
        color={getContributorColor()}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01} // Viền mỏng hơn
        outlineColor="#000000"
      >
        {contributor.trees} {contributor.trees > 1 ? "cây" : "cây"}
      </Text>

      {/* Thêm hiệu ứng phát sáng khi được highlight */}
      {isHighlighted && <pointLight position={[0, 0, 0]} color="#FF4081" intensity={0.5} distance={2} decay={2} />}
    </group>
  )
}
