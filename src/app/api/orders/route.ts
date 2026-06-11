import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Admin checking helper
function isAdmin(req: NextRequest): boolean {
  const session = req.cookies.get('admin_session');
  return !!(session && session.value === 'authenticated');
}

// GET: Retrieve all orders (admin only)
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await db.getOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create a new order (publicly accessible)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    const { customer_name, phone, address, city, state, pincode, total_amount, payment_method, items } = body;
    if (!customer_name || !phone || !address || !city || !state || !pincode || !total_amount || !payment_method || !items) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Initialize order timeline
    const timeline = [
      {
        status: 'pending',
        timestamp: new Date().toISOString(),
        note: 'Order placed by customer.'
      }
    ];

    const newOrder = await db.createOrder({
      customer_name,
      phone,
      email: body.email || '',
      address,
      city,
      state,
      pincode,
      total_amount,
      payment_method,
      status: 'pending',
      items,
      timeline
    });

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
