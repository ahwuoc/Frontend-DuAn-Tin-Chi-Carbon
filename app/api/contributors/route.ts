import { NextResponse } from "next/server";
import { defaultContributors } from "@/lib/forest-data";

// Giả lập database trong memory
const contributors = [...defaultContributors];

export async function GET() {
  try {
    return NextResponse.json(contributors);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, trees } = await request.json();

    if (!name || typeof trees !== "number") {
      return NextResponse.json(
        { error: "Name and trees count are required" },
        { status: 400 }
      );
    }

    const newContributor = {
      id: `contributor-${Date.now()}`,
      name,
      trees,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    contributors.push(newContributor);

    return NextResponse.json(newContributor);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
