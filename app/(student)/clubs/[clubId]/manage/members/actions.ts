"use server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EMemberRole } from "@/generated/prisma/enums";
import { revalidatePath } from "next/cache";

async function verifyChair(userId: string, clubId: string) {
  const membership = await prisma.membership.findUnique({
    where: { userId_clubId: { userId, clubId } },
  });
  return membership?.role === EMemberRole.CHAIR;
}

export async function promoteMember(
  targetUserId: string,
  clubId: string,
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthenticated" };
  if (!(await verifyChair(session.user.id, clubId)))
    return { error: "Unauthorized" };

  try {
    await prisma.membership.update({
      where: { userId_clubId: { userId: targetUserId, clubId } },
      data: { role: EMemberRole.OFFICER },
    });
    revalidatePath(`/clubs/${clubId}/manage/members`);
    return { success: true };
  } catch {
    return { error: "Something went wrong" };
  }
}

export async function demoteMember(
  targetUserId: string,
  clubId: string,
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthenticated" };
  if (!(await verifyChair(session.user.id, clubId)))
    return { error: "Unauthorized" };

  try {
    await prisma.membership.update({
      where: { userId_clubId: { userId: targetUserId, clubId } },
      data: { role: EMemberRole.MEMBER },
    });
    revalidatePath(`/clubs/${clubId}/manage/members`);
    return { success: true };
  } catch {
    return { error: "Something went wrong" };
  }
}

export async function transferChair(
  targetUserId: string,
  clubId: string,
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthenticated" };
  const currentUserId = session.user.id;
  if (!(await verifyChair(currentUserId, clubId)))
    return { error: "Unauthorized" };

  try {
    await prisma.$transaction([
      prisma.membership.update({
        where: { userId_clubId: { userId: currentUserId, clubId } },
        data: { role: EMemberRole.OFFICER },
      }),
      prisma.membership.update({
        where: { userId_clubId: { userId: targetUserId, clubId } },
        data: { role: EMemberRole.CHAIR },
      }),
    ]);
    revalidatePath(`/clubs/${clubId}/manage/members`);
    return { success: true };
  } catch {
    return { error: "Something went wrong" };
  }
}

export async function removeMember(
  targetUserId: string,
  clubId: string,
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthenticated" };
  if (!(await verifyChair(session.user.id, clubId)))
    return { error: "Unauthorized" };

  try {
    await prisma.membership.delete({
      where: { userId_clubId: { userId: targetUserId, clubId } },
    });
    revalidatePath(`/clubs/${clubId}/manage/members`);
    revalidatePath(`/clubs/${clubId}/manage`);
    return { success: true };
  } catch {
    return { error: "Something went wrong" };
  }
}
