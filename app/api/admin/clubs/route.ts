import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  if (session.user.role !== "ADMIN")
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 },
    );

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }
  const { name, bio, universityId } = body;
  if (!name)
    return NextResponse.json(
      { success: false, error: "Name is required" },
      { status: 400 },
    );

  try {
    const club = await prisma.club.create({
      data: {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : require("nanoid").nanoid(),
        name,
        bio,
        universityId,
      },
    });
    return NextResponse.json({ success: true, data: club }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create club" },
      { status: 500 },
    );
  }
}
