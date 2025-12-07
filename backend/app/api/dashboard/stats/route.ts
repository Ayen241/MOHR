import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('X-User-Id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const totalEmployees = await prisma.employee.count({
      where: { status: 'ACTIVE' },
    });

    const pendingLeaves = await prisma.leaveRequest.count({
      where: { status: 'PENDING' },
    });

    const presentToday = await prisma.attendance.count({
      where: {
        date: new Date(new Date().toISOString().split('T')[0]),
        status: { in: ['PRESENT', 'LATE'] },
      },
    });

    const absentToday = await prisma.attendance.count({
      where: {
        date: new Date(new Date().toISOString().split('T')[0]),
        status: 'ABSENT',
      },
    });

    return NextResponse.json({
      totalEmployees,
      pendingLeaves,
      presentToday,
      absentToday,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}