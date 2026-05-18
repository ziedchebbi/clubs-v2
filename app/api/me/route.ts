import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import type { SessionUser } from '@/lib/auth-types';

export async function GET(request: Request) {
  try {
    const session = await getSession(request.headers);
    const user = session?.user as SessionUser | undefined;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user.id;

    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          include: {
            club: true,
          },
        },
      },
    });

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { memberships, ...rest } = userProfile;
    const clubs = memberships.map(m => ({ ...m.club, role: m.role }));

    return NextResponse.json({ data: { ...rest, clubs } });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
