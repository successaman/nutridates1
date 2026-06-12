import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    // Retrieve settings to check signature if secret is configured
    const settings = await db.getSettings();
    const razorpaySecret = settings?.razorpay_key_secret;

    if (razorpaySecret && signature) {
      // Validate signature
      const expectedSignature = crypto
        .createHmac('sha256', razorpaySecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        console.warn('Razorpay webhook signature verification failed.');
        // Still return 200 to Razorpay to avoid retries, but don't process
        return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 200 });
      }
    }

    if (event === 'payment.captured' || event === 'order.paid') {
      const payment = payload.payload.payment.entity;
      const paymentId = payment.id;
      const amount = payment.amount / 100;
      
      // Retrieve the local order ID from notes
      const localOrderId = payment.notes?.order_id || payment.notes?.local_order_id;
      
      if (localOrderId) {
        console.log(`Razorpay webhook payment captured: ${paymentId} for Order: ${localOrderId}`);
        
        // Fetch order from DB
        const order = await db.getOrderById(localOrderId);
        if (order) {
          if (order.status === 'pending') {
            const updatedTimeline = [
              ...order.timeline,
              {
                status: 'confirmed',
                timestamp: new Date().toISOString(),
                note: `Payment of ₹${amount} successfully captured via Razorpay online. Transaction ID: ${paymentId}.`
              }
            ];

            await db.updateOrder(localOrderId, {
              status: 'confirmed',
              payment_method: `Online (Razorpay Verified) - Txn: ${paymentId}`,
              timeline: updatedTimeline
            });
            console.log(`Order ${localOrderId} status updated to confirmed via webhook.`);
          }
        } else {
          console.warn(`Order ${localOrderId} not found in database.`);
        }
      } else {
        console.warn('No order_id found in payment notes payload.');
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Razorpay Webhook Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
