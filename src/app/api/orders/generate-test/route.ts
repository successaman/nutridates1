import { NextRequest, NextResponse } from 'next/server';
import { db, Order, supabase } from '@/lib/db';
import path from 'path';
import fs from 'fs';

function isAdmin(req: NextRequest): boolean {
  const session = req.cookies.get('admin_session');
  return !!(session && session.value === 'authenticated');
}

const CITIES = [
  { city: 'Hazaribagh', state: 'Jharkhand', pincode: '825301' },
  { city: 'Ranchi', state: 'Jharkhand', pincode: '834001' },
  { city: 'Jamshedpur', state: 'Jharkhand', pincode: '831001' },
  { city: 'Dhanbad', state: 'Jharkhand', pincode: '826001' },
  { city: 'Patna', state: 'Bihar', pincode: '800001' },
  { city: 'Delhi', state: 'Delhi', pincode: '110001' },
  { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
  { city: 'Ranchi', state: 'Jharkhand', pincode: '834005' },
  { city: 'Hazaribagh', state: 'Jharkhand', pincode: '825302' },
];

const NAMES = [
  'Aman Kumar', 'Priyam Gupta', 'Rahul Sharma', 'Anjali Singh', 
  'Amit Mahato', 'Vikram Aditya', 'Neha Kumari', 'Sandeep Mishra', 
  'Rajesh Yadav', 'Deepak Verma', 'Sonia Soren', 'Kunal Shah', 
  'Priya Patel', 'Sunil Kumar', 'Manish Pandey', 'Rohit Sen',
  'Swati Prasad', 'Karan Johar', 'Shreya Ghoshal', 'Nitin Gadkari'
];

const SIZES = [
  { size: '250g', price: 299 },
  { size: '500g', price: 549 },
  { size: '1kg', price: 999 }
];

const STATUSES: Array<Order['status']> = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const PAYMENTS = ['Cash on Delivery', 'UPI (Pay on Delivery)'];

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const generatedOrders: Order[] = [];
    const now = new Date();

    // Clean existing orders in fallback file DB or insert fresh ones
    // We will generate 25 orders spanning the last 12 days
    for (let i = 0; i < 25; i++) {
      const daysAgo = Math.floor(Math.random() * 12);
      const hoursAgo = Math.floor(Math.random() * 24);
      const minutesAgo = Math.floor(Math.random() * 60);
      
      const orderDate = new Date();
      orderDate.setDate(now.getDate() - daysAgo);
      orderDate.setHours(now.getHours() - hoursAgo);
      orderDate.setMinutes(now.getMinutes() - minutesAgo);

      const customer_name = NAMES[i % NAMES.length];
      const cityObj = CITIES[Math.floor(Math.random() * CITIES.length)];
      const sizeObj = SIZES[Math.floor(Math.random() * SIZES.length)];
      const quantity = Math.floor(Math.random() * 2) + 1; // 1 or 2
      const total_amount = sizeObj.price * quantity;
      
      const phone = `+91 ${9000000000 + Math.floor(Math.random() * 999999999)}`;
      const email = `${customer_name.toLowerCase().replace(' ', '.')}@example.com`;
      const payment_method = PAYMENTS[i % PAYMENTS.length];
      
      // Weight status towards delivered/shipped for older orders, pending/confirmed for newer orders
      let status: Order['status'] = 'pending';
      if (daysAgo > 6) {
        status = Math.random() > 0.1 ? 'delivered' : 'cancelled';
      } else if (daysAgo > 3) {
        status = Math.random() > 0.4 ? 'delivered' : 'shipped';
      } else if (daysAgo > 1) {
        status = Math.random() > 0.5 ? 'shipped' : 'confirmed';
      } else {
        status = Math.random() > 0.5 ? 'confirmed' : 'pending';
      }

      // Generate order timeline
      const timeline = [
        {
          status: 'pending',
          timestamp: new Date(orderDate.getTime()).toISOString(),
          note: 'Order placed by customer.'
        }
      ];

      if (status !== 'pending') {
        const confirmTime = new Date(orderDate.getTime() + 1000 * 60 * 30); // 30 mins later
        timeline.push({
          status: 'confirmed',
          timestamp: confirmTime.toISOString(),
          note: 'Order confirmed by administrator.'
        });
      }

      if (status === 'shipped' || status === 'delivered') {
        const shipTime = new Date(orderDate.getTime() + 1000 * 60 * 60 * 5); // 5 hours later
        timeline.push({
          status: 'shipped',
          timestamp: shipTime.toISOString(),
          note: 'Package handed over to DTDC Express. Tracking: DTDC' + Math.floor(Math.random() * 90000000 + 10000000)
        });
      }

      if (status === 'delivered') {
        const deliverTime = new Date(orderDate.getTime() + 1000 * 60 * 60 * 36); // 36 hours later
        timeline.push({
          status: 'delivered',
          timestamp: deliverTime.toISOString(),
          note: 'Package successfully delivered and paid.'
        });
      }

      if (status === 'cancelled') {
        const cancelTime = new Date(orderDate.getTime() + 1000 * 60 * 60 * 2); // 2 hours later
        timeline.push({
          status: 'cancelled',
          timestamp: cancelTime.toISOString(),
          note: 'Cancelled: Customer requested change of address.'
        });
      }

      // Order ID sequence
      const orderIdNum = 1001 + i;
      const orderId = `ND-${orderDate.getFullYear()}-${orderIdNum}`;

      const mockOrder: Order = {
        id: orderId,
        customer_name,
        phone,
        email,
        address: `${Math.floor(Math.random() * 200) + 1}, Shiv Mandir Road, Lalpur`,
        city: cityObj.city,
        state: cityObj.state,
        pincode: cityObj.pincode,
        total_amount,
        payment_method,
        status,
        items: [
          {
            id: 'prod_chocolate_mix',
            name: 'Chocolate Dates Powder',
            price: sizeObj.price,
            quantity,
            size: sizeObj.size
          }
        ],
        timeline,
        created_at: orderDate.toISOString(),
        updated_at: new Date(orderDate.getTime() + 1000 * 60 * 60 * 12).toISOString()
      };

      generatedOrders.push(mockOrder);
    }

    // Write all to database
    // For local file fallback: overwrite/append
    // Let's insert into Supabase if connected
    let supabaseSuccessCount = 0;
    const isSupabase = await db.isSupabaseConnected();
    
    if (isSupabase && supabase) {
      try {
        const { error } = await supabase.from('orders').insert(generatedOrders);
        if (!error) {
          supabaseSuccessCount = generatedOrders.length;
        } else {
          console.warn('Supabase bulk test generation failed:', error.message);
        }
      } catch (err: any) {
        console.warn('Supabase test generation error:', err.message);
      }
    }

    // Always sync with local file DB for backup/dual representation
    const localDbPath = path.join(process.cwd(), 'data', 'db.json');
    if (fs.existsSync(localDbPath)) {
      const localDb = JSON.parse(fs.readFileSync(localDbPath, 'utf-8'));
      localDb.orders = [...localDb.orders.filter((o: any) => !o.id.startsWith('ND-')), ...generatedOrders];
      fs.writeFileSync(localDbPath, JSON.stringify(localDb, null, 2), 'utf-8');
    }

    return NextResponse.json({
      success: true,
      message: `Generated 25 mock orders successfully.`,
      supabaseInserted: supabaseSuccessCount,
      localJsonInserted: generatedOrders.length
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
