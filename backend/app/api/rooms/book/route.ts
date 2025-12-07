import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/rbac';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
  const authResult = await withAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const { roomId, bookedDate, startTime, endTime, purpose } = await req.json();

    if (!roomId || !bookedDate || !startTime || !endTime || !purpose) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get employee
    const user = await prisma.user.findUnique({
      where: { id: token?.id as string },
    });

    const employee = await prisma.employee.findUnique({
      where: { userId: user?.id },
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Check if room is available
    const existingBooking = await prisma.roomBooking.findFirst({
      where: {
        roomId,
        bookedDate: new Date(bookedDate),
        startTime: { lt: new Date(endTime) },
        endTime: { gt: new Date(startTime) },
        status: { in: ['CONFIRMED', 'PENDING'] },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: 'Room is already booked for this time' },
        { status: 400 }
      );
    }

    const booking = await prisma.roomBooking.create({
      data: {
        roomId,
        employeeId: employee.id,
        bookedDate: new Date(bookedDate),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        purpose,
        status: 'CONFIRMED',
      },
      include: {
        room: true,
        employee: { include: { user: true } },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}