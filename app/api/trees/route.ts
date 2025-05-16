import { NextResponse } from "next/server";

interface Position {
  x: number;
  y: number;
  z: number;
}

interface Tree {
  id: string;
  type: number;
  position: Position;
  scale: number;
  contributorId: string;
  createdAt: string;
  updatedAt: string;
}

let trees: Tree[] = [];

export async function GET() {
  try {
    return NextResponse.json(trees);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { type, position, contributorId } = await request.json();

    if (
      typeof type !== "number" ||
      !position ||
      typeof position.x !== "number" ||
      typeof position.y !== "number" ||
      typeof position.z !== "number" ||
      !contributorId
    ) {
      return NextResponse.json(
        { error: "Type, position, and contributorId are required" },
        { status: 400 }
      );
    }

    const newTree: Tree = {
      id: `tree-${Date.now()}`,
      type,
      position,
      scale: 0.8 + Math.random() * 0.5,
      contributorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    trees.push(newTree);

    return NextResponse.json(newTree);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
