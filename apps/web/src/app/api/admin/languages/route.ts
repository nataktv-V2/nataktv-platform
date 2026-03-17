import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  // TODO: Add admin auth check
  try {
    const languages = await prisma.language.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { videos: true } },
      },
    });

    return NextResponse.json(languages);
  } catch (error) {
    console.error("List languages error:", error);
    return NextResponse.json(
      { error: "Failed to list languages" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // TODO: Add admin auth check
  try {
    const body = await req.json();
    const { name, code } = body;

    if (!name || !code) {
      return NextResponse.json(
        { error: "Name and code are required" },
        { status: 400 }
      );
    }

    const language = await prisma.language.create({
      data: { name, code: code.toLowerCase() },
    });

    return NextResponse.json(language, { status: 201 });
  } catch (error: unknown) {
    console.error("Create language error:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A language with that name or code already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create language" },
      { status: 500 }
    );
  }
}
