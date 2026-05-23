"use server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

export async function joinEvent(
  eventId: string,
  clubId: string,
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthenticated" };
  const userId = session.user.id;

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { isPublic: true, clubId: true },
    });
    if (!event) return { error: "Event not found" };

    if (!event.isPublic && event.clubId) {
      const membership = await prisma.membership.findUnique({
        where: { userId_clubId: { userId, clubId: event.clubId } },
      });
      if (!membership)
        return { error: "You must be a club member to join this event" };
    }

    const existing = await prisma.eventAttendee.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (existing) return { error: "Already joined" };

    await prisma.eventAttendee.create({
      data: { userId, eventId },
    });

    revalidatePath(`/clubs/${clubId}/events/${eventId}`);
    return { success: true };
  } catch {
    return { error: "Something went wrong" };
  }
}

export async function leaveEvent(
  eventId: string,
  clubId: string,
): Promise<{ success?: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthenticated" };
  const userId = session.user.id;

  try {
    const existing = await prisma.eventAttendee.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (!existing) return { error: "Not attending" };

    await prisma.eventAttendee.delete({
      where: { userId_eventId: { userId, eventId } },
    });

    revalidatePath(`/clubs/${clubId}/events/${eventId}`);
    return { success: true };
  } catch {
    return { error: "Something went wrong" };
  }
}

export async function addEventComment(
  eventId: string,
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
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true },
    });
    if (!event) return { error: "Event not found" };

    await prisma.commentaire.create({
      data: {
        id: nanoid(),
        content: trimmed,
        eventId,
        authorId: userId,
      },
    });

    revalidatePath(`/clubs/${clubId}/events/${eventId}`);
    return { success: true };
  } catch {
    return { error: "Something went wrong" };
  }
}
