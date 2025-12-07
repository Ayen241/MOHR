import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('X-User-Id');
    const userRole = req.headers.get('X-User-Role');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let count = 0;

    if (userRole === 'ADMIN' || userRole === 'MANAGER') {
      // For admins/managers: count all pending leave requests
      count = await prisma.leaveRequest.count({
        where: { status: 'PENDING' },
      });
    } else {
      // For employees: count their own leaves with status updates (approved/rejected)
      const employee = await prisma.employee.findFirst({
        where: { userId },
        select: { id: true },
      });

      if (employee) {
        count = await prisma.leaveRequest.count({
          where: {
            employeeId: employee.id,
            status: { in: ['APPROVED', 'REJECTED'] },
            // Only count recent status updates (last 7 days)
            updatedAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        });
      }
    }

    return NextResponse.json({ count });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
