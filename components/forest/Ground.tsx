"use client"

import { useMemo } from "react"
import { Shape } from "three"

// Cập nhật hàm isInsideMap để xuất ra ngoài
export function isInsideMap(x: number, z: number): boolean {
  // Tính khoảng cách từ tâm
  const distanceFromCenter = Math.sqrt(x * x + z * z)

  // Bán kính cơ bản của bản đồ
  const baseRadius = 70

  // Thêm một chút ngẫu nhiên để tạo hình dạng không đều
  const angle = Math.atan2(z, x)
  const radiusVariation = Math.sin(angle * 5) * 10 // Tạo sự biến đổi theo góc

  // Điểm nằm trong bản đồ nếu khoảng cách từ tâm nhỏ hơn bán kính + biến đổi
  return distanceFromCenter < baseRadius + radiusVariation
}

export function Ground() {
  // Tạo hình dạng tự nhiên cho mặt đất thay vì hình vuông
  const groundShape = useMemo(() => {
    // Tạo hình dạng tự nhiên với các đường cong
    const shape = new Shape()

    // Bán kính cơ bản của bản đồ
    const baseRadius = 75

    // Số điểm để tạo hình dạng tự nhiên
    const points = 24

    // Tạo điểm đầu tiên
    const startAngle = Math.random() * Math.PI * 2
    const startRadius = baseRadius + (Math.random() * 15 - 7.5)
    shape.moveTo(Math.cos(startAngle) * startRadius, Math.sin(startAngle) * startRadius)

    // Tạo các điểm tiếp theo với bán kính ngẫu nhiên để tạo hình dạng tự nhiên
    for (let i = 1; i <= points; i++) {
      const angle = startAngle + (i / points) * Math.PI * 2
      const radius = baseRadius + (Math.random() * 30 - 15) // Dao động bán kính để tạo hình dạng tự nhiên

      // Sử dụng đường cong bezier để tạo viền tự nhiên hơn
      const prevAngle = startAngle + ((i - 1) / points) * Math.PI * 2
      const prevRadius = i === 1 ? startRadius : baseRadius + (Math.random() * 30 - 15)

      const cp1x = Math.cos(prevAngle + 0.1) * (prevRadius * 0.9)
      const cp1y = Math.sin(prevAngle + 0.1) * (prevRadius * 0.9)

      const cp2x = Math.cos(angle - 0.1) * (radius * 0.9)
      const cp2y = Math.sin(angle - 0.1) * (radius * 0.9)

      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius

      shape.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
    }

    shape.closePath()
    return shape
  }, [])

  // Memoize terrain variations to prevent re-creation on each render
  const terrainVariations = useMemo(() => {
    const elevations = []
    const depressions = []

    // Giảm số lượng độ cao
    for (let i = 0; i < 10; i++) {
      // Giảm từ 15 xuống 10
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * 60 // Giảm khoảng cách từ tâm để đảm bảo nằm trong bản đồ mới
      const x = Math.cos(angle) * distance
      const z = Math.sin(angle) * distance
      const radius = 3 + Math.random() * 8
      const height = 0.2 + Math.random() * 0.8

      elevations.push({
        position: [x, -0.5 + height / 2, z],
        radius,
        color: Math.random() > 0.7 ? "#7ab62b" : "#62bc2f", // Màu xanh cỏ tươi
      })
    }

    // Giảm số lượng độ trũng
    for (let i = 0; i < 5; i++) {
      // Giảm từ 8 xuống 5
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * 60 // Giảm khoảng cách từ tâm
      const x = Math.cos(angle) * distance
      const z = Math.sin(angle) * distance
      const radius = 2 + Math.random() * 5
      const depth = 0.1 + Math.random() * 0.3

      depressions.push({
        position: [x, -0.5 - depth / 2, z],
        radius,
      })
    }

    return { elevations, depressions }
  }, [])

  // Tạo các mỏm đá bao quanh viền bản đồ
  const borderRocks = useMemo(() => {
    const rocks = []
    const rockCount = 120 // Số lượng mỏm đá bao quanh

    for (let i = 0; i < rockCount; i++) {
      const angle = (i / rockCount) * Math.PI * 2

      // Bán kính cơ bản của bản đồ + một chút ngẫu nhiên
      const baseRadius = 75 + (Math.random() * 10 - 5)

      // Vị trí của mỏm đá
      const x = Math.cos(angle) * baseRadius
      const z = Math.sin(angle) * baseRadius

      // Kích thước và hình dạng ngẫu nhiên cho mỏm đá
      const scaleX = 1 + Math.random() * 2
      const scaleY = 1 + Math.random() * 3
      const scaleZ = 1 + Math.random() * 2

      // Góc nghiêng ngẫu nhiên cho mỏm đá
      const rotationX = Math.random() * 0.5
      const rotationY = Math.random() * Math.PI * 2
      const rotationZ = Math.random() * 0.5

      // Màu sắc ngẫu nhiên cho mỏm đá
      const colorIndex = Math.floor(Math.random() * 3)
      const colors = ["#9E9E9E", "#A1887F", "#757575"] // Các màu xám và nâu cho đá

      rocks.push({
        position: [x, -0.5 + scaleY / 2 - 0.5, z],
        scale: [scaleX, scaleY, scaleZ],
        rotation: [rotationX, rotationY, rotationZ],
        color: colors[colorIndex],
      })
    }

    return rocks
  }, [])

  return (
    <group>
      {/* Base ground plane with natural shape */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <shapeGeometry args={[groundShape]} />
        <meshStandardMaterial color="#62bc2f" roughness={0.7} metalness={0.1} wireframe={false} />
      </mesh>

      {/* Elevations */}
      {terrainVariations.elevations.map((elevation, i) => (
        <mesh key={`elevation-${i}`} position={elevation.position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[elevation.radius, 6]} />
          <meshStandardMaterial color={elevation.color} roughness={0.7} metalness={0.1} />
        </mesh>
      ))}

      {/* Depressions */}
      {terrainVariations.depressions.map((depression, i) => (
        <mesh key={`depression-${i}`} position={depression.position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[depression.radius, 6]} />
          <meshStandardMaterial color={"#5aad2a"} roughness={0.7} metalness={0.1} />
        </mesh>
      ))}

      {/* Border rocks */}
      {borderRocks.map((rock, i) => (
        <mesh
          key={`rock-${i}`}
          position={rock.position}
          rotation={rock.rotation}
          scale={rock.scale}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={rock.color} roughness={0.9} metalness={0.1} />
        </mesh>
      ))}

      {/* Thêm một số tảng đá lớn hơn ở một số vị trí ngẫu nhiên dọc theo viền */}
      {[...Array(15)].map((_, i) => {
        const angle = Math.random() * Math.PI * 2
        const radius = 75 + (Math.random() * 5 - 2.5)
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const scale = 2 + Math.random() * 3

        return (
          <group key={`large-rock-${i}`} position={[x, -0.5, z]}>
            <mesh
              position={[0, scale / 2 - 0.5, 0]}
              rotation={[Math.random() * 0.5, Math.random() * Math.PI * 2, Math.random() * 0.5]}
              scale={[scale, scale * 1.2, scale]}
              castShadow
              receiveShadow
            >
              <dodecahedronGeometry args={[1, 2]} />
              <meshStandardMaterial color="#757575" roughness={0.9} metalness={0.2} />
            </mesh>

            {/* Thêm một số đá nhỏ xung quanh tảng đá lớn */}
            {[...Array(3)].map((_, j) => {
              const smallRockAngle = Math.random() * Math.PI * 2
              const smallRockDist = 1 + Math.random() * 2
              const smallRockX = Math.cos(smallRockAngle) * smallRockDist
              const smallRockZ = Math.sin(smallRockAngle) * smallRockDist
              const smallRockScale = 0.5 + Math.random() * 1

              return (
                <mesh
                  key={`small-rock-${i}-${j}`}
                  position={[smallRockX, smallRockScale / 2 - 0.5, smallRockZ]}
                  rotation={[Math.random() * 0.5, Math.random() * Math.PI * 2, Math.random() * 0.5]}
                  scale={[smallRockScale, smallRockScale, smallRockScale]}
                  castShadow
                  receiveShadow
                >
                  <dodecahedronGeometry args={[1, 1]} />
                  <meshStandardMaterial color="#9E9E9E" roughness={0.9} metalness={0.1} />
                </mesh>
              )
            })}
          </group>
        )
      })}
    </group>
  )
}
