import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: _req.headers });
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

  if (!id)
    return NextResponse.json(
      { success: false, error: "Club ID required" },
      { status: 400 },
    );

  try {
    await prisma.club.delete({ where: { id } });
    return NextResponse.json({ success: true, data: null }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete club" },
      { status: 500 },
    );
  }
}
