import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { assertMemberRole } from '@/lib/membership';
import type { SessionUser } from '@/lib/auth-types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession(request.headers);
    const user = session?.user as SessionUser | undefined;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await assertMemberRole(user.id, params.id, 'MEMBER');

    const annonces = await prisma.annonce.findMany({
      where: { clubId: params.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { commentaires: true },
        },
      },
    });

    return NextResponse.json({ data: annonces });
  } catch (error) {
    if (error instanceof NextResponse) return error;
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
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const annonce = await prisma.annonce.create({
      data: {
        content,
        clubId: params.id,
        authorId: userId,
      },
    });

    return NextResponse.json({ data: annonce }, { status: 201 });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
