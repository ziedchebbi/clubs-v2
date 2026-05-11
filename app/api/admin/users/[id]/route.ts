import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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
  const { role } = body;
  if (!id || !role || !["ADMIN", "USER"].includes(role)) {
    return NextResponse.json(
      { success: false, error: "Invalid input" },
      { status: 400 },
    );
  }
  try {
    const user = await prisma.user.update({ where: { id }, data: { role } });
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update user role" },
      { status: 500 },
    );
  }
}

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
      { success: false, error: "User ID required" },
      { status: 400 },
    );
  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true, data: null }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete user" },
      { status: 500 },
    );
  }
}
