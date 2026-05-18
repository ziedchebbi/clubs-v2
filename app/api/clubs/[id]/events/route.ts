import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { assertMemberRole, getUserMemberRole } from '@/lib/membership';
import type { SessionUser } from '@/lib/auth-types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url);
  let type = searchParams.get('type') || 'public';

  try {
    const session = await getSession(request.headers);
    const user = session?.user as SessionUser | undefined;
    const memberRole = user ? await getUserMemberRole(user.id, params.id) : null;

    if (type !== 'public' && !memberRole) {
      type = 'public';
    }

    const whereClause: { clubId: string; isPublic?: boolean } = {
      clubId: params.id,
    };

    if (type === 'public') {
      whereClause.isPublic = true;
    } else if (type === 'private') {
      whereClause.isPublic = false;
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: {
        startsAt: 'asc',
      },
    });

    return NextResponse.json({ data: events });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession(request.headers);
    const user = session?.user as SessionUser | undefined;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user.id;

    await assertMemberRole(userId, params.id, 'PRESIDENT');

    const body = await request.json();
    const { title, content, startsAt, isPublic = true } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        id: crypto.randomUUID(),
        title,
        content,
        startsAt: startsAt ? new Date(startsAt) : undefined,
        isPublic,
        clubId: params.id,
        organizerId: userId,
      },
    });

    return NextResponse.json({ data: event }, { status: 201 });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
