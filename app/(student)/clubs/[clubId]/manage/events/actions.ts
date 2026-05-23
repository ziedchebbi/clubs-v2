"use server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EMemberRole } from "@/generated/prisma/enums";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";

type CreateEventInput = {
  title: string;
  content: string | null;
  startsAt: string | null;
  isPublic: boolean;
};

export async function createEvent(
  clubId: string,
  input: CreateEventInput,
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
    await prisma.event.create({
      data: {
        id: nanoid(),
        title: input.title,
        content: input.content,
        startsAt: input.startsAt ? new Date(input.startsAt) : null,
        isPublic: input.isPublic,
        clubId,
        organizerId: userId,
      },
    });

    revalidatePath(`/clubs/${clubId}/manage/events`);
    revalidatePath(`/clubs/${clubId}`);
    revalidatePath("/feed");
  } catch {
    return { error: "Something went wrong" };
  }
  redirect(`/clubs/${clubId}/manage/events`);
}
