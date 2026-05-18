import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getUserMemberRole } from '@/lib/membership';
import type { SessionUser } from '@/lib/auth-types';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; commentaireId: string } }
) {
  try {
    const session = await getSession(request.headers);
    const user = session?.user as SessionUser | undefined;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user.id;

    const commentaire = await prisma.commentaire.findUnique({
      where: { id: params.commentaireId },
    });

    if (!commentaire) {
      return NextResponse.json({ error: 'Commentaire not found' }, { status: 404 });
    }

    const memberRole = await getUserMemberRole(userId, params.id);
    const isPresident = memberRole === 'PRESIDENT';
    const isAuthor = commentaire.authorId === userId;

    if (!isPresident && !isAuthor) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.commentaire.delete({
      where: { id: params.commentaireId },
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
