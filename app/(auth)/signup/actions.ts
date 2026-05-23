"use server";
import { prisma } from "@/lib/prisma";

export async function setUserUniversity(
  userId: string,
  universityId: string,
): Promise<{ success?: boolean; error?: string }> {
  try {
    const university = await prisma.university.findUnique({
      where: { id: universityId },
    });
    if (!university) return { error: "University not found" };

    await prisma.user.update({
      where: { id: userId },
      data: { universityId },
    });

    return { success: true };
  } catch {
    return { error: "Failed to set university" };
  }
}
