import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

function isAdmin(req: NextRequest): boolean {
  const session = req.cookies.get('admin_session');
  return !!(session && session.value === 'authenticated');
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const success = await db.resetOrders();
    if (success) {
      return NextResponse.json({ success: true, message: 'All orders have been reset and database is cleared.' });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to write changes to database.' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
