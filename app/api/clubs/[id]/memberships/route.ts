import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import type { SessionUser } from '@/lib/auth-types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const members = await prisma.membership.findMany({
      where: { clubId: params.id },
      select: {
        userId: true,
        role: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ data: members });
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

    const club = await prisma.club.findUnique({ where: { id: params.id } });
    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    const existingMembership = await prisma.membership.findFirst({
      where: { userId, clubId: params.id },
    });

    if (existingMembership) {
      return NextResponse.json({ error: 'Already a member' }, { status: 409 });
    }

    const membership = await prisma.membership.create({
      data: {
        userId,
        clubId: params.id,
        role: 'MEMBER',
      },
    });

    return NextResponse.json({ data: membership }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession(request.headers);
    const user = session?.user as SessionUser | undefined;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user.id;

    const membership = await prisma.membership.findFirst({
      where: { userId, clubId: params.id },
    });

    if (!membership) {
      return NextResponse.json({ error: 'Not a member' }, { status: 404 });
    }

    if (membership.role === 'PRESIDENT') {
      return NextResponse.json({ error: 'President cannot leave the club' }, { status: 403 });
    }

    await prisma.membership.delete({
      where: {
        userId_clubId: {
          userId,
          clubId: params.id,
        },
      },
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
