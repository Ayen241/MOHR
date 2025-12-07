import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

// GET /api/reports - Fetch comprehensive analytics
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only admins and managers can access reports
    if (token.role !== 'ADMIN' && token.role !== 'MANAGER') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'month'; // week, month, quarter, year

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // 1. Total Employees
    const totalEmployees = await prisma.employee.count({
      where: { status: 'ACTIVE' }
    });

    // New hires in period
    const newHires = await prisma.employee.count({
      where: {
        status: 'ACTIVE',
        hireDate: {
          gte: startDate
        }
      }
    });

    // 2. Average Attendance Rate
    const totalWorkDays = await prisma.attendance.count({
      where: {
        date: {
          gte: startDate
        }
      }
    });

    const presentDays = await prisma.attendance.count({
      where: {
        date: {
          gte: startDate
        },
        status: 'PRESENT'
      }
    });

    const avgAttendance = totalWorkDays > 0 
      ? ((presentDays / totalWorkDays) * 100).toFixed(1)
      : '0';

    // 3. Pending Leaves
    const pendingLeaves = await prisma.leaveRequest.count({
      where: { status: 'PENDING' }
    });

    // 4. Employees by Department
    const employeesByDept = await prisma.user.groupBy({
      by: ['department'],
      where: {
        active: true,
        department: { not: null }
      },
      _count: {
        id: true
      }
    });

    const totalForPercentage = employeesByDept.reduce((sum: number, dept: any) => sum + dept._count.id, 0);
    
    const departmentStats = employeesByDept.map((dept: any) => ({
      name: dept.department || 'Unassigned',
      count: dept._count.id,
      percentage: totalForPercentage > 0 
        ? Math.round((dept._count.id / totalForPercentage) * 100)
        : 0
    }));

    const departmentCount = employeesByDept.length;

    // 5. Weekly Attendance Trend (last 5 days)
    const last5Days = [];
    for (let i = 4; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last5Days.push(date.toISOString().split('T')[0]);
    }

    const weeklyTrend = await Promise.all(
      last5Days.map(async (date, index) => {
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const total = await prisma.attendance.count({
          where: { date: new Date(date) }
        });
        const present = await prisma.attendance.count({
          where: { 
            date: new Date(date),
            status: 'PRESENT'
          }
        });
        
        return {
          day: dayNames[index] || new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
          rate: total > 0 ? Math.round((present / total) * 100) : 0
        };
      })
    );

    // 6. Leave Statistics
    const [approvedLeaves, rejectedLeaves, cancelledLeaves] = await Promise.all([
      prisma.leaveRequest.count({
        where: {
          status: 'APPROVED',
          createdAt: { gte: startDate }
        }
      }),
      prisma.leaveRequest.count({
        where: {
          status: 'REJECTED',
          createdAt: { gte: startDate }
        }
      }),
      prisma.leaveRequest.count({
        where: {
          status: 'CANCELLED',
          createdAt: { gte: startDate }
        }
      })
    ]);

    const leaveStats = {
      approved: approvedLeaves,
      pending: pendingLeaves,
      rejected: rejectedLeaves,
      awaiting: cancelledLeaves // or could be pending from managers
    };

    return NextResponse.json({
      period,
      metrics: {
        totalEmployees,
        newHires,
        avgAttendance: parseFloat(avgAttendance),
        pendingLeaves,
        departmentCount
      },
      departmentStats,
      weeklyTrend,
      leaveStats
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { message: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
