import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateEmployeeId, hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('X-User-Id');
    const userRole = req.headers.get('X-User-Role');
    
    if (!userId || userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { firstName, lastName, email, position, department, phone } =
      await req.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !position) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash default password
    const defaultPassword = await hashPassword('password123');

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: defaultPassword,
        firstName,
        lastName,
        department,
        phone,
        role: 'EMPLOYEE',
      },
    });

    // Generate employee ID
    const employeeCount = await prisma.employee.count();
    const employeeId = generateEmployeeId(employeeCount);

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        employeeId,
        userId: user.id,
        position,
        hireDate: new Date(),
      },
    });

    // Create leave balance
    await prisma.leaveBalance.create({
      data: {
        employeeId: employee.id,
        year: new Date().getFullYear(),
      },
    });

    return NextResponse.json(
      { message: 'Employee created', employeeId },
      { status: 201 }
    );
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
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const employees = await prisma.employee.findMany({
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            department: true,
            phone: true,
          },
        },
        leaveBalance: true,
      },
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}