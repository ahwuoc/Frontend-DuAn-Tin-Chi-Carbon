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
import { adminLanguage } from "./language"
import { useLanguage } from "@/context/language-context"

export default function AdminPage() {
  const { language } = useLanguage()
  const lang = adminLanguage[language]
  
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
        console.error(lang.errors.loadData, error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [lang.errors.loadData])

  const handleAddContributor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newContributor.name) return

    try {
      setAddingContributor(true)
      const contributor = await addContributor(newContributor.name, newContributor.trees)
      setContributors([...contributors, contributor])
      setNewContributor({ name: "", trees: 1 })
    } catch (error) {
      console.error(lang.errors.addContributor, error)
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
      console.error(lang.errors.addTree, error)
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
        <p>{lang.loading}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-2">
          <Trees className="text-emerald-600" />
          {lang.title}
        </h1>
        <p className="text-gray-600 mt-2">{lang.subtitle}</p>
      </header>

      <Tabs defaultValue="contributors" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="contributors" className="flex items-center gap-1">
            <Users size={16} />
            {lang.contributors}
          </TabsTrigger>
          <TabsTrigger value="trees" className="flex items-center gap-1">
            <Trees size={16} />
            {lang.trees}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contributors">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="text-emerald-600" size={20} />
                  {lang.addContributor.title}
                </CardTitle>
                <CardDescription>{lang.addContributor.description}</CardDescription>
              </CardHeader>
              <form onSubmit={handleAddContributor}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{lang.addContributor.nameLabel}</Label>
                    <Input
                      id="name"
                      placeholder={lang.addContributor.namePlaceholder}
                      value={newContributor.name}
                      onChange={(e) => setNewContributor({ ...newContributor, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trees">{lang.addContributor.treesLabel}</Label>
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
                        {lang.addContributor.addingButton}
                      </>
                    ) : (
                      <>
                        <Plus size={16} className="mr-2" />
                        {lang.addContributor.submitButton}
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
                  {lang.contributorsList.title}
                </CardTitle>
                <CardDescription>{lang.contributorsList.count(contributors.length)}</CardDescription>
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
                            {lang.contributorsList.plantedTrees(contributor.trees)}
                          </p>
                        </div>
                        <div className="bg-emerald-100 px-2 py-1 rounded-full text-xs font-medium text-emerald-800">
                          {lang.contributorsList.id}: {contributor.id || `contributor-${contributors.indexOf(contributor)}`}
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
                  {lang.addTree.title}
                </CardTitle>
                <CardDescription>{lang.addTree.description}</CardDescription>
              </CardHeader>
              <form onSubmit={handleAddTree}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tree-type">{lang.addTree.typeLabel}</Label>
                    <Select
                      value={newTree.type.toString()}
                      onValueChange={(value) => setNewTree({ ...newTree, type: Number.parseInt(value) })}
                    >
                      <SelectTrigger id="tree-type">
                        <SelectValue placeholder={lang.addTree.typePlaceholder} />
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
                    <Label htmlFor="contributor">{lang.addTree.contributorLabel}</Label>
                    <Select
                      value={newTree.contributorId}
                      onValueChange={(value) => setNewTree({ ...newTree, contributorId: value })}
                    >
                      <SelectTrigger id="contributor">
                        <SelectValue placeholder={lang.addTree.contributorPlaceholder} />
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
                      <Label htmlFor="x-position">{lang.addTree.xPositionLabel}</Label>
                      <Input
                        id="x-position"
                        type="number"
                        value={newTree.x}
                        onChange={(e) => setNewTree({ ...newTree, x: Number.parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="z-position">{lang.addTree.zPositionLabel}</Label>
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
                        {lang.addTree.addingButton}
                      </>
                    ) : (
                      <>
                        <Plus size={16} className="mr-2" />
                        {lang.addTree.submitButton}
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
                  {lang.treesList.title}
                </CardTitle>
                <CardDescription>{lang.treesList.count(trees.length)}</CardDescription>
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
                              {lang.treesList.position(tree.position.x, tree.position.z)}
                            </p>
                            {contributor && (
                              <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                <Users size={12} />
                                {contributor.name}
                              </p>
                            )}
                          </div>
                          <div className="bg-emerald-100 px-2 py-1 rounded-full text-xs font-medium text-emerald-800">
                            {lang.treesList.id}: {tree.id.substring(0, 8)}
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
