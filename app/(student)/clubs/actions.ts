"use server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EMemberRole, ERequestStatus } from "@/generated/prisma/enums";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

export async function requestJoinClub(
  clubId: string,
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthenticated" };
  const userId = session.user.id;

  try {
    const existing = await prisma.membership.findUnique({
      where: { userId_clubId: { userId, clubId } },
    });
    if (existing) return { error: "Already a member" };

    const existingRequest = await prisma.joinRequest.findUnique({
      where: { userId_clubId: { userId, clubId } },
    });
    if (existingRequest) return { error: "Request already sent" };

    await prisma.joinRequest.create({
      data: { id: nanoid(), userId, clubId },
    });

    revalidatePath("/clubs");
    revalidatePath(`/clubs/${clubId}`);
    return { success: true };
  } catch {
    return { error: "Something went wrong" };
  }
}

export async function cancelJoinRequest(
  clubId: string,
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthenticated" };
  const userId = session.user.id;

  try {
    await prisma.joinRequest.delete({
      where: { userId_clubId: { userId, clubId } },
    });

    revalidatePath("/clubs");
    revalidatePath(`/clubs/${clubId}`);
    return { success: true };
  } catch {
    return { error: "Something went wrong" };
  }
}

export async function leaveClub(
  clubId: string,
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthenticated" };
  const userId = session.user.id;

  try {
    const membership = await prisma.membership.findUnique({
      where: { userId_clubId: { userId, clubId } },
    });
    if (!membership) return { error: "Not a member" };
    if (membership.role === EMemberRole.CHAIR)
      return { error: "Transfer chair role before leaving" };

    await prisma.membership.delete({
      where: { userId_clubId: { userId, clubId } },
    });

    revalidatePath("/clubs");
    revalidatePath("/my-clubs");
    revalidatePath("/feed");
    return { success: true };
  } catch {
    return { error: "Something went wrong" };
  }
}
