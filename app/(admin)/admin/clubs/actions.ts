"use server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EUserRole, EMemberRole } from "@/generated/prisma/enums";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";

async function verifyAdmin(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, universityId: true },
  });
  if (!user || user.role !== EUserRole.ADMIN || !user.universityId) return null;
  return user.universityId;
}

export async function createClub(
  universityId: string,
  input: { name: string; bio: string | null },
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthenticated" };

  const adminUniversityId = await verifyAdmin(session.user.id);
  if (!adminUniversityId || adminUniversityId !== universityId)
    return { error: "Unauthorized" };

  try {
    await prisma.club.create({
      data: {
        id: nanoid(),
        name: input.name,
        bio: input.bio,
        universityId,
      },
    });

    revalidatePath("/admin/clubs");
    revalidatePath("/admin");
  } catch {
    return { error: "Something went wrong" };
  }
  redirect("/admin/clubs");
}

export async function updateClub(
  clubId: string,
  input: { name: string; bio: string | null },
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthenticated" };

  const adminUniversityId = await verifyAdmin(session.user.id);
  if (!adminUniversityId) return { error: "Unauthorized" };

  const club = await prisma.club.findUnique({
    where: { id: clubId },
    select: { universityId: true },
  });
  if (club?.universityId !== adminUniversityId)
    return { error: "Unauthorized" };

  try {
    await prisma.club.update({
      where: { id: clubId },
      data: { name: input.name, bio: input.bio },
    });

    revalidatePath("/admin/clubs");
    revalidatePath(`/admin/clubs/${clubId}`);
    return { success: true };
  } catch {
    return { error: "Something went wrong" };
  }
}

export async function deleteClub(
  clubId: string,
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthenticated" };

  const adminUniversityId = await verifyAdmin(session.user.id);
  if (!adminUniversityId) return { error: "Unauthorized" };

  const club = await prisma.club.findUnique({
    where: { id: clubId },
    select: { universityId: true },
  });
  if (club?.universityId !== adminUniversityId)
    return { error: "Unauthorized" };

  try {
    await prisma.club.delete({ where: { id: clubId } });
    revalidatePath("/admin/clubs");
    revalidatePath("/admin");
  } catch {
    return { error: "Something went wrong" };
  }
  redirect("/admin/clubs");
}

export async function assignChair(
  clubId: string,
  targetUserId: string,
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthenticated" };

  const adminUniversityId = await verifyAdmin(session.user.id);
  if (!adminUniversityId) return { error: "Unauthorized" };

  const club = await prisma.club.findUnique({
    where: { id: clubId },
    select: { universityId: true },
  });
  if (club?.universityId !== adminUniversityId)
    return { error: "Unauthorized" };

  // Check no chair exists yet
  const existingChair = await prisma.membership.findFirst({
    where: { clubId, role: EMemberRole.CHAIR },
  });
  if (existingChair) return { error: "This club already has a chair" };

  try {
    const existingMembership = await prisma.membership.findUnique({
      where: { userId_clubId: { userId: targetUserId, clubId } },
    });

    if (existingMembership) {
      await prisma.membership.update({
        where: { userId_clubId: { userId: targetUserId, clubId } },
        data: { role: EMemberRole.CHAIR },
      });
    } else {
      await prisma.membership.create({
        data: {
          userId: targetUserId,
          clubId,
          role: EMemberRole.CHAIR,
        },
      });
    }

    // Also resolve any pending join request
    await prisma.joinRequest.updateMany({
      where: { userId: targetUserId, clubId, status: "PENDING" },
      data: { status: "APPROVED" },
    });

    revalidatePath(`/admin/clubs/${clubId}`);
    revalidatePath("/admin/clubs");
    return { success: true };
  } catch {
    return { error: "Something went wrong" };
  }
}
