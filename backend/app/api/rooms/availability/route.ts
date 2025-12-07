import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  const authResult = await withAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');

    if (!date || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing date, startTime, or endTime' },
        { status: 400 }
      );
    }

    const bookedRooms = await prisma.roomBooking.findMany({
      where: {
        bookedDate: new Date(date),
        startTime: { lt: new Date(endTime) },
        endTime: { gt: new Date(startTime) },
        status: { in: ['CONFIRMED', 'PENDING'] },
      },
      select: { roomId: true },
    });

    const bookedRoomIds = bookedRooms.map((b) => b.roomId);

    const availableRooms = await prisma.room.findMany({
      where: {
        id: { notIn: bookedRoomIds },
      },
    });

    return NextResponse.json(availableRooms);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}