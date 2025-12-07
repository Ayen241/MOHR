import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/rbac';
import { getToken } from 'next-auth/jwt';

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // In Next.js 15+, params is a promise
  const params = await context.params;
  
  const authResult = await withAuth(req, ['ADMIN', 'MANAGER']);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const { status, rejectionReason } = await req.json();

    // First check if the leave request exists
    const existingLeave = await prisma.leaveRequest.findUnique({
      where: { id: params.id },
      include: { employee: true },
    });

    if (!existingLeave) {
      return NextResponse.json(
        { error: 'Leave request not found' },
        { status: 404 }
      );
    }

    // Update the leave request
    const leaveRequest = await prisma.leaveRequest.update({
      where: { id: params.id },
      data: {
        status,
        approvedBy: token?.id as string,
        approvalDate: new Date(),
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
      },
      include: { 
        employee: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true },
            },
          },
        }, 
        approver: {
          select: { firstName: true, lastName: true },
        }
      },
    });

    // If approved, update leave balance
    if (status === 'APPROVED') {
      const days = Math.ceil(
        (new Date(leaveRequest.endDate).getTime() -
          new Date(leaveRequest.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

      // Map leave type to field name
      let fieldToUpdate: 'usedVacation' | 'usedSick' | 'usedPersonal' | null = null;
      
      switch (leaveRequest.leaveType) {
        case 'VACATION':
          fieldToUpdate = 'usedVacation';
          break;
        case 'SICK':
          fieldToUpdate = 'usedSick';
          break;
        case 'PERSONAL':
          fieldToUpdate = 'usedPersonal';
          break;
        // UNPAID doesn't affect balance
      }

      if (fieldToUpdate) {
        // Check if leave balance exists, create if not
        const leaveBalance = await prisma.leaveBalance.findUnique({
          where: { employeeId: leaveRequest.employeeId },
        });

        if (leaveBalance) {
          // Update existing balance
          await prisma.leaveBalance.update({
            where: { employeeId: leaveRequest.employeeId },
            data: {
              [fieldToUpdate]: { increment: days },
            },
          });
        } else {
          // Create new balance with the used days
          const currentYear = new Date().getFullYear();
          await prisma.leaveBalance.create({
            data: {
              employeeId: leaveRequest.employeeId,
              year: currentYear,
              vacationDays: 20,
              sickDays: 10,
              personalDays: 5,
              usedVacation: fieldToUpdate === 'usedVacation' ? days : 0,
              usedSick: fieldToUpdate === 'usedSick' ? days : 0,
              usedPersonal: fieldToUpdate === 'usedPersonal' ? days : 0,
            },
          });
        }
      }
    }

    return NextResponse.json({
      id: leaveRequest.id,
      employeeId: leaveRequest.employeeId,
      employeeName: `${leaveRequest.employee.user.firstName} ${leaveRequest.employee.user.lastName}`,
      leaveType: leaveRequest.leaveType,
      startDate: leaveRequest.startDate.toISOString().split('T')[0],
      endDate: leaveRequest.endDate.toISOString().split('T')[0],
      reason: leaveRequest.reason,
      status: leaveRequest.status,
      approvedBy: leaveRequest.approver
        ? `${leaveRequest.approver.firstName} ${leaveRequest.approver.lastName}`
        : undefined,
      approvalDate: leaveRequest.approvalDate?.toISOString(),
    });
  } catch (error) {
    console.error('Error approving leave:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}