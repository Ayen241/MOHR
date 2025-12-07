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

    // Get or create employee record
    let employee = await prisma.employee.findUnique({
      where: { userId: user.id },
    });

    if (!employee) {
      // Generate employee ID
      const employeeCount = await prisma.employee.count();
      const employeeId = `EMP${String(employeeCount + 1).padStart(4, '0')}`;

      // Create employee record
      employee = await prisma.employee.create({
        data: {
          employeeId,
          userId: user.id,
          position: user.department || 'Employee',
          hireDate: new Date(),
          status: 'ACTIVE',
        },
      });

      // Create leave balance for current year
      const currentYear = new Date().getFullYear();
      await prisma.leaveBalance.create({
        data: {
          employeeId: employee.id,
          year: currentYear,
          vacationDays: 20,
          sickDays: 10,
          personalDays: 5,
          usedVacation: 0,
          usedSick: 0,
          usedPersonal: 0,
        },
      });
    }

    const today = new Date();
    // Create date string in YYYY-MM-DD format to avoid timezone issues
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayDateStr = `${year}-${month}-${day}`;
    const todayUTC = new Date(`${todayDateStr}T00:00:00.000Z`); // Force UTC

    console.log('📅 Check-in date:', todayDateStr, '→', todayUTC.toISOString());

    // Check if already checked in (one attendance record per day)
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: todayUTC,
      },
    });

    if (existingAttendance) {
      if (existingAttendance.checkOutTime) {
        return NextResponse.json(
          { error: 'You have already completed attendance for today.' },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { error: 'Already checked in. Please check out first.' },
          { status: 400 }
        );
      }
    }

    // Cooldown check: prevent rapid check-ins (within 1 minute of last check-in)
    const recentCheckIn = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        checkInTime: {
          gte: new Date(Date.now() - 60000), // Last 1 minute
        },
      },
      orderBy: {
        checkInTime: 'desc',
      },
    });

    if (recentCheckIn) {
      return NextResponse.json(
        { error: 'Please wait a moment before checking in again.' },
        { status: 429 }
      );
    }

    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const status = (hour > 9 || (hour === 9 && minute > 30)) ? 'LATE' : 'PRESENT';

    const attendance = await prisma.attendance.create({
      data: {
        employeeId: employee.id,
        date: todayUTC,
        checkInTime: now,
        status,
      },
    });

    console.log('✅ Created attendance:', {
      date: todayUTC.toISOString(),
      checkInTime: now.toISOString(),
    });

    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
