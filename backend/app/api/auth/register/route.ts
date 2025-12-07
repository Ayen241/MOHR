import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, department, phone } = body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Password validation (min 8 characters)
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user and employee record in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          department: department || null,
          phone: phone || null,
          role: 'EMPLOYEE', // Default role
          active: true,
        },
      });

      // Generate employee ID
      const employeeCount = await tx.employee.count();
      const employeeId = `EMP${String(employeeCount + 1).padStart(4, '0')}`;

      // Create employee record
      const employee = await tx.employee.create({
        data: {
          employeeId,
          userId: user.id,
          position: department || 'Employee',
          hireDate: new Date(),
          status: 'ACTIVE',
        },
      });

      // Create leave balance for current year
      const currentYear = new Date().getFullYear();
      await tx.leaveBalance.create({
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

      return user;
    });

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: result.id,
          email: result.email,
          firstName: result.firstName,
          lastName: result.lastName,
          role: result.role,
          department: result.department,
          phone: result.phone,
          createdAt: result.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
