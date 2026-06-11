import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

function isAdmin(req: NextRequest): boolean {
  const session = req.cookies.get('admin_session');
  return !!(session && session.value === 'authenticated');
}

// GET: Fetch products list
export async function GET() {
  try {
    const products = await db.getProducts();
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH: Update product sizes, details, or stock status
export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, sizes, stock_status, description, name } = body;
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing product ID' }, { status: 400 });
    }

    const updates: any = {};
    if (sizes) updates.sizes = sizes;
    if (stock_status) updates.stock_status = stock_status;
    if (description) updates.description = description;
    if (name) updates.name = name;

    const updatedProduct = await db.updateProduct(id, updates);
    if (!updatedProduct) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
