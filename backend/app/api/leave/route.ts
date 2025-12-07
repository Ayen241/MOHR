import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('X-User-Id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const leaveType = formData.get('leaveType') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const reason = formData.get('reason') as string;
    const attachment = formData.get('attachment') as File | null;

    // Get user
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

    // Handle file upload
    let attachmentPath: string | null = null;
    if (attachment && attachment.size > 0) {
      const bytes = await attachment.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'leave-attachments');
      await mkdir(uploadsDir, { recursive: true });
      
      // Generate unique filename
      const timestamp = Date.now();
      const ext = path.extname(attachment.name);
      const filename = `${employee.id}-${timestamp}${ext}`;
      const filepath = path.join(uploadsDir, filename);
      
      // Save file
      await writeFile(filepath, buffer);
      attachmentPath = `/uploads/leave-attachments/${filename}`;
    }

    // Calculate days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Create leave request
    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        employeeId: employee.id,
        leaveType,
        startDate: start,
        endDate: end,
        reason,
        attachment: attachmentPath,
      },
    });

    return NextResponse.json(leaveRequest, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    // Get employee record
    const employee = await prisma.employee.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (!employee) {
      // Return empty array if no employee record yet
      return NextResponse.json([]);
    }

    // ADMIN and MANAGER can see all leaves, EMPLOYEE sees only their own
    const whereClause: any = status ? { status: status as any } : {};
    
    if (userRole !== 'ADMIN' && userRole !== 'MANAGER') {
      whereClause.employeeId = employee.id;
    }

    const leaves = await prisma.leaveRequest.findMany({
      where: whereClause,
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to match frontend expectations
    const transformedLeaves = leaves.map((leave) => ({
      id: leave.id,
      employeeId: leave.employeeId,
      employeeName: `${leave.employee.user.firstName} ${leave.employee.user.lastName}`,
      leaveType: leave.leaveType,
      startDate: leave.startDate.toISOString().split('T')[0],
      endDate: leave.endDate.toISOString().split('T')[0],
      reason: leave.reason,
      attachment: leave.attachment,
      status: leave.status,
      approvedBy: leave.approver
        ? `${leave.approver.firstName} ${leave.approver.lastName}`
        : undefined,
      approvalDate: leave.approvalDate?.toISOString(),
      rejectionReason: leave.rejectionReason,
    }));

    return NextResponse.json(transformedLeaves);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}