import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  const authResult = await withAuth(req, ['ADMIN', 'MANAGER']);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const leaves = await prisma.leaveRequest.groupBy({
      by: ['status'],
      _count: true,
    });

    return NextResponse.json(leaves);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}