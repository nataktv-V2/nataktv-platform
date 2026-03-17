import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  // TODO: Add admin auth check
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { videos: true } },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("List categories error:", error);
    return NextResponse.json(
      { error: "Failed to list categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // TODO: Add admin auth check
  try {
    const body = await req.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: { name, slug },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: unknown) {
    console.error("Create category error:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A category with that name or slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
