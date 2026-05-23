"use server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EMemberRole, ERequestStatus } from "@/generated/prisma/enums";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

async function verifyOfficer(userId: string, clubId: string) {
  const membership = await prisma.membership.findUnique({
    where: { userId_clubId: { userId, clubId } },
  });
  return (
    membership?.role === EMemberRole.OFFICER ||
    membership?.role === EMemberRole.CHAIR
  );
}

export async function approveRequest(
  requestId: string,
  applicantUserId: string,
  clubId: string,
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthenticated" };

  const isOfficer = await verifyOfficer(session.user.id, clubId);
  if (!isOfficer) return { error: "Unauthorized" };

  try {
    await prisma.$transaction([
      prisma.joinRequest.update({
        where: { id: requestId },
        data: { status: ERequestStatus.APPROVED },
      }),
      prisma.membership.create({
        data: {
          userId: applicantUserId,
          clubId,
          role: EMemberRole.MEMBER,
        },
      }),
    ]);

    revalidatePath(`/clubs/${clubId}/manage/requests`);
    revalidatePath(`/clubs/${clubId}/manage`);
    return { success: true };
  } catch {
    return { error: "Something went wrong" };
  }
}

export async function rejectRequest(
  requestId: string,
  clubId: string,
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthenticated" };

  const isOfficer = await verifyOfficer(session.user.id, clubId);
  if (!isOfficer) return { error: "Unauthorized" };

  try {
    await prisma.joinRequest.update({
      where: { id: requestId },
      data: { status: ERequestStatus.REJECTED },
    });

    revalidatePath(`/clubs/${clubId}/manage/requests`);
    revalidatePath(`/clubs/${clubId}/manage`);
    return { success: true };
  } catch {
    return { error: "Something went wrong" };
  }
}
