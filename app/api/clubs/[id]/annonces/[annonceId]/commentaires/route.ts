import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { assertMemberRole } from '@/lib/membership';
import type { SessionUser } from '@/lib/auth-types';

export async function GET(
  request: Request,
  { params }: { params: { id: string; annonceId: string } }
) {
  try {
    const session = await getSession(request.headers);
    const user = session?.user as SessionUser | undefined;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await assertMemberRole(user.id, params.id, 'MEMBER');

    const commentaires = await prisma.commentaire.findMany({
      where: { annonceId: params.annonceId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ data: commentaires });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string; annonceId: string } }
) {
  try {
    const session = await getSession(request.headers);
    const user = session?.user as SessionUser | undefined;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user.id;

    await assertMemberRole(userId, params.id, 'MEMBER');

    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const commentaire = await prisma.commentaire.create({
      data: {
        content,
        annonceId: params.annonceId,
        authorId: userId,
      },
    });

    return NextResponse.json({ data: commentaire }, { status: 201 });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
