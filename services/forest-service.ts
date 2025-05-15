import { defaultContributors } from "@/lib/forest-data"
import type { Contributor, TreeData } from "@/lib/types"

// Hiện tại sử dụng dữ liệu tĩnh, sau này sẽ kết nối với database
export async function getContributors(): Promise<Contributor[]> {
  // Giả lập API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(defaultContributors)
    }, 500)
  })
}

// Trong tương lai, khi tích hợp database
export async function addContributor(name: string, trees: number): Promise<Contributor> {
  // Giả lập API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newContributor = {
        id: `contributor-${Date.now()}`,
        name,
        trees,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      resolve(newContributor)
    }, 500)
  })
}

export async function updateContributor(id: string, data: Partial<Contributor>): Promise<Contributor> {
  // Giả lập API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const contributor = defaultContributors.find((c) => c.id === id) || { id, name: "Unknown", trees: 0 }
      const updatedContributor = {
        ...contributor,
        ...data,
        updatedAt: new Date().toISOString(),
      }
      resolve(updatedContributor)
    }, 500)
  })
}

export async function getTrees(): Promise<TreeData[]> {
  // Giả lập API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Tạo dữ liệu mẫu
      const trees: TreeData[] = []
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * 120 - 60
        const z = Math.random() * 120 - 60
        const contributorIndex = i % defaultContributors.length

        trees.push({
          id: `tree-${i}`,
          type: Math.floor(Math.random() * 5),
          position: { x, y: 0, z },
          scale: 0.8 + Math.random() * 0.5,
          contributorId: `contributor-${contributorIndex}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }
      resolve(trees)
    }, 500)
  })
}

export async function addTree(
  type: number,
  position: { x: number; y: number; z: number },
  contributorId: string,
): Promise<TreeData> {
  // Giả lập API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTree = {
        id: `tree-${Date.now()}`,
        type,
        position,
        scale: 0.8 + Math.random() * 0.5,
        contributorId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      resolve(newTree)
    }, 500)
  })
}
