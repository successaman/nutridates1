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

// Interface definition for Product Size
export interface ProductSize {
  size: string;
  price: number;
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
      { size: '250g', price: 299, in_stock: true },
      { size: '500g', price: 549, in_stock: true },
      { size: '1kg', price: 999, in_stock: true }
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
  async getSettings(): Promise<{ whatsapp_phone: string; support_email: string }> {
    if (supabase) {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'store_settings')
        .single();

      if (!error && data && data.value) {
        return data.value;
      }
    }
    const localDb = readJsonDb();
    return localDb.settings || { whatsapp_phone: '917970574329', support_email: 'hello@nutridates.in' };
  },

  async updateSettings(settings: { whatsapp_phone: string; support_email: string }): Promise<boolean> {
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

  async resetOrders(): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('orders')
          .delete()
          .neq('id', '');
        if (error) {
          console.warn('Supabase resetOrders failed:', error.message);
        }
      } catch (err: any) {
        console.warn('Supabase resetOrders error:', err.message);
      }
    }

    const localDb = readJsonDb();
    localDb.orders = [];
    return writeJsonDb(localDb);
  }
};
