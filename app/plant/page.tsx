"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getContributors, addTree } from "@/services/forest-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trees, ArrowLeft, Leaf, Check } from "lucide-react"
import { treeNames } from "@/lib/forest-data"
import type { Contributor } from "@/lib/types"

export default function PlantPage() {
  const router = useRouter()
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [loading, setLoading] = useState(true)
  const [planting, setPlanting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    contributorId: "",
    name: "",
    trees: 1,
    treeType: 0,
    x: Math.floor(Math.random() * 100) - 50,
    z: Math.floor(Math.random() * 100) - 50,
  })
  const [activeTab, setActiveTab] = useState("existing")

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getContributors()
        setContributors(data)
      } catch (error) {
        console.error("Failed to load contributors:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handlePlantTree = async (e: any) => {
    e.preventDefault()

    try {
      setPlanting(true)

      if (activeTab === "new") {
        // Thêm người đóng góp mới
        const response = await fetch("/api/contributors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            trees: formData.trees,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to add contributor")
        }

        const newContributor = await response.json()
        formData.contributorId = newContributor.id
      }

      // Thêm cây mới
      await addTree(formData.treeType, { x: formData.x, y: 0, z: formData.z }, formData.contributorId)

      setSuccess(true)

      // Reset form sau 3 giây
      setTimeout(() => {
        setSuccess(false)
        setFormData({
          contributorId: "",
          name: "",
          trees: 1,
          treeType: 0,
          x: Math.floor(Math.random() * 100) - 50,
          z: Math.floor(Math.random() * 100) - 50,
        })
      }, 3000)
    } catch (error) {
      console.error("Failed to plant tree:", error)
    } finally {
      setPlanting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin mr-2">
          <Trees size={24} className="text-emerald-600" />
        </div>
        <p>Đang tải dữ liệu...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <Button
        variant="ghost"
        className="mb-6 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
        onClick={() => router.push("/gop-mam-xanh")}
      >
        <ArrowLeft size={16} className="mr-2" />
        Quay lại khu rừng
      </Button>

      <Card className="border-emerald-100">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Trees size={20} />
            Trồng cây mới
          </CardTitle>
          <CardDescription className="text-emerald-50">Đóng góp cây của bạn vào khu rừng nhiệt đới</CardDescription>
        </CardHeader>

        {success ? (
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Check size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-emerald-800 mb-2">Trồng cây thành công!</h3>
              <p className="text-gray-600 mb-4">Cây của bạn đã được thêm vào khu rừng nhiệt đới.</p>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push("/gop-mam-xanh")}>
                <Trees size={16} className="mr-2" />
                Xem khu rừng
              </Button>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handlePlantTree}>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="existing">Người đóng góp hiện có</TabsTrigger>
                  <TabsTrigger value="new">Người đóng góp mới</TabsTrigger>
                </TabsList>

                <TabsContent value="existing" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contributor">Chọn người đóng góp</Label>
                    <Select
                      value={formData.contributorId}
                      onValueChange={(value) => setFormData({ ...formData, contributorId: value })}
                    >
                      <SelectTrigger id="contributor">
                        <SelectValue placeholder="Chọn người đóng góp" />
                      </SelectTrigger>
                      <SelectContent>
                        {contributors.map((contributor) => (
                          <SelectItem
                            key={contributor.id || contributor.name}
                            value={contributor.id || `contributor-${contributors.indexOf(contributor)}`}
                          >
                            {contributor.name} ({contributor.trees} cây)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="new" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên của bạn</Label>
                    <Input
                      id="name"
                      placeholder="Nhập tên của bạn"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required={activeTab === "new"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trees">Số cây đóng góp</Label>
                    <Input
                      id="trees"
                      type="number"
                      min="1"
                      value={formData.trees}
                      onChange={(e) => setFormData({ ...formData, trees: Number.parseInt(e.target.value) || 1 })}
                      required={activeTab === "new"}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-4 mt-6 pt-6 border-t border-gray-100">
                <div className="space-y-2">
                  <Label htmlFor="tree-type">Loại cây</Label>
                  <Select
                    value={formData.treeType.toString()}
                    onValueChange={(value) => setFormData({ ...formData, treeType: Number.parseInt(value) })}
                  >
                    <SelectTrigger id="tree-type">
                      <SelectValue placeholder="Chọn loại cây" />
                    </SelectTrigger>
                    <SelectContent>
                      {treeNames.map((name, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="x-position">Vị trí X</Label>
                    <Input
                      id="x-position"
                      type="number"
                      value={formData.x}
                      onChange={(e) => setFormData({ ...formData, x: Number.parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="z-position">Vị trí Z</Label>
                    <Input
                      id="z-position"
                      type="number"
                      value={formData.z}
                      onChange={(e) => setFormData({ ...formData, z: Number.parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={
                  planting ||
                  (activeTab === "existing" && !formData.contributorId) ||
                  (activeTab === "new" && !formData.name)
                }
              >
                {planting ? (
                  <>
                    <div className="animate-spin mr-2">
                      <Leaf size={16} />
                    </div>
                    Đang trồng cây...
                  </>
                ) : (
                  <>
                    <Leaf size={16} className="mr-2" />
                    Trồng cây
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
