import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { assertMemberRole, getUserMemberRole } from '@/lib/membership';
import type { SessionUser } from '@/lib/auth-types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const club = await prisma.club.findUnique({
      where: { id: params.id },
      include: {
        university: true,
        memberships: {
          select: {
            userId: true,
            role: true,
            createdAt: true,
          },
        },
        events: true,
      },
    });

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    return NextResponse.json({ data: club });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession(request.headers);
    const user = session?.user as SessionUser | undefined;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user.id;

    await assertMemberRole(userId, params.id, 'PRESIDENT');

    const body = await request.json();
    const { name, bio } = body;

    const updatedClub = await prisma.club.update({
      where: { id: params.id },
      data: {
        name,
        bio,
      },
    });

    return NextResponse.json({ data: updatedClub });
  } catch (error) {
    if (error instanceof NextResponse) return error;
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
    const memberRole = await getUserMemberRole(userId, params.id);

    const isPresident = memberRole === 'PRESIDENT';
    const isAdmin = user.role === 'ADMIN';

    if (!isPresident && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.$transaction([
      prisma.membership.deleteMany({ where: { clubId: params.id } }),
      prisma.event.deleteMany({ where: { clubId: params.id } }),
      prisma.annonce.deleteMany({ where: { clubId: params.id } }),
      prisma.club.delete({ where: { id: params.id } }),
    ]);

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
