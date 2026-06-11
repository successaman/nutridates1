import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

function isAdmin(req: NextRequest): boolean {
  const session = req.cookies.get('admin_session');
  return !!(session && session.value === 'authenticated');
}

// GET: Retrieve a single order by ID (public tracking)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const order = await db.getOrderById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH: Update order status & timeline (admin restricted)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isAdmin(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const existingOrder = await db.getOrderById(id);
    if (!existingOrder) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const { status, note } = body;
    const updates: any = {};

    if (status) {
      updates.status = status;
      
      // Append to timeline
      const newTimelineEvent = {
        status,
        timestamp: new Date().toISOString(),
        note: note || `Order status updated to ${status}.`
      };
      
      updates.timeline = [...existingOrder.timeline, newTimelineEvent];
    } else if (body.timeline) {
      updates.timeline = body.timeline;
    }

    // Capture other fields if passed (e.g. shipping updates)
    if (body.customer_name) updates.customer_name = body.customer_name;
    if (body.phone) updates.phone = body.phone;
    if (body.email) updates.email = body.email;
    if (body.address) updates.address = body.address;
    if (body.city) updates.city = body.city;
    if (body.state) updates.state = body.state;
    if (body.pincode) updates.pincode = body.pincode;

    const updatedOrder = await db.updateOrder(id, updates);
    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
