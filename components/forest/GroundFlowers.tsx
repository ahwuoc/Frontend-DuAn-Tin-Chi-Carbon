"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Color, MathUtils } from "three"

interface GroundFlowersProps {
  count?: number
}

export function GroundFlowers({ count = 50 }: GroundFlowersProps) {
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
        // Random flower color - màu tươi
        const colorIndex = Math.floor(Math.random() * 8)
        const colors = [
          new Color("#FF4081"), // Hồng tươi
          new Color("#F50057"), // Hồng đậm
          new Color("#FF80AB"), // Hồng nhạt
          new Color("#40C4FF"), // Xanh nước biển nhạt
          new Color("#00B0FF"), // Xanh nước biển
          new Color("#0091EA"), // Xanh nước biển đậm
          new Color("#FFFFFF"), // Trắng
          new Color("#E1F5FE"), // Xanh nhạt
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
      // Giảm tần suất cập nhật animation
      if (Math.floor(clock.getElapsedTime() * 5) % 3 === 0) {
        const time = clock.getElapsedTime() * 0.3 // Giảm tốc độ animation
        // Chỉ cập nhật mỗi hoa thứ 3 để giảm tính toán
        for (let i = 0; i < flowerGroupRef.current.children.length; i += 3) {
          const flower = flowerGroupRef.current.children[i]
          if (flower) {
            flower.rotation.z = Math.sin(time + i * 100) * 0.03
          }
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
interface EnhancedFlowerProps {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color: Color
  secondaryColor: Color
  flowerType: number
}

// Giảm số lượng cánh hoa và tối ưu hóa hiệu suất

// Giảm số lượng cánh hoa và chi tiết
function EnhancedFlower({ position, rotation, scale, color, secondaryColor, flowerType }: EnhancedFlowerProps) {
  const stemColor = new Color("#5aad2a") // Màu xanh lá tươi cho thân cây phù hợp với ground

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Thân cây đơn giản hóa */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.8, 6]} /> {/* Giảm số đoạn từ 8 xuống 6 */}
        <meshStandardMaterial color={stemColor} />
      </mesh>

      {/* Giảm số lượng lá */}
      <mesh position={[0.1, 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.1, 0.3, 3]} /> {/* Giảm số đoạn từ 4 xuống 3 */}
        <meshStandardMaterial color="#66BB6A" side={2} /> {/* Màu xanh lá tươi */}
      </mesh>

      {flowerType === 0 && (
        // Đơn giản hóa hoa nhiệt đới với màu tươi
        <group position={[0, 0.8, 0]}>
          {/* Giảm số lượng cánh hoa */}
          {[...Array(6)].map(
            (
              _,
              i, // Giảm từ 8 xuống 6
            ) => (
              <mesh key={i} rotation={[0, (i / 6) * Math.PI * 2, 0]} position={[0.15, 0, 0]} rotation-x={Math.PI / 4}>
                <boxGeometry args={[0.4, 0.08, 0.08]} />
                <meshStandardMaterial color={color} />
              </mesh>
            ),
          )}

          {/* Tâm hoa */}
          <mesh>
            <sphereGeometry args={[0.15, 8, 8]} /> {/* Giảm độ phân giải từ 16 xuống 8 */}
            <meshStandardMaterial color="#FFEB3B" /> {/* Màu vàng tươi */}
          </mesh>

          {/* Giảm số lượng nhị hoa */}
          {[...Array(6)].map(
            (
              _,
              i, // Giảm từ 12 xuống 6
            ) => (
              <mesh key={`stamen-${i}`} position={[0, 0.1, 0]} rotation={[0, (i / 6) * Math.PI * 2, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 0.2, 3]} /> {/* Giảm số đoạn từ 4 xuống 3 */}
                <meshStandardMaterial color="#FF9800" /> {/* Màu cam tươi */}
                <mesh position={[0, 0.12, 0]}>
                  <sphereGeometry args={[0.02, 4, 4]} /> {/* Giảm độ phân giải từ 8 xuống 4 */}
                  <meshStandardMaterial color="#FFEB3B" /> {/* Màu vàng tươi */}
                </mesh>
              </mesh>
            ),
          )}
        </group>
      )}

      {flowerType === 1 && (
        // Đơn giản hóa hoa lan với màu tươi
        <group position={[0, 0.8, 0]}>
          {/* Cánh hoa chính */}
          {[...Array(3)].map((_, i) => (
            <mesh key={i} rotation={[0, (i / 3) * Math.PI * 2, 0]} position={[0.1, 0, 0]} rotation-x={Math.PI / 3}>
              <planeGeometry args={[0.25, 0.4]} />
              <meshStandardMaterial color={color} side={2} />
            </mesh>
          ))}

          {/* Tâm hoa */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.08, 6, 6]} /> {/* Giảm độ phân giải từ 8 xuống 6 */}
            <meshStandardMaterial color="#FFFFFF" /> {/* Màu trắng tươi */}
          </mesh>
        </group>
      )}

      {/* Hoa đơn giản cho các loại khác với màu tươi */}
      {flowerType > 1 && (
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.2, 6, 6]} />
          <meshStandardMaterial color={color} />
        </mesh>
      )}
    </group>
  )
}
