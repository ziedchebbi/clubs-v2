"use server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

export async function addComment(
  annonceId: string,
  clubId: string,
  content: string,
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthenticated" };
  const userId = session.user.id;

  const trimmed = content.trim();
  if (!trimmed) return { error: "Comment cannot be empty" };
  if (trimmed.length > 1000)
    return { error: "Comment must be under 1000 characters" };

  try {
    const annonce = await prisma.annonce.findUnique({
      where: { id: annonceId },
      select: { status: true },
    });
    if (!annonce || annonce.status !== "PUBLISHED") {
      return { error: "Announcement not found" };
    }

    await prisma.commentaire.create({
      data: {
        id: nanoid(),
        content: trimmed,
        annonceId,
        authorId: userId,
      },
    });

    revalidatePath(`/clubs/${clubId}/announcements/${annonceId}`);
    return { success: true };
  } catch {
    return { error: "Something went wrong" };
  }
}
