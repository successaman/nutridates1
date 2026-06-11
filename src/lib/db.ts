import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

// Fallback JSON File Database Configuration
const JSON_DB_DIR = path.join(process.cwd(), 'data');
const JSON_DB_FILE = path.join(JSON_DB_DIR, 'db.json');

// Interface definition for Order
export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  total_amount: number;
  payment_method: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
  }>;
  timeline: Array<{
    status: string;
    timestamp: string;
    note: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  code: string;
  discount_pct: number;
  is_active: boolean;
}

export interface StoreSettings {
  whatsapp_phone: string;
  support_email: string;
  whatsapp_template?: string;
}

// Interface definition for Product Size
export interface ProductSize {
  size: string;
  price: number;
  original_price?: number;
  in_stock: boolean;
}

// Interface definition for Product
export interface Product {
  id: string;
  name: string;
  description: string;
  sizes: ProductSize[];
  stock_status: 'in_stock' | 'out_of_stock';
  created_at: string;
}

// Initialize Supabase Client
export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Default Mock Data for initialization
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod_chocolate_mix',
    name: 'Chocolate Dates Nutrition Powder',
    description: 'Date-Based Chocolate Nutrition Powder with Oats and Mixed Dry Fruits. India\'s first healthy sugar-free kids and gym mix.',
    sizes: [
      { size: '250g', price: 299, original_price: 349, in_stock: true },
      { size: '500g', price: 549, original_price: 699, in_stock: true },
      { size: '1kg', price: 999, original_price: 1299, in_stock: true }
    ],
    stock_status: 'in_stock',
    created_at: new Date().toISOString()
  }
];

