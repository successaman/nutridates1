import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();
    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid checkout amount' }, { status: 400 });
    }

    // Fetch active settings to read Razorpay credentials
    const settings = await db.getSettings();
    const isRazorpayEnabled = !!(settings?.razorpay_enabled && settings?.razorpay_key_id && settings?.razorpay_key_secret);

    if (!isRazorpayEnabled) {
      // Return sandbox indicator so client runs simulation
      return NextResponse.json({
        success: true,
        sandbox: true,
        amount: amount,
        currency: 'INR',
        key_id: 'rzp_test_mock_sandbox_key_id'
      });
    }

    const keyId = settings.razorpay_key_id;
    const keySecret = settings.razorpay_key_secret;

    // Contact Razorpay API directly via fetch
    const authString = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Razorpay accepts in paise
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`
      })
    });

    const rpData = await response.json();
    if (!response.ok) {
      console.error('Razorpay order creation failed:', rpData);
      return NextResponse.json({ success: false, error: rpData.error?.description || 'Razorpay initialization failed' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      sandbox: false,
      id: rpData.id,
      amount: rpData.amount,
      currency: rpData.currency,
      key_id: keyId
    });

  } catch (error: any) {
    console.error('Payments order API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
