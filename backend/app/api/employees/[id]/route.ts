import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/rbac';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await withAuth(req, ['ADMIN', 'MANAGER', 'EMPLOYEE']);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const employee = await prisma.employee.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            department: true,
            phone: true,
            role: true,
          },
        },
        leaveBalance: true,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await withAuth(req, ['ADMIN']);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { position, department, status, phone } = await req.json();

    const employee = await prisma.employee.update({
      where: { id: params.id },
      data: {
        position,
        status,
        ...(phone && { user: { update: { phone } } }),
      },
      include: { user: true },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}