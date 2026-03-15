import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clips = await prisma.clip.findMany({
      where: { videoId: id },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ clips });
  } catch (error) {
    console.error("Get clips error:", error);
    return NextResponse.json({ error: "Failed to get clips" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, startTime, endTime, sortOrder } = body;

    const clip = await prisma.clip.create({
      data: {
        videoId: id,
        title: title || "",
        startTime: startTime || 0,
        endTime: endTime || 0,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json(clip, { status: 201 });
  } catch (error) {
    console.error("Create clip error:", error);
    return NextResponse.json({ error: "Failed to create clip" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest
) {
  try {
    const body = await req.json();
    const { clipId, title, startTime, endTime, sortOrder } = body;

    const clip = await prisma.clip.update({
      where: { id: clipId },
      data: { title, startTime, endTime, sortOrder },
    });

    return NextResponse.json(clip);
  } catch (error) {
    console.error("Update clip error:", error);
    return NextResponse.json({ error: "Failed to update clip" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest
) {
  try {
    const { clipId } = await req.json();
    await prisma.clip.delete({ where: { id: clipId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete clip error:", error);
    return NextResponse.json({ error: "Failed to delete clip" }, { status: 500 });
  }
}
