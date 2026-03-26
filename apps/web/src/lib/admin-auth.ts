import { NextRequest, NextResponse } from "next/server";
import { prisma } from "./prisma";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * Verify the request comes from an admin user.
 * Returns the user if admin, or a 401 response if not.
 */
export async function requireAdmin(
  req: NextRequest
): Promise<{ user: { id: string; email: string } } | NextResponse> {
  const uid = req.headers.get("x-firebase-uid");
  if (!uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { firebaseUid: uid },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const isAdmin =
    user.role === "ADMIN" ||
    ADMIN_EMAILS.includes(user.email.toLowerCase());

  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return { user };
}
