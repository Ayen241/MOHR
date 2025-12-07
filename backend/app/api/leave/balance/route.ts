import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const userId = req.headers.get('X-User-Id');
  const userRole = req.headers.get('X-User-Role');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get employee record
    let employee = await prisma.employee.findFirst({
      where: { userId },
      select: { id: true },
    });

    // If employee record doesn't exist, create it
    if (!employee) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true, department: true },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Generate employee ID
      const employeeCount = await prisma.employee.count();
      const employeeId = `EMP${String(employeeCount + 1).padStart(4, '0')}`;

      // Create employee record
      employee = await prisma.employee.create({
        data: {
          employeeId,
          userId,
          position: user.department || 'Employee',
          hireDate: new Date(),
          status: 'ACTIVE',
        },
        select: { id: true },
      });
    }

    // Get or create leave balance for current year
    const currentYear = new Date().getFullYear();
    let leaveBalance = await prisma.leaveBalance.findFirst({
      where: {
        employeeId: employee.id,
        year: currentYear,
      },
    });

    // Create default balance if it doesn't exist
    if (!leaveBalance) {
      leaveBalance = await prisma.leaveBalance.create({
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

    // Count pending leave requests
    const pendingRequests = await prisma.leaveRequest.count({
      where: {
        employeeId: employee.id,
        status: 'PENDING',
      },
    });

    // Calculate available days
    const response = {
      vacationDays: {
        total: leaveBalance.vacationDays,
        used: leaveBalance.usedVacation,
        available: leaveBalance.vacationDays - leaveBalance.usedVacation,
      },
      sickDays: {
        total: leaveBalance.sickDays,
        used: leaveBalance.usedSick,
        available: leaveBalance.sickDays - leaveBalance.usedSick,
      },
      personalDays: {
        total: leaveBalance.personalDays,
        used: leaveBalance.usedPersonal,
        available: leaveBalance.personalDays - leaveBalance.usedPersonal,
      },
      pendingRequests,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching leave balance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leave balance' },
      { status: 500 }
    );
  }
}
