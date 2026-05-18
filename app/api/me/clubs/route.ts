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

    const memberships = await prisma.membership.findMany({
      where: { userId },
      include: {
        club: true,
      },
    });

    const clubs = memberships.map(m => ({
      ...m.club,
      role: m.role,
    }));

    return NextResponse.json({ data: clubs });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
