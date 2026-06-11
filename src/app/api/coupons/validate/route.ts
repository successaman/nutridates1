import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ success: false, error: 'Coupon code is required.' }, { status: 400 });
    }

    const coupons = await db.getCoupons();
    // Normalize code comparison (uppercase, trimmed)
    const normalizedCode = code.trim().toUpperCase();

    const coupon = coupons.find(c => c.code.trim().toUpperCase() === normalizedCode);

    if (!coupon) {
      return NextResponse.json({ success: false, error: 'Invalid coupon code.' }, { status: 404 });
    }

    if (!coupon.is_active) {
      return NextResponse.json({ success: false, error: 'This coupon code has expired.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      discount_pct: coupon.discount_pct,
      code: coupon.code
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
