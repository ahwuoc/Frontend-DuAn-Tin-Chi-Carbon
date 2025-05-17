"use client"

import { useState, useEffect } from "react"
import { getContributors, getTrees, addContributor, addTree } from "@/services/forest-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trees, Users, Plus, Leaf } from "lucide-react"
import { treeNames } from "@/lib/forest-data"
import type { Contributor, TreeData } from "@/lib/types"

export default function AdminPage() {
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [trees, setTrees] = useState<TreeData[]>([])
  const [loading, setLoading] = useState(true)
  const [newContributor, setNewContributor] = useState({ name: "", trees: 1 })
  const [newTree, setNewTree] = useState({ type: 0, contributorId: "", x: 0, z: 0 })
  const [addingContributor, setAddingContributor] = useState(false)
  const [addingTree, setAddingTree] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const [contributorsData, treesData] = await Promise.all([getContributors(), getTrees()])
        setContributors(contributorsData)
        setTrees(treesData)
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleAddContributor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newContributor.name) return

    try {
      setAddingContributor(true)
      const contributor = await addContributor(newContributor.name, newContributor.trees)
      setContributors([...contributors, contributor])
      setNewContributor({ name: "", trees: 1 })
    } catch (error) {
      console.error("Failed to add contributor:", error)
    } finally {
      setAddingContributor(false)
    }
  }

  const handleAddTree = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newTree.contributorId) return

    try {
      setAddingTree(true)
      const position = { x: newTree.x, y: 0, z: newTree.z }
      const tree = await addTree(newTree.type, position, newTree.contributorId)
      setTrees([...trees, tree])
      const contributor = contributors.find((c) => c.id === newTree.contributorId)
      if (contributor) {
        const updatedContributor = { ...contributor, trees: contributor.trees + 1 }
        setContributors(contributors.map((c) => (c.id === newTree.contributorId ? updatedContributor : c)))
      }

      setNewTree({ type: 0, contributorId: newTree.contributorId, x: 0, z: 0 })
    } catch (error) {
      console.error("Failed to add tree:", error)
    } finally {
      setAddingTree(false)
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
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-2">
          <Trees className="text-emerald-600" />
          Quản lý Khu Rừng Nhiệt Đới
        </h1>
        <p className="text-gray-600 mt-2">Quản lý người đóng góp và cây trong khu rừng</p>
      </header>

      <Tabs defaultValue="contributors" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="contributors" className="flex items-center gap-1">
            <Users size={16} />
            Người đóng góp
          </TabsTrigger>
          <TabsTrigger value="trees" className="flex items-center gap-1">
            <Trees size={16} />
            Cây
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contributors">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="text-emerald-600" size={20} />
                  Thêm người đóng góp mới
                </CardTitle>
                <CardDescription>Thêm người đóng góp mới vào khu rừng</CardDescription>
              </CardHeader>
              <form onSubmit={handleAddContributor}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên người đóng góp</Label>
                    <Input
                      id="name"
                      placeholder="Nhập tên người đóng góp"
                      value={newContributor.name}
                      onChange={(e) => setNewContributor({ ...newContributor, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trees">Số cây đóng góp</Label>
                    <Input
                      id="trees"
                      type="number"
                      min="1"
                      value={newContributor.trees}
                      onChange={(e) =>
                        setNewContributor({ ...newContributor, trees: Number.parseInt(e.target.value) || 1 })
                      }
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={addingContributor}
                  >
                    {addingContributor ? (
                      <>
                        <div className="animate-spin mr-2">
                          <Users size={16} />
                        </div>
                        Đang thêm...
                      </>
                    ) : (
                      <>
                        <Plus size={16} className="mr-2" />
                        Thêm người đóng góp
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="text-emerald-600" size={20} />
                  Danh sách người đóng góp
                </CardTitle>
                <CardDescription>{contributors.length} người đóng góp</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {contributors.map((contributor) => (
                    <div
                      key={contributor.id || contributor.name}
                      className="p-3 bg-emerald-50 rounded-lg border border-emerald-100"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-emerald-800">{contributor.name}</h3>
                          <p className="text-sm text-emerald-600 flex items-center gap-1 mt-1">
                            <Trees size={14} />
                            Đã trồng {contributor.trees} cây
                          </p>
                        </div>
                        <div className="bg-emerald-100 px-2 py-1 rounded-full text-xs font-medium text-emerald-800">
                          ID: {contributor.id || `contributor-${contributors.indexOf(contributor)}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trees">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trees className="text-emerald-600" size={20} />
                  Thêm cây mới
                </CardTitle>
                <CardDescription>Thêm cây mới vào khu rừng</CardDescription>
              </CardHeader>
              <form onSubmit={handleAddTree}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tree-type">Loại cây</Label>
                    <Select
                      value={newTree.type.toString()}
                      onValueChange={(value) => setNewTree({ ...newTree, type: Number.parseInt(value) })}
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

                  <div className="space-y-2">
                    <Label htmlFor="contributor">Người đóng góp</Label>
                    <Select
                      value={newTree.contributorId}
                      onValueChange={(value) => setNewTree({ ...newTree, contributorId: value })}
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
                            {contributor.name}
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
                        value={newTree.x}
                        onChange={(e) => setNewTree({ ...newTree, x: Number.parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="z-position">Vị trí Z</Label>
                      <Input
                        id="z-position"
                        type="number"
                        value={newTree.z}
                        onChange={(e) => setNewTree({ ...newTree, z: Number.parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={addingTree || !newTree.contributorId}
                  >
                    {addingTree ? (
                      <>
                        <div className="animate-spin mr-2">
                          <Leaf size={16} />
                        </div>
                        Đang thêm...
                      </>
                    ) : (
                      <>
                        <Plus size={16} className="mr-2" />
                        Thêm cây
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trees className="text-emerald-600" size={20} />
                  Danh sách cây
                </CardTitle>
                <CardDescription>{trees.length} cây trong khu rừng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {trees.map((tree) => {
                    const contributor = contributors.find((c) => c.id === tree.contributorId)
                    return (
                      <div key={tree.id} className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-emerald-800">{treeNames[tree.type]}</h3>
                            <p className="text-sm text-emerald-600 mt-1">
                              Vị trí: ({tree.position.x.toFixed(1)}, {tree.position.z.toFixed(1)})
                            </p>
                            {contributor && (
                              <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                <Users size={12} />
                                {contributor.name}
                              </p>
                            )}
                          </div>
                          <div className="bg-emerald-100 px-2 py-1 rounded-full text-xs font-medium text-emerald-800">
                            ID: {tree.id.substring(0, 8)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
