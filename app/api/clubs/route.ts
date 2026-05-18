import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import type { SessionUser } from '@/lib/auth-types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const universityId = searchParams.get('universityId');

  try {
    const clubs = await prisma.club.findMany({
      where: universityId ? { universityId } : {},
      include: {
        university: {
          select: {
            name: true,
          },
        },
        memberships: true, // Include memberships to get the count
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json({ data: clubs });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession(request.headers);
    const user = session?.user as SessionUser | undefined;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user.id;

    const body = await request.json();
    const { name, bio, universityId } = body;

    if (!name || !universityId) {
      return NextResponse.json({ error: 'Name and universityId are required' }, { status: 400 });
    }

    const club = await prisma.club.create({
      data: {
        id: crypto.randomUUID(),
        name,
        bio,
        universityId,
        memberships: {
          create: {
            userId,
            role: 'PRESIDENT',
          },
        },
      },
    });

    return NextResponse.json({ data: club }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
