import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getUserMemberRole } from '@/lib/membership';
import type { SessionUser } from '@/lib/auth-types';

export async function GET(
  request: Request,
  { params }: { params: { id: string; eventId: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.eventId, clubId: params.id },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (!event.isPublic) {
      const session = await getSession(request.headers);
      const user = session?.user as SessionUser | undefined;

      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const memberRole = await getUserMemberRole(user.id, params.id);
      if (!memberRole) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    return NextResponse.json({ data: event });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; eventId: string } }
) {
  try {
    const session = await getSession(request.headers);
    const user = session?.user as SessionUser | undefined;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user.id;

    const event = await prisma.event.findUnique({
      where: { id: params.eventId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const memberRole = await getUserMemberRole(userId, params.id);
    const isPresident = memberRole === 'PRESIDENT';
    const isOrganizer = event.organizerId === userId;

    if (!isPresident && !isOrganizer) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, startsAt, isPublic } = body;

    const updatedEvent = await prisma.event.update({
      where: { id: params.eventId },
      data: {
        title,
        content,
        startsAt: startsAt ? new Date(startsAt) : undefined,
        isPublic,
      },
    });

    return NextResponse.json({ data: updatedEvent });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; eventId: string } }
) {
  try {
    const session = await getSession(request.headers);
    const user = session?.user as SessionUser | undefined;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user.id;

    const event = await prisma.event.findUnique({
      where: { id: params.eventId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const memberRole = await getUserMemberRole(userId, params.id);
    const isPresident = memberRole === 'PRESIDENT';
    const isOrganizer = event.organizerId === userId;

    if (!isPresident && !isOrganizer) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.event.delete({
      where: { id: params.eventId },
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
