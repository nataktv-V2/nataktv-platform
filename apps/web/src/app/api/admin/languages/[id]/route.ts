import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // TODO: Add admin auth check
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, code } = body;

    if (!name || !code) {
      return NextResponse.json(
        { error: "Name and code are required" },
        { status: 400 }
      );
    }

    const language = await prisma.language.update({
      where: { id },
      data: { name, code: code.toLowerCase() },
    });

    return NextResponse.json(language);
  } catch (error: unknown) {
    console.error("Update language error:", error);
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
      { error: "Failed to update language" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // TODO: Add admin auth check
  try {
    const { id } = await params;

    // Check if any videos are attached
    const videoCount = await prisma.video.count({
      where: { languageId: id },
    });

    if (videoCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete language: ${videoCount} video(s) are still attached. Reassign them first.`,
        },
        { status: 400 }
      );
    }

    await prisma.language.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete language error:", error);
    return NextResponse.json(
      { error: "Failed to delete language" },
      { status: 500 }
    );
  }
}
