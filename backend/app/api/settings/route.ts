import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

// GET /api/settings - Fetch settings
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can access settings
    if (token.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Get or create settings
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.settings.create({
        data: {
          companyName: 'MoHR Systems',
          companyEmail: 'admin@mohr.com',
          companyAddress: '',
          timezone: 'UTC',
          dateFormat: 'MM/DD/YYYY',
          sessionTimeout: 30,
          require2FA: false,
          ipWhitelist: false,
          notifyLeaveRequests: true,
          notifyAttendanceAlert: true,
          notifySystemUpdates: true,
          notifyBirthdays: true,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { message: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update settings
export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can update settings
    if (token.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();

    // Get existing settings or create if none exist
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      // Create new settings
      settings = await prisma.settings.create({
        data: {
          companyName: body.companyName || 'MoHR Systems',
          companyEmail: body.companyEmail || 'admin@mohr.com',
          companyAddress: body.companyAddress || '',
          timezone: body.timezone || 'UTC',
          dateFormat: body.dateFormat || 'MM/DD/YYYY',
          sessionTimeout: body.sessionTimeout || 30,
          require2FA: body.require2FA ?? false,
          ipWhitelist: body.ipWhitelist ?? false,
          notifyLeaveRequests: body.notifyLeaveRequests ?? true,
          notifyAttendanceAlert: body.notifyAttendanceAlert ?? true,
          notifySystemUpdates: body.notifySystemUpdates ?? true,
          notifyBirthdays: body.notifyBirthdays ?? true,
        },
      });
    } else {
      // Update existing settings
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          companyName: body.companyName,
          companyEmail: body.companyEmail,
          companyAddress: body.companyAddress,
          timezone: body.timezone,
          dateFormat: body.dateFormat,
          sessionTimeout: body.sessionTimeout,
          require2FA: body.require2FA,
          ipWhitelist: body.ipWhitelist,
          notifyLeaveRequests: body.notifyLeaveRequests,
          notifyAttendanceAlert: body.notifyAttendanceAlert,
          notifySystemUpdates: body.notifySystemUpdates,
          notifyBirthdays: body.notifyBirthdays,
        },
      });
    }

    return NextResponse.json({
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { message: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
