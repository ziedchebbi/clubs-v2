import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import type { SessionUser } from '@/lib/auth-types';

export async function GET() {
  try {
    const universities = await prisma.university.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json({ data: universities });
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
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name } = body;

    if (typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const university = await prisma.university.create({
      data: {
        id: crypto.randomUUID(),
        name,
      },
    });

    return NextResponse.json({ data: university }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
