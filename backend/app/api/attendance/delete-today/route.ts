import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// DEVELOPMENT ONLY - Delete today's attendance record
// Remove this endpoint in production!
export async function DELETE(req: NextRequest) {
  try {
    const userId = req.headers.get('X-User-Id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const employee = await prisma.employee.findUnique({
      where: { userId },
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Delete all attendance records from the last 2 days to catch timezone issues
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    twoDaysAgo.setHours(0, 0, 0, 0);

    const deleted = await prisma.attendance.deleteMany({
      where: {
        employeeId: employee.id,
        date: {
          gte: twoDaysAgo,
        },
      },
    });

    console.log(`🗑️ Deleted ${deleted.count} attendance record(s)`);

    return NextResponse.json({
      message: `Deleted ${deleted.count} attendance record(s)`,
      count: deleted.count,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