// Helper: Ensure the local JSON DB directory and file exist
function ensureJsonDb() {
  if (!fs.existsSync(JSON_DB_DIR)) {
    fs.mkdirSync(JSON_DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(JSON_DB_FILE)) {
    const initialDb = {
      orders: [] as Order[],
      products: DEFAULT_PRODUCTS,
      settings: {
        whatsapp_phone: '917970574329',
        support_email: 'hello@nutridates.in'
      }
    };
    fs.writeFileSync(JSON_DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
  }
}

// Helper: Read JSON DB
function readJsonDb() {
  ensureJsonDb();
  try {
    const data = fs.readFileSync(JSON_DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON DB file:', error);
    return { orders: [], products: DEFAULT_PRODUCTS, settings: { whatsapp_phone: '917970574329', support_email: 'hello@nutridates.in' } };
  }
}

// Helper: Write JSON DB
function writeJsonDb(data: any) {
  ensureJsonDb();
  try {
    fs.writeFileSync(JSON_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing JSON DB file:', error);
    return false;
  }
}

// Generate unique order ID: ND-YYYY-XXXX (e.g. ND-2026-1001)
export async function generateOrderId(): Promise<string> {
  const currentYear = new Date().getFullYear();
  let nextNum = 1001;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        const lastId = data[0].id; // Format: ND-YYYY-XXXX
        const parts = lastId.split('-');
        if (parts.length === 3 && parseInt(parts[1]) === currentYear) {
          nextNum = parseInt(parts[2]) + 1;
        }
      }
    } catch {
      // Fall back to JSON count if Supabase table is missing
      const db = readJsonDb();
      if (db.orders && db.orders.length > 0) {
        const lastOrder = db.orders[db.orders.length - 1];
        const parts = lastOrder.id.split('-');
        if (parts.length === 3 && parseInt(parts[1]) === currentYear) {
          nextNum = parseInt(parts[2]) + 1;
        }
      }
    }
  } else {
    const db = readJsonDb();
    if (db.orders && db.orders.length > 0) {
      const lastOrder = db.orders[db.orders.length - 1];
      const parts = lastOrder.id.split('-');
      if (parts.length === 3 && parseInt(parts[1]) === currentYear) {
        nextNum = parseInt(parts[2]) + 1;
      }
    }
  }

  return `ND-${currentYear}-${nextNum}`;
}

// Order Database API Wrapper
export const db = {
  // Check if Supabase connection is fully healthy and has orders table
  async isSupabaseConnected(): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('orders').select('id').limit(1);
      return !error;
    } catch {
      return false;
    }
  },

  // 1. ORDERS CRUD
  async getOrders(): Promise<Order[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as Order[];
      }
      console.warn('Supabase getOrders failed or table missing, using JSON DB fallback:', error?.message);
    }
    const localDb = readJsonDb();
    // Sort descending by created_at
    return [...localDb.orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getOrderById(id: string): Promise<Order | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return data as Order;
      }
      console.warn(`Supabase getOrderById(${id}) failed, trying JSON DB:`, error?.message);
    }
    const localDb = readJsonDb();
    const order = localDb.orders.find((o: Order) => o.id === id);
    return order || null;
  },

  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
    const id = await generateOrderId();
    const newOrder: Order = {
      ...orderData,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .insert([newOrder])
        .select()
        .single();

      if (!error && data) {
        return data as Order;
      }
      console.warn('Supabase createOrder failed, saving to local JSON DB:', error?.message);
    }

    const localDb = readJsonDb();
    localDb.orders.push(newOrder);
    writeJsonDb(localDb);
    return newOrder;
  },

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
    const updated_at = new Date().toISOString();
    const cleanUpdates = { ...updates, updated_at };

    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .update(cleanUpdates)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return data as Order;
      }
      console.warn(`Supabase updateOrder(${id}) failed, trying local JSON DB:`, error?.message);
    }

    const localDb = readJsonDb();
    const idx = localDb.orders.findIndex((o: Order) => o.id === id);
    if (idx !== -1) {
      const updatedOrder = { ...localDb.orders[idx], ...cleanUpdates };
      localDb.orders[idx] = updatedOrder;
      writeJsonDb(localDb);
      return updatedOrder;
    }
    return null;
  },

  // 2. PRODUCTS CRUD
  async getProducts(): Promise<Product[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Product[];
      }
      console.warn('Supabase getProducts failed, using local JSON DB:', error?.message);
    }
    const localDb = readJsonDb();
    return localDb.products || DEFAULT_PRODUCTS;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return data as Product;
      }
      console.warn(`Supabase updateProduct(${id}) failed, trying local JSON DB:`, error?.message);
    }

    const localDb = readJsonDb();
    const idx = localDb.products.findIndex((p: Product) => p.id === id);
    if (idx !== -1) {
      const updatedProduct = { ...localDb.products[idx], ...updates };
      localDb.products[idx] = updatedProduct;
      writeJsonDb(localDb);
      return updatedProduct;
    }
    return null;
  },

  // 3. SETTINGS & WHATSAPP PHONE CONTROLS
  async getSettings(): Promise<StoreSettings> {
    if (supabase) {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'store_settings')
        .single();

      if (!error && data && data.value) {
        return data.value as StoreSettings;
      }
    }
    const localDb = readJsonDb();
    return (localDb.settings || { whatsapp_phone: '917970574329', support_email: 'hello@nutridates.in' }) as StoreSettings;
  },

  async updateSettings(settings: StoreSettings): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase
        .from('settings')
        .upsert({ key: 'store_settings', value: settings, updated_at: new Date().toISOString() });

      if (!error) return true;
      console.warn('Supabase updateSettings failed, trying local JSON DB:', error.message);
    }

    const localDb = readJsonDb();
    localDb.settings = settings;
    return writeJsonDb(localDb);
  },

  async getCoupons(): Promise<Coupon[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'store_coupons')
        .single();

      if (!error && data && data.value) {
        return data.value as Coupon[];
      }
    }
    const localDb = readJsonDb();
    return (localDb.coupons || []) as Coupon[];
  },

  async updateCoupons(coupons: Coupon[]): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase
        .from('settings')
        .upsert({ key: 'store_coupons', value: coupons, updated_at: new Date().toISOString() });

      if (!error) return true;
      console.warn('Supabase updateCoupons failed, trying local JSON DB:', error.message);
    }

    const localDb = readJsonDb();
    localDb.coupons = coupons;
    return writeJsonDb(localDb);
  },

  async resetOrders(): Promise<boolean> {
    if (supabase) {
      // 1. Fetch count before delete to verify actual database state changes
      const { count: beforeCount, error: countError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.warn('Supabase resetOrders: pre-count check failed:', countError.message);
      }

      // 2. Perform delete query
      const { error } = await supabase
        .from('orders')
        .delete()
        .neq('id', '');
        
      if (error) {
        console.error('Supabase resetOrders failed:', error.message);
        throw new Error(`Supabase Database Error: ${error.message}. This is usually caused by Row-Level Security (RLS) policies. Please run the updated SQL setup script containing the DELETE policy in your Supabase SQL Editor.`);
      }

      // 3. Verify if anything was actually deleted (if we had rows before)
      if (beforeCount && beforeCount > 0) {
        const { count: afterCount, error: verifyError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });
        
        if (!verifyError && afterCount && afterCount > 0 && afterCount === beforeCount) {
          // Count hasn't decreased. This happens when RLS silently blocks DELETE on public tables.
          throw new Error(`Supabase RLS Policy Block: Deletion was ignored by the database server. This is caused by a missing Row-Level Security (RLS) policy for DELETE on the 'orders' table. Please go to your Supabase Dashboard, open SQL Editor, and run:\n\nCREATE POLICY "Allow public delete to orders" ON public.orders FOR DELETE TO anon USING (true);`);
        }
      }
    }

    const localDb = readJsonDb();
    localDb.orders = [];
    return writeJsonDb(localDb);
  },

  async testDatabaseConnection(): Promise<{
    supabaseConnected: boolean;
    selectOk: boolean;
    insertOk: boolean;
    updateOk: boolean;
    deleteOk: boolean;
    errorMsg?: string;
  }> {
    if (!supabase) {
      return {
        supabaseConnected: false,
        selectOk: false,
        insertOk: false,
        updateOk: false,
        deleteOk: false,
        errorMsg: 'Supabase URL or Key not set. Running in local JSON DB fallback mode.'
      };
    }

    const testId = `ND-TEST-${Date.now()}`;
    const testOrder: Order = {
      id: testId,
      customer_name: 'DIAGNOSTICS SYSTEM TEST',
      phone: '9999999999',
      email: 'diagnostics@nutridates.in',
      address: 'System Diagnostic test block',
      city: 'Hazaribagh',
      state: 'Jharkhand',
      pincode: '825301',
      total_amount: 1,
      payment_method: 'Test Payment',
      status: 'pending',
      items: [{ id: 'test_item', name: 'Diagnostics Item', price: 1, quantity: 1, size: '250g' }],
      timeline: [{ status: 'pending', timestamp: new Date().toISOString(), note: 'Diagnostics test run.' }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      // 1. Test Select
      const { error: selectError } = await supabase.from('orders').select('id').limit(1);
      const selectOk = !selectError;

      // 2. Test Insert
      const { error: insertError } = await supabase.from('orders').insert([testOrder]);
      const insertOk = !insertError;

      if (!insertOk) {
        return {
          supabaseConnected: true,
          selectOk,
          insertOk: false,
          updateOk: false,
          deleteOk: false,
          errorMsg: `INSERT failed: ${insertError?.message || 'Unknown error'}`
        };
      }

      // 3. Test Update
      const { error: updateError } = await supabase
        .from('orders')
        .update({ customer_name: 'DIAGNOSTICS SYSTEM TEST UPDATED' })
        .eq('id', testId);
      const updateOk = !updateError;

      // 4. Test Delete (Verify by querying since PostgREST doesn't return delete count errors directly)
      const { error: deleteError } = await supabase
        .from('orders')
        .delete()
        .eq('id', testId);
      
      let deleteOk = !deleteError;
      if (deleteOk) {
        const { data: checkData } = await supabase.from('orders').select('id').eq('id', testId);
        if (checkData && checkData.length > 0) {
          deleteOk = false; // The record was not deleted. RLS blocked delete!
        }
      }

      return {
        supabaseConnected: true,
        selectOk,
        insertOk,
        updateOk,
        deleteOk,
        errorMsg: deleteOk ? undefined : 'DELETE was blocked by RLS policies.'
      };
    } catch (err: any) {
      return {
        supabaseConnected: true,
        selectOk: false,
        insertOk: false,
        updateOk: false,
        deleteOk: false,
        errorMsg: `Catch error during diagnostics: ${err.message}`
      };
    }
  }
};

