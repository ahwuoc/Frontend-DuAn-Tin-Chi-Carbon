"use client"

import { useEffect, useRef, useState } from "react"
import { useGLTF, Clone } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import type { Group } from "three"

// URL blob trực tiếp đến mô hình
const MODEL_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lowpoly_tree_game_asset-bmDuOt0hx4JuKJd6TxoffS1GOjWalW.glb"

interface LowpolyTreeProps {
  position: [number, number, number]
  scale: [number, number, number]
  onClick: () => void
  isHighlighted?: boolean
}

export function LowpolyTree({ position, scale, onClick, isHighlighted = false }: LowpolyTreeProps) {
  // Sử dụng URL blob trực tiếp
  const { scene } = useGLTF(MODEL_URL)
  const groupRef = useRef<Group>(null)
  const [randomOffset] = useState(Math.random() * 10)

  // Tạo hiệu ứng đung đưa nhẹ khi có gió
  useFrame((state) => {
    if (groupRef.current) {
      // Chỉ đung đưa phần trên của cây (thân cây vẫn đứng yên)
      const children = groupRef.current.children
      if (children.length > 0) {
        const treeModel = children[0]

        // Tìm phần tán lá của cây (thường là các phần con của mô hình)
        if (treeModel.children.length > 0) {
          // Giả sử phần tán lá là các phần con của mô hình
          treeModel.children.forEach((child, index) => {
            // Bỏ qua phần thân cây (thường là phần đầu tiên hoặc có thể xác định bằng tên)
            if (index > 0 || child.name.includes("leaves") || child.name.includes("foliage")) {
              // Tạo hiệu ứng đung đưa nhẹ
              const time = state.clock.getElapsedTime()
              const swayFactor = 0.01 // Tăng biên độ đung đưa để dễ nhìn thấy hơn
              const swaySpeed = 1.2 // Giảm tốc độ đung đưa để trông tự nhiên hơn

              // Đung đưa theo hướng x và z với offset ngẫu nhiên cho mỗi cây
              child.rotation.x = Math.sin(time * swaySpeed + randomOffset) * swayFactor
              child.rotation.z = Math.cos(time * swaySpeed + randomOffset) * swayFactor
            }
          })
        }
      }
    }
  })

  // Hiệu ứng highlight khi tìm thấy
  useEffect(() => {
    if (groupRef.current) {
      // Tìm tất cả các material trong mô hình
      groupRef.current.traverse((child: any) => {
        if (child.isMesh && child.material) {
          // Nếu là lá cây (thường có màu xanh lá)
          if (
            child.material.color &&
            child.material.color.r < 0.5 &&
            child.material.color.g > 0.5 &&
            child.material.color.b < 0.5
          ) {
            // Thay đổi màu khi highlight
            if (isHighlighted) {
              // Lưu màu gốc nếu chưa lưu
              if (!child.userData.originalColor) {
                child.userData.originalColor = child.material.color.clone()
              }
              // Đổi sang màu hồng tươi khi highlight
              child.material.color.set("#FF4081")
              child.material.emissive?.set("#FF80AB")
              child.material.emissiveIntensity = 0.3
            } else if (child.userData.originalColor) {
              // Khôi phục màu gốc
              child.material.color.copy(child.userData.originalColor)
              child.material.emissive?.set("#000000")
              child.material.emissiveIntensity = 0
            }
          }
        }
      })
    }
  }, [isHighlighted])

  return (
    <group position={position} scale={scale} onClick={onClick} ref={groupRef}>
      {/* Hiệu ứng highlight */}
      {isHighlighted && (
        <>
          {/* Vòng tròn dưới đất - màu hồng tươi */}
          <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.05, 0.06, 32]} /> {/* Giảm kích thước vòng tròn từ [0.1, 0.12] xuống [0.05, 0.06] */}
            <meshBasicMaterial color="#FF4081" transparent opacity={0.8} />
          </mesh>
          {/* Hiệu ứng hào quang */}
          <pointLight position={[0, 0.08, 0]} color="#FF4081" intensity={0.2} distance={0.3} decay={2} />{" "}
          {/* Giảm chiều cao từ 1.5 xuống 0.15 và giảm khoảng cách từ 5 xuống 0.5 */}
        </>
      )}

      {/* Mô hình cây 3D */}
      <Clone object={scene} castShadow receiveShadow />
    </group>
  )
}

// Preload model với URL blob trực tiếp
useGLTF.preload(MODEL_URL)
