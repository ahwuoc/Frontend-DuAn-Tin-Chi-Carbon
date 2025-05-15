import { NextResponse } from "next/server"

// Giả lập database trong memory
const trees = []

export async function GET() {
  try {
    return NextResponse.json(trees)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { type, position, contributorId } = await request.json()

    if (
      typeof type !== "number" ||
      !position ||
      typeof position.x !== "number" ||
      typeof position.y !== "number" ||
      typeof position.z !== "number" ||
      !contributorId
    ) {
      return NextResponse.json({ error: "Type, position, and contributorId are required" }, { status: 400 })
    }

    const newTree = {
      id: `tree-${Date.now()}`,
      type,
      position,
      scale: 0.8 + Math.random() * 0.5,
      contributorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    trees.push(newTree)

    return NextResponse.json(newTree)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
