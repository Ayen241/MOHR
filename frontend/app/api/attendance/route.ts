import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    // Proxy to backend
    const url = `${BACKEND_URL}/api/attendance${queryString ? `?${queryString}` : ''}`;
    console.log('🔄 Proxying to:', url);
    console.log('👤 User ID:', session.user.id);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
        'X-User-Id': session.user.id,
        'X-User-Email': session.user.email,
        'X-User-Role': session.user.role,
      },
    });

    const data = await response.json();
    
    console.log('📦 Response status:', response.status);
    console.log('📦 Response data length:', Array.isArray(data) ? data.length : 'not an array');
    if (Array.isArray(data) && data.length > 0) {
      console.log('📦 First record:', data[0]);
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Attendance fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance records' },
      { status: 500 }
    );
  }
}
