import { prisma } from "@/lib/prisma";
import { invalidateCache } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Fetch YouTube thumbnail (try maxresdefault, fallback to hqdefault)
    let imageBuffer: Buffer | null = null;
    for (const quality of ["maxresdefault", "hqdefault"]) {
      const url = `https://img.youtube.com/vi/${video.youtubeId}/${quality}.jpg`;
      const res = await fetch(url);
      if (res.ok) {
        imageBuffer = Buffer.from(await res.arrayBuffer());
        break;
      }
    }

    if (!imageBuffer) {
      return NextResponse.json(
        { error: "Failed to fetch YouTube thumbnail" },
        { status: 500 }
      );
    }

    // Target: 9:16 portrait (720x1280)
    const targetWidth = 720;
    const targetHeight = 1280;

    // Smart crop to 9:16 using attention-based strategy
    const cropped = await sharp(imageBuffer)
      .resize(targetWidth, targetHeight, {
        fit: "cover",
        position: "attention",
      })
      .toBuffer();

    // Create gradient overlay (dark at bottom for text)
    const gradientSvg = `
      <svg width="${targetWidth}" height="${targetHeight}">
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="black" stop-opacity="0" />
            <stop offset="50%" stop-color="black" stop-opacity="0" />
            <stop offset="80%" stop-color="black" stop-opacity="0.6" />
            <stop offset="100%" stop-color="black" stop-opacity="0.85" />
          </linearGradient>
        </defs>
        <rect width="${targetWidth}" height="${targetHeight}" fill="url(#grad)" />
      </svg>
    `;

    // Create title text overlay
    const titleText = video.title;
    const maxCharsPerLine = 20;
    const words = titleText.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      if ((currentLine + " " + word).trim().length > maxCharsPerLine && currentLine) {
        lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine = currentLine ? currentLine + " " + word : word;
      }
    }
    if (currentLine.trim()) lines.push(currentLine.trim());

    // Limit to 3 lines
    const displayLines = lines.slice(0, 3);
    const lineHeight = 48;
    const textStartY = targetHeight - 80 - (displayLines.length - 1) * lineHeight;

    const textElements = displayLines
      .map(
        (line, i) =>
          `<text x="${targetWidth / 2}" y="${textStartY + i * lineHeight}"
            text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
            font-size="40" font-weight="bold" fill="white"
            style="text-shadow: 0 2px 8px rgba(0,0,0,0.8)">
            ${escapeXml(line)}
          </text>`
      )
      .join("");

    // Add "NATAK TV" branding at top
    const brandingSvg = `
      <text x="${targetWidth / 2}" y="60"
        text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
        font-size="24" font-weight="bold" fill="#f97316" letter-spacing="3">
        NATAK TV
      </text>
    `;

    const textOverlaySvg = `
      <svg width="${targetWidth}" height="${targetHeight}">
        ${brandingSvg}
        ${textElements}
      </svg>
    `;

    // Composite: cropped image + gradient + text
    const finalImage = await sharp(cropped)
      .composite([
        { input: Buffer.from(gradientSvg), blend: "over" },
        { input: Buffer.from(textOverlaySvg), blend: "over" },
      ])
      .jpeg({ quality: 85 })
      .toBuffer();

    // Save to public/thumbnails
    const thumbnailDir = path.join(process.cwd(), "public", "thumbnails");
    await mkdir(thumbnailDir, { recursive: true });
    const filename = `${video.id}.jpg`;
    await writeFile(path.join(thumbnailDir, filename), finalImage);

    const generatedThumbnailUrl = `/thumbnails/${filename}`;

    // Update database
    await prisma.video.update({
      where: { id },
      data: { generatedThumbnailUrl },
    });

    await invalidateCache("videos:*");

    return NextResponse.json({
      success: true,
      generatedThumbnailUrl,
    });
  } catch (error) {
    console.error("Generate thumbnail error:", error);
    return NextResponse.json(
      { error: "Failed to generate thumbnail" },
      { status: 500 }
    );
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
