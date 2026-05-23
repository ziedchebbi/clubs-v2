"use server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EMemberRole, EAnnonceStatus } from "@/generated/prisma/enums";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";

type CreateAnnonceInput = {
  content: string;
  isDraft: boolean;
};

export async function createAnnonce(
  clubId: string,
  input: CreateAnnonceInput,
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthenticated" };
  const userId = session.user.id;

  const membership = await prisma.membership.findUnique({
    where: { userId_clubId: { userId, clubId } },
  });

  if (
    !membership ||
    (membership.role !== EMemberRole.OFFICER &&
      membership.role !== EMemberRole.CHAIR)
  ) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.annonce.create({
      data: {
        id: nanoid(),
        content: input.content,
        status: input.isDraft ? EAnnonceStatus.DRAFT : EAnnonceStatus.PUBLISHED,
        clubId,
        authorId: userId,
      },
    });

    revalidatePath(`/clubs/${clubId}/manage/announcements`);
    revalidatePath(`/clubs/${clubId}`);
    revalidatePath("/feed");
  } catch {
    return { error: "Something went wrong" };
  }
  redirect(`/clubs/${clubId}/manage/announcements`);
}
