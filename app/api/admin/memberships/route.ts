import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
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
  const { userId, clubId, role } = body;
  if (!userId || !clubId || !["MEMBER", "OFFICER", "CHAIR"].includes(role)) {
    return NextResponse.json(
      { success: false, error: "Invalid input" },
      { status: 400 },
    );
  }
  try {
    const membership = await prisma.membership.update({
      where: { userId_clubId: { userId, clubId } },
      data: { role },
    });
    return NextResponse.json(
      { success: true, data: membership },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update membership role",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
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
  const { userId, clubId } = body;
  if (!userId || !clubId) {
    return NextResponse.json(
      { success: false, error: "Invalid input" },
      { status: 400 },
    );
  }
  try {
    await prisma.membership.delete({
      where: { userId_clubId: { userId, clubId } },
    });
    return NextResponse.json({ success: true, data: null }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to remove membership" },
      { status: 500 },
    );
  }
}
