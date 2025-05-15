"use client"

import { useMemo, useEffect } from "react"
import { LowpolyTree } from "../trees/LowpolyTree" // Import component cây mới
import { Path } from "../trees/Path"
import { HillComponent } from "../trees/HillComponent"
import { NameLabel3D } from "../ui/NameLabel3D"
import { treeDescriptions, treeNames } from "@/lib/forest-data"
import type { Contributor, ForestElement, TreePosition } from "@/lib/types"
// Cập nhật import để sử dụng hàm isInsideMap từ Ground.tsx
import { isInsideMap } from "./Ground"

interface ForestElementsProps {
  treeCount: number
  onSelect: (element: ForestElement) => void
  contributors: Contributor[]
  showNames: boolean
  storePositions?: (positions: TreePosition[]) => void
  highlightedContributor?: string | null
}

// Thêm hàm kiểm tra vị trí cây có nằm trên đồi không
const hillPositions = [
  { position: [-15, 0, -15], scale: [10, 5, 10] },
  { position: [20, 0, -10], scale: [15, 3, 15] },
  { position: [-25, 0, 20], scale: [12, 4, 12] },
]

// Hàm kiểm tra xem một điểm có nằm trên đồi không và trả về độ cao tương ứng
const getHillHeight = (x, z) => {
  for (const hill of hillPositions) {
    const [hillX, _, hillZ] = hill.position
    const [radiusX, height, radiusZ] = hill.scale

    // Tính khoảng cách từ điểm đến tâm đồi (chuẩn hóa theo bán kính)
    const normalizedDistance = Math.sqrt(Math.pow((x - hillX) / radiusX, 2) + Math.pow((z - hillZ) / radiusZ, 2))

    // Nếu điểm nằm trong đồi (khoảng cách < 1)
    if (normalizedDistance < 1) {
      // Tính độ cao dựa trên hình dạng đồi (hình bán cầu)
      const heightFactor = Math.cos((normalizedDistance * Math.PI) / 2)
      return height * heightFactor
    }
  }
  return 0 // Không nằm trên đồi nào
}

