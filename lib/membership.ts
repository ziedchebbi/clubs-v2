import prisma from './prisma';
import { NextResponse } from 'next/server';

export async function getUserMemberRole(
  userId: string,
  clubId: string
): Promise<'PRESIDENT' | 'MEMBER' | null> {
  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      clubId,
    },
    select: {
      role: true,
    },
  });
  // The role is an enum in the DB, but we treat it as a string literal union type here
  return (membership?.role as 'PRESIDENT' | 'MEMBER' | null) ?? null;
}

export async function assertMemberRole(
  userId: string,
  clubId: string,
  requiredRole: 'PRESIDENT' | 'MEMBER'
): Promise<void> {
  const userRole = await getUserMemberRole(userId, clubId);

  if (!userRole) {
    throw new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const roleHierarchy: Record<'PRESIDENT' | 'MEMBER', number> = {
    MEMBER: 1,
    PRESIDENT: 2,
  };

  if (roleHierarchy[userRole] < roleHierarchy[requiredRole]) {
    throw new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }
}
