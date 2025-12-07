import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Check authentication via headers
    const userId = req.headers.get('X-User-Id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    let dateFilter: any = {};

    if (month && year) {
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      dateFilter = {
        date: {
          gte: startDate,
          lte: endDate,
        },
      };
    }

    // Get current user's employee record
    const employee = await prisma.employee.findFirst({
      where: { userId },
      select: { id: true },
    });

    console.log('👤 User ID:', userId);
    console.log('👷 Employee found:', employee);

    if (!employee) {
      // Return empty array if no employee record yet
      console.log('❌ No employee record found');
      return NextResponse.json([]);
    }

    // Only fetch attendance for the current user
    const attendance = await prisma.attendance.findMany({
      where: {
        employeeId: employee.id,
        ...dateFilter,
      },
      include: {
        employee: {
          include: {
            user: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    console.log('📊 Found attendance records:', attendance.length);
    if (attendance.length > 0) {
      console.log('📊 First record:', {
        date: attendance[0].date,
        checkInTime: attendance[0].checkInTime,
        checkOutTime: attendance[0].checkOutTime,
      });
    }

    // Format the response to ensure proper serialization
    const formattedAttendance = attendance.map((record) => ({
      ...record,
      date: record.date.toISOString(),
      checkInTime: record.checkInTime ? record.checkInTime.toISOString() : null,
      checkOutTime: record.checkOutTime ? record.checkOutTime.toISOString() : null,
      employeeName: `${record.employee.user.firstName} ${record.employee.user.lastName}`,
    }));

    console.log('📊 Formatted attendance sample:', formattedAttendance[0]);
    return NextResponse.json(formattedAttendance);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}