export function ForestElements({
  treeCount = 15,
  onSelect,
  contributors = [],
  showNames = true,
  storePositions,
  highlightedContributor = null,
}: ForestElementsProps) {
  // Generate tree positions
  const treePositions = useMemo(() => {
    const positions: TreePosition[] = []
    const totalTrees = contributors.length

    // Mảng lưu trữ vị trí đã được sử dụng để kiểm tra chồng lấp
    const usedPositions: { x: number; z: number; radius: number }[] = []

    // Khoảng cách tối thiểu giữa các cây
    const minDistance = 10 // Khoảng cách tối thiểu giữa tâm các cây

    contributors.forEach((contributor, index) => {
      let validPosition = false
      let finalX = 0,
        finalZ = 0,
        hillHeight = 0
      let attempts = 0
      const maxAttempts = 30 // Tăng số lần thử để tìm vị trí phù hợp

      // Tìm vị trí hợp lệ trong bản đồ
      while (!validPosition && attempts < maxAttempts) {
        attempts++

        // Tạo vị trí ngẫu nhiên trong hình tròn
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * 60 // Giảm khoảng cách từ tâm để đảm bảo nằm trong bản đồ

        finalX = Math.cos(angle) * distance
        finalZ = Math.sin(angle) * distance

        // Xác định tỷ lệ cây dựa trên số cây đóng góp
        const treeScale = 0.8 + (contributor.trees / 20) * 0.5

        // Bán kính của cây (để kiểm tra chồng lấp)
        const treeRadius = 2 * treeScale // Ước tính bán kính dựa trên tỷ lệ cây

        // Kiểm tra xem vị trí có nằm trong bản đồ không
        if (isInsideMap(finalX, finalZ)) {
          // Kiểm tra xem cây có chồng lên cây khác không
          let overlapping = false

          for (const pos of usedPositions) {
            const dx = finalX - pos.x
            const dz = finalZ - pos.z
            const distance = Math.sqrt(dx * dx + dz * dz)

            // Nếu khoảng cách nhỏ hơn tổng bán kính của hai cây + khoảng cách tối thiểu
            if (distance < treeRadius + pos.radius + minDistance) {
              overlapping = true
              break
            }
          }

          if (!overlapping) {
            // Kiểm tra xem cây có nằm trên đồi không và điều chỉnh độ cao
            hillHeight = getHillHeight(finalX, finalZ)
            validPosition = true

            // Lưu vị trí đã sử dụng
            usedPositions.push({
              x: finalX,
              z: finalZ,
              radius: treeRadius,
            })
          }
        }
      }

      // Nếu không tìm được vị trí hợp lệ sau nhiều lần thử, đặt ở vị trí mặc định
      // và tăng góc để tránh chồng lấp
      if (!validPosition) {
        const angle = (index / totalTrees) * Math.PI * 2
        const baseRadius = 40 + (index % 3) * 10 // Phân tầng các cây theo bán kính
        finalX = Math.cos(angle) * baseRadius
        finalZ = Math.sin(angle) * baseRadius
        hillHeight = getHillHeight(finalX, finalZ)

        // Lưu vị trí đã sử dụng
        const treeScale = 0.8 + (contributor.trees / 20) * 0.5
        const treeRadius = 2 * treeScale
        usedPositions.push({
          x: finalX,
          z: finalZ,
          radius: treeRadius,
        })
      }

      // Xác định tỷ lệ cây dựa trên số cây đóng góp
      const treeScale = 0.8 + (contributor.trees / 20) * 0.5

      positions.push({
        position: [finalX, hillHeight, finalZ], // Điều chỉnh độ cao Y dựa trên đồi
        type: 3, // Luôn là cây Gù Hương (trước đây là cây gạo)
        scale: treeScale,
        contributor: contributor,
      })
    })

    return positions
  }, [contributors])

  // Store positions for search functionality
  useEffect(() => {
    if (storePositions) {
      storePositions(treePositions)
    }
  }, [treePositions, storePositions])

  // Tối ưu hóa ForestElements để giảm số lượng đối tượng

  // Giảm số lượng điểm trên đường mòn và điều chỉnh để nằm trong bản đồ mới
  const pathPoints = useMemo(() => {
    const points = []
    for (let i = 0; i < 6; i++) {
      // Giảm từ 10 xuống 6
      const angle = (i / 6) * Math.PI * 2
      const radius = 15 + Math.sin(i * 0.5) * 5

      // Đảm bảo đường mòn nằm trong bản đồ
      if (radius < 65) {
        points.push([Math.cos(angle) * radius, -0.4, Math.sin(angle) * radius])
      }
    }
    return points
  }, [])

  // Generate lake elements
  const lakeCenter = [10, -0.49, 10]
  // Giảm số lượng phần tử hồ nước
  const lakeElements = useMemo(() => {
    const elements = []

    // Main lake body
    elements.push({
      position: [lakeCenter[0], lakeCenter[1], lakeCenter[2]],
      radius: 7,
      color: "#40C4FF", // Màu xanh nước biển tươi cho hồ
    })

    // Lake edges - giảm số lượng
    const edgeCount = 8 // Giảm từ 12 xuống 8
    for (let i = 0; i < edgeCount; i++) {
      const angle = (i / edgeCount) * Math.PI * 2
      const distance = 5 + Math.random() * 3
      const x = lakeCenter[0] + Math.cos(angle) * distance
      const z = lakeCenter[2] + Math.sin(angle) * distance
      const radius = 1.5 + Math.random() * 3

      elements.push({
        position: [x, lakeCenter[1], z],
        radius: radius,
        color: "#80D8FF", // Màu xanh nước biển nhạt hơn cho viền hồ
      })
    }

    // Inner circles - giảm số lượng
    for (let i = 0; i < 3; i++) {
      // Giảm từ 5 xuống 3
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * 4
      const x = lakeCenter[0] + Math.cos(angle) * distance
      const z = lakeCenter[2] + Math.sin(angle) * distance

      elements.push({
        position: [x, lakeCenter[1] - 0.01, z],
        radius: 1 + Math.random() * 2,
        color: "#0091EA", // Màu xanh nước biển đậm hơn cho phần sâu của hồ
      })
    }

    return elements
  }, [])

  // Handle element selection
  const handleTreeClick = (position, treeType, contributor) => {
    onSelect({
      type: treeNames[treeType],
      position,
      description: treeDescriptions[treeType],
      contributor: contributor,
    })
  }

  const handleWaterClick = (position) => {
    onSelect({
      type: "Hồ Tự Nhiên",
      position,
      description: "Hồ nước ngọt hỗ trợ đa dạng sinh vật thủy sinh và cung cấp nước cho hệ sinh thái rừng.",
    })
  }

  const handlePathClick = (position) => {
    onSelect({
      type: "Đường Mòn",
      position,
      description: "Đường mòn tự nhiên được hình thành bởi sự di chuyển của động vật và con người qua khu rừng.",
    })
  }

  // Điều chỉnh vị trí hiển thị tên để không bị che khuất bởi tán cây
  // Hàm xác định chiều cao của từng loại cây để đặt tên ở đỉnh
  const getTreeHeight = (treeType) => {
    switch (treeType) {
      case 0:
        return 12 // Conifer - tăng từ 11 lên 12
      case 1:
        return 13 // Palm - tăng từ 12 lên 13
      case 2:
        return 8 // Banana - tăng từ 7 lên 8
      case 3:
        return 0.03 // LowpolyTree - điều chỉnh chiều cao phù hợp với mô hình mới (3/100)
      case 4:
        return 9 // Bamboo - tăng từ 8 lên 9
      default:
        return 12 // Ficus - tăng từ 10 lên 12
    }
  }

  return (
    <>
      {/* Trees */}
      {treePositions.map((tree, index) => {
        // Check if this tree belongs to the highlighted contributor
        const isHighlighted = highlightedContributor && tree.contributor.name === highlightedContributor

        // Điều chỉnh vị trí Y để đảm bảo cây mọc trên đồi, không phải trong đồi
        const treeY = tree.position[1] + 0.01 // Thêm một offset nhỏ để đảm bảo cây mọc trên đồi

        return (
          <group key={index} position={[tree.position[0], treeY, tree.position[2]]}>
            {/* Sử dụng mô hình cây 3D mới thay vì KapokTree */}
            <LowpolyTree
              position={[0, 0, 0]}
              scale={[tree.scale / 100, tree.scale / 100, tree.scale / 100]}
              onClick={() => handleTreeClick(tree.position, 3, tree.contributor)}
              isHighlighted={isHighlighted}
            />

            {/* Add name label as 3D text - always at the top of each tree */}
            {tree.contributor && showNames && (
              <NameLabel3D
                position={[0, 12.0, 0]} // Giữ vị trí Y = 12.0
                contributor={tree.contributor}
                isHighlighted={isHighlighted}
              />
            )}
          </group>
        )
      })}

      {/* Paths */}
      {pathPoints.map((point, index) => (
        <Path key={index} position={point} onClick={() => handlePathClick(point)} />
      ))}

      {/* Lake */}
      <group>
        {/* Lake elements */}
        {lakeElements.map((element, index) => (
          <mesh
            key={`lake-${index}`}
            position={element.position}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
            onClick={() => handleWaterClick(element.position)}
          >
            <circleGeometry args={[element.radius, 16]} />
            <meshStandardMaterial
              color={element.color}
              roughness={0.3}
              metalness={0.2}
              transparent={true}
              opacity={0.9}
            />
          </mesh>
        ))}

        {/* Water plants */}
        {[...Array(5)].map((_, i) => {
          // Giảm từ 8 xuống 5
          const angle = (i / 5) * Math.PI * 2
          const radiusVariation = 0.7 + Math.random() * 0.3
          const baseRadius = 7 * radiusVariation
          const x = lakeCenter[0] + Math.cos(angle) * baseRadius
          const z = lakeCenter[2] + Math.sin(angle) * baseRadius

          return (
            <mesh key={`plant-${i}`} position={[x, -0.3, z]} rotation={[0, Math.random() * Math.PI, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.4, 6]} />
              <meshStandardMaterial color="#4CAF50" /> {/* Màu xanh lá tươi */}
              <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.5, 0.5]} />
                <meshStandardMaterial color="#66BB6A" side={2} /> {/* Màu xanh lá tươi */}
              </mesh>
            </mesh>
          )
        })}

        {/* Rocks */}
        {[...Array(4)].map((_, i) => {
          // Giảm từ 6 xuống 4
          const angle = (i / 4) * Math.PI * 2
          const distance = 7 + Math.random() * 2
          const x = lakeCenter[0] + Math.cos(angle) * distance
          const z = lakeCenter[2] + Math.sin(angle) * distance
          const scale = 0.3 + Math.random() * 0.4

          return (
            <mesh
              key={`rock-${i}`}
              position={[x, -0.3 + scale / 2, z]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
              scale={[scale, scale, scale]}
            >
              <dodecahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#9E9E9E" roughness={0.7} /> {/* Màu xám tươi */}
            </mesh>
          )
        })}
      </group>

      {/* Hills */}
      <HillComponent position={[-15, 0, -15]} scale={[10, 5, 10]} />
      <HillComponent position={[20, 0, -10]} scale={[15, 3, 15]} />
      <HillComponent position={[-25, 0, 20]} scale={[12, 4, 12]} />

      {/* Thêm hoa tươi ngẫu nhiên trên mặt đất */}
      {[...Array(30)].map((_, i) => {
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * 60 // Giảm khoảng cách từ tâm để đảm bảo nằm trong bản đồ mới
        const x = Math.cos(angle) * distance
        const z = Math.sin(angle) * distance

        // Kiểm tra xem vị trí có nằm trong bản đồ không
        if (!isInsideMap(x, z)) return null

        // Kiểm tra khoảng cách từ trung tâm để tránh đặt hoa ở khu vực hồ
        const distanceFromLake = Math.sqrt(Math.pow(x - lakeCenter[0], 2) + Math.pow(z - lakeCenter[2], 2))
        if (distanceFromLake < 10) return null // Bỏ qua nếu quá gần hồ

        // Lấy độ cao của đồi (nếu có)
        const hillHeight = getHillHeight(x, z)

        // Chọn màu tươi ngẫu nhiên cho hoa
        const flowerColors = [
          "#FF4081", // Hồng tươi
          "#F50057", // Hồng đậm
          "#FF80AB", // Hồng nhạt
          "#40C4FF", // Xanh nước biển nhạt
          "#00B0FF", // Xanh nước biển
          "#0091EA", // Xanh nước biển đậm
        ]
        const color = flowerColors[Math.floor(Math.random() * flowerColors.length)]

        return (
          <group key={`flower-ground-${i}`} position={[x, hillHeight + 0.01, z]}>
            {/* Thân hoa */}
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
              <meshStandardMaterial color="#4CAF50" />
            </mesh>

            {/* Hoa */}
            <mesh position={[0, 0.3, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color={color} roughness={0.5} emissive={color} emissiveIntensity={0.2} />
            </mesh>
          </group>
        )
      })}
    </>
  )
}
