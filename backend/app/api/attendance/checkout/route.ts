import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // Get user ID from headers (sent by frontend proxy)
    const userId = req.headers.get('X-User-Id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const employee = await prisma.employee.findUnique({
      where: { userId: user.id },
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Please check in first' },
        { status: 400 }
      );
    }

    const today = new Date();
    // Create date string in YYYY-MM-DD format to avoid timezone issues
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayDateStr = `${year}-${month}-${day}`;
    const todayUTC = new Date(`${todayDateStr}T00:00:00.000Z`); // Force UTC

    // Find today's attendance record
    const attendance = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: todayUTC,
      },
    });

    if (!attendance) {
      return NextResponse.json(
        { error: 'No check-in record found for today' },
        { status: 400 }
      );
    }

    if (attendance.checkOutTime) {
      return NextResponse.json(
        { error: 'Already checked out today' },
        { status: 400 }
      );
    }

    // Cooldown check: prevent rapid check-outs (within 1 minute of last check-out)
    const recentCheckOut = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        checkOutTime: {
          gte: new Date(Date.now() - 60000), // Last 1 minute
        },
      },
      orderBy: {
        checkOutTime: 'desc',
      },
    });

    if (recentCheckOut) {
      return NextResponse.json(
        { error: 'Please wait a moment before checking out again.' },
        { status: 429 }
      );
    }

    // Minimum work duration check (at least 1 minute since check-in)
    const checkInTime = new Date(attendance.checkInTime);
    const now = new Date();
    const timeDiff = now.getTime() - checkInTime.getTime();
    
    if (timeDiff < 60000) { // Less than 1 minute
      return NextResponse.json(
        { error: 'You must be checked in for at least 1 minute before checking out.' },
        { status: 400 }
      );
    }

    const updatedAttendance = await prisma.attendance.update({
      where: {
        id: attendance.id,
      },
      data: {
        checkOutTime: now,
      },
    });

    return NextResponse.json(updatedAttendance);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}