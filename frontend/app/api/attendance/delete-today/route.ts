import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export async function DELETE(req: NextRequest) {
  try {
    const userId = req.headers.get('X-User-Id');

    const response = await fetch(`${BACKEND_URL}/api/attendance/delete-today`, {
      method: 'DELETE',
      headers: {
        'X-User-Id': userId || '',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete attendance');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting attendance:', error);
    return NextResponse.json(
      { error: 'Failed to delete attendance' },
      { status: 500 }
    );
  }
}
