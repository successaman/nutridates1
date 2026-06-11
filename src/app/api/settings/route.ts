import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

function isAdmin(req: NextRequest): boolean {
  const session = req.cookies.get('admin_session');
  return !!(session && session.value === 'authenticated');
}

// GET: Publicly fetch store settings and coupons
export async function GET() {
  try {
    const settings = await db.getSettings();
    const coupons = await db.getCoupons();
    return NextResponse.json({ success: true, settings, coupons });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Update store settings or coupons (Admin only)
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Case 1: Update Coupons
    if (body.store_coupons !== undefined || body.coupons !== undefined) {
      const coupons = body.store_coupons || body.coupons;
      if (!Array.isArray(coupons)) {
        return NextResponse.json({ success: false, error: 'Coupons must be an array' }, { status: 400 });
      }
      const success = await db.updateCoupons(coupons);
      if (success) {
        return NextResponse.json({ success: true, message: 'Coupons successfully updated.' });
      } else {
        return NextResponse.json({ success: false, error: 'Failed to save coupons.' }, { status: 500 });
      }
    }

    // Case 2: Update settings (whatsapp_phone, support_email, whatsapp_template)
    const { whatsapp_phone, support_email, whatsapp_template } = body;

    if (!whatsapp_phone || !support_email) {
      return NextResponse.json({ success: false, error: 'Missing required settings' }, { status: 400 });
    }

    const success = await db.updateSettings({
      whatsapp_phone,
      support_email,
      whatsapp_template
    });

    if (success) {
      return NextResponse.json({ success: true, message: 'Settings successfully updated.' });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to save settings.' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
