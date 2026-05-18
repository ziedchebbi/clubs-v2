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

    const annonce = await prisma.annonce.findUnique({
      where: { id: params.annonceId, clubId: params.id },
      include: {
        commentaires: true,
      },
    });

    if (!annonce) {
      return NextResponse.json({ error: 'Annonce not found' }, { status: 404 });
    }

    return NextResponse.json({ data: annonce });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; annonceId: string } }
) {
  try {
    const session = await getSession(request.headers);
    const user = session?.user as SessionUser | undefined;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await assertMemberRole(user.id, params.id, 'PRESIDENT');

    await prisma.commentaire.deleteMany({
      where: { annonceId: params.annonceId },
    });

    await prisma.annonce.delete({
      where: { id: params.annonceId },
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
