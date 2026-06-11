import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

function isAdmin(req: NextRequest): boolean {
  const session = req.cookies.get('admin_session');
  return !!(session && session.value === 'authenticated');
}

// GET: Publicly fetch store settings
export async function GET() {
  try {
    const settings = await db.getSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Update store settings (Admin only)
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { whatsapp_phone, support_email } = body;

    if (!whatsapp_phone || !support_email) {
      return NextResponse.json({ success: false, error: 'Missing required settings' }, { status: 400 });
    }

    const success = await db.updateSettings({ whatsapp_phone, support_email });
    if (success) {
      return NextResponse.json({ success: true, message: 'Settings successfully updated.' });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to save settings.' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
