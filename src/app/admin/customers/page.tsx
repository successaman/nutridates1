'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
}

interface Order {
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
  items: OrderItem[];
  created_at: string;
}

interface CustomerProfile {
  name: string;
  phone: string;
  email: string;
  latestCity: string;
  latestState: string;
  latestPincode: string;
  latestAddress: string;
  orderCount: number;
  totalSpent: number;
  latestOrderDate: string;
  orders: Order[];
}

export default function AdminCustomersCRM() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [minSpent, setMinSpent] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'spent_desc' | 'spent_asc' | 'orders_desc' | 'recent'>('spent_desc');

  // Selected customer for history drawer
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(data.orders || []);
        processCustomerProfiles(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching orders for CRM:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const processCustomerProfiles = (orderList: Order[]) => {
    const profileMap: { [phone: string]: CustomerProfile } = {};

    // Sort orders oldest to newest so the latest orders overwrite earlier ones
    const sortedOrders = [...orderList].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    sortedOrders.forEach((order) => {
      const phone = order.phone.replace(/[\s-+]/g, '').trim();
      if (!phone) return;

      if (!profileMap[phone]) {
        profileMap[phone] = {
          name: order.customer_name,
          phone: order.phone,
          email: order.email || 'N/A',
          latestCity: order.city,
          latestState: order.state,
          latestPincode: order.pincode,
          latestAddress: order.address,
          orderCount: 0,
          totalSpent: 0,
          latestOrderDate: order.created_at,
          orders: [],
        };
      }

      const profile = profileMap[phone];
      profile.name = order.customer_name; // latest order name
      profile.email = order.email || profile.email; // latest order email
      profile.latestCity = order.city;
      profile.latestState = order.state;
      profile.latestPincode = order.pincode;
      profile.latestAddress = order.address;
      profile.orderCount += 1;
      // Accumulate spent if order is not cancelled
      if (order.status !== 'cancelled') {
        profile.totalSpent += order.total_amount;
      }
      profile.latestOrderDate = order.created_at;
      profile.orders.push(order);
    });

    // Convert map to list
    const customerList = Object.values(profileMap);
    setCustomers(customerList);
    applyFiltersAndSorting(customerList, searchTerm, minSpent, sortBy);
  };

  const applyFiltersAndSorting = (
    list: CustomerProfile[],
    search: string,
    minAmt: number,
    sortType: typeof sortBy
  ) => {
    let result = [...list];

    // Filter by search text
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.phone.includes(s) ||
          c.email.toLowerCase().includes(s) ||
          c.latestCity.toLowerCase().includes(s) ||
          c.latestState.toLowerCase().includes(s)
      );
    }

    // Filter by min spent
    if (minAmt > 0) {
      result = result.filter((c) => c.totalSpent >= minAmt);
    }

    // Apply sorting
    if (sortType === 'spent_desc') {
      result.sort((a, b) => b.totalSpent - a.totalSpent);
    } else if (sortType === 'spent_asc') {
      result.sort((a, b) => a.totalSpent - b.totalSpent);
    } else if (sortType === 'orders_desc') {
      result.sort((a, b) => b.orderCount - a.orderCount);
    } else if (sortType === 'recent') {
      result.sort(
        (a, b) => new Date(b.latestOrderDate).getTime() - new Date(a.latestOrderDate).getTime()
      );
    }

    setFilteredCustomers(result);
  };

  useEffect(() => {
    applyFiltersAndSorting(customers, searchTerm, minSpent, sortBy);
  }, [searchTerm, minSpent, sortBy, customers]);

  // Aggregate Stats
  const totalCustomers = customers.length;
  const activeRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total_amount, 0);
  const averageLTV = totalCustomers > 0 ? Math.round(activeRevenue / totalCustomers) : 0;

  const getTopCustomer = () => {
    if (customers.length === 0) return null;
    return [...customers].sort((a, b) => b.totalSpent - a.totalSpent)[0];
  };
  const topCustomer = getTopCustomer();

  return (
    <div className="space-y-6 text-[#111111] relative min-h-screen pb-16">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tight">
          Customer CRM Directory
        </h2>
        <p className="text-sm font-semibold text-[#4E3A2E] mt-1 uppercase tracking-wider">
          Track buyer lifecycles, LTV metrics, and coordinate contact details
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Customers */}
        <div className="border-4 border-black bg-white rounded-xl shadow-[4px_4px_0px_0px_#111111] p-5 flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider">
            Total Unique Buyers
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-black">{totalCustomers}</span>
            <span className="text-xs font-bold text-stone-500 uppercase">Profiles</span>
          </div>
          <p className="text-[10px] font-bold text-stone-500 uppercase mt-2">
            Computed from all records
          </p>
        </div>

        {/* Avg LTV */}
        <div className="border-4 border-black bg-[#FF5000] text-white rounded-xl shadow-[4px_4px_0px_0px_#111111] p-5 flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-orange-200 tracking-wider">
            Average Customer LTV
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-white">₹{averageLTV}</span>
            <span className="text-xs font-bold text-orange-200 uppercase">per buyer</span>
          </div>
          <p className="text-[10px] font-bold text-orange-100 uppercase mt-2">
            Excludes cancelled orders
          </p>
        </div>

        {/* Top Customer */}
        <div className="border-4 border-black bg-[#2B1D14] text-white rounded-xl shadow-[4px_4px_0px_0px_#111111] p-5 flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider">
            Top Spending Buyer
          </span>
          {topCustomer ? (
            <div className="mt-2">
              <p className="text-lg font-black uppercase tracking-tight truncate">
                {topCustomer.name}
              </p>
              <p className="text-xs font-bold text-[#FF5000] uppercase mt-0.5">
                Spent: ₹{topCustomer.totalSpent} ({topCustomer.orderCount} Orders)
              </p>
            </div>
          ) : (
            <p className="text-xs font-bold text-stone-500 uppercase mt-4">No data available</p>
          )}
          <p className="text-[10px] font-bold text-stone-400 uppercase mt-2">
            Highest cumulative value
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b-2 border-black pb-4 pt-2">
        {/* Search Input */}
        <div className="w-full lg:max-w-xs">
          <label className="block text-[9px] font-black uppercase text-stone-500 mb-1">
            Search Directory
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Name, Phone, Email, Location..."
            className="w-full border-2 border-black rounded-lg px-4 py-2 text-xs bg-white text-black font-semibold focus:outline-hidden focus:border-[#FF5000]"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 flex-1 justify-end">
          {/* Min Spending Filter */}
          <div className="w-full sm:max-w-[180px]">
            <label className="block text-[9px] font-black uppercase text-stone-500 mb-1">
              Min Spending (₹{minSpent})
            </label>
            <input
              type="range"
              min="0"
              max="10000"
              step="250"
              value={minSpent}
              onChange={(e) => setMinSpent(Number(e.target.value))}
              className="w-full accent-[#FF5000] cursor-pointer"
            />
          </div>

          {/* Sort selector */}
          <div className="w-full sm:max-w-[200px]">
            <label className="block text-[9px] font-black uppercase text-stone-500 mb-1">
              Sort Customers
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full border-2 border-black rounded-lg px-3 py-2 text-xs bg-white text-black font-bold uppercase focus:outline-hidden"
            >
              <option value="spent_desc">Highest Spent (LTV)</option>
              <option value="spent_asc">Lowest Spent</option>
              <option value="orders_desc">Most Orders Count</option>
              <option value="recent">Recent Purchases</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Customers CRM Table */}
      {loading ? (
        <div className="border-4 border-black bg-white rounded-xl p-16 text-center shadow-[6px_6px_0px_0px_#111111]">
          <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-[#FF5000] rounded-full mx-auto mb-4" />
          <p className="text-xs font-black uppercase text-black">Compiling customer database...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="border-4 border-black bg-white rounded-xl p-16 text-center shadow-[6px_6px_0px_0px_#111111] text-xs font-bold text-stone-400 uppercase">
          No customer profiles match your filters.
        </div>
      ) : (
        <div className="border-4 border-black bg-white rounded-xl shadow-[6px_6px_0px_0px_#111111] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold text-[#4E3A2E]">
              <thead>
                <tr className="border-b-4 border-black bg-[#2B1D14] text-white uppercase text-[10px] tracking-wider">
                  <th className="p-4 border-r-2 border-black">Customer Name</th>
                  <th className="p-4 border-r-2 border-black">Phone Number</th>
                  <th className="p-4 border-r-2 border-black">Email Address</th>
                  <th className="p-4 border-r-2 border-black">Latest Location</th>
                  <th className="p-4 border-r-2 border-black text-center">Orders Count</th>
                  <th className="p-4 border-r-2 border-black">Lifetime LTV</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.phone}
                    className="border-b border-stone-200 last:border-0 hover:bg-[#F9F7F5] transition-colors"
                  >
                    <td className="p-4 border-r border-stone-200 text-black font-extrabold uppercase">
                      {customer.name}
                    </td>
                    <td className="p-4 border-r border-stone-200 font-mono">{customer.phone}</td>
                    <td className="p-4 border-r border-stone-200 text-stone-600">{customer.email}</td>
                    <td className="p-4 border-r border-stone-200 uppercase">
                      {customer.latestCity}, {customer.latestState}
                    </td>
                    <td className="p-4 border-r border-stone-200 text-center font-black text-black">
                      {customer.orderCount}
                    </td>
                    <td className="p-4 border-r border-stone-200 text-[#FF5000] font-black text-sm">
                      ₹{customer.totalSpent}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="bg-black hover:bg-[#FF5000] text-white px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-wider cursor-pointer border border-black shadow-[2px_2px_0px_0px_#FF5000]"
                      >
                        Order History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Purchase History Drawer overlay */}
      <AnimatePresence>
        {selectedCustomer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
              className="fixed inset-0 bg-black z-45"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white border-l-4 border-black z-50 p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-black pb-4">
                  <div>
                    <span className="inline-block border border-black bg-[#FF5000] text-white text-[9px] font-black tracking-widest uppercase px-2 py-0.5 mb-1.5">
                      CRM Record File
                    </span>
                    <h3 className="text-xl font-black uppercase tracking-tight text-black">
                      Profile: {selectedCustomer.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="text-stone-500 hover:text-black font-black uppercase text-[10px] cursor-pointer border-2 border-transparent hover:border-black rounded px-2.5 py-1"
                  >
                    ✕ Close
                  </button>
                </div>

                {/* Customer Contact & Meta Data */}
                <div className="border-2 border-black rounded-lg p-4 bg-[#F9F7F5] space-y-2 text-xs font-semibold">
                  <p>
                    <span className="font-extrabold uppercase text-[#111111]">Primary Name:</span>{' '}
                    {selectedCustomer.name}
                  </p>
                  <p>
                    <span className="font-extrabold uppercase text-[#111111]">Active Phone:</span>{' '}
                    {selectedCustomer.phone}
                  </p>
                  <p>
                    <span className="font-extrabold uppercase text-[#111111]">Email Address:</span>{' '}
                    {selectedCustomer.email}
                  </p>
                  <p>
                    <span className="font-extrabold uppercase text-[#111111]">Latest Address:</span>{' '}
                    <span className="uppercase text-stone-600 block leading-normal mt-0.5">
                      {selectedCustomer.latestAddress}, {selectedCustomer.latestCity},{' '}
                      {selectedCustomer.latestState} - {selectedCustomer.latestPincode}
                    </span>
                  </p>
                </div>

                {/* LTV & Orders Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-2 border-black rounded-lg p-3 bg-stone-50 text-center">
                    <span className="text-[9px] font-black uppercase text-stone-400">
                      Total Valid LTV
                    </span>
                    <p className="text-xl font-black text-[#FF5000] mt-0.5">
                      ₹{selectedCustomer.totalSpent}
                    </p>
                  </div>
                  <div className="border-2 border-black rounded-lg p-3 bg-stone-50 text-center">
                    <span className="text-[9px] font-black uppercase text-stone-400">
                      All Orders Count
                    </span>
                    <p className="text-xl font-black text-black mt-0.5">
                      {selectedCustomer.orderCount}
                    </p>
                  </div>
                </div>

                {/* Orders Timeline feed for this customer */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] font-black uppercase text-stone-400 tracking-widest">
                    Orders Purchases History
                  </h4>
                  <div className="space-y-3">
                    {selectedCustomer.orders.map((order) => (
                      <div
                        key={order.id}
                        className="border-2 border-black rounded-lg p-4 bg-white shadow-[2px_2px_0px_0px_#111111] space-y-2 text-xs"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-black">{order.id}</span>
                          <span
                            className={`inline-block border px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                              order.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : order.status === 'cancelled'
                                ? 'bg-red-100 text-red-800 border-red-300'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-stone-500 font-bold">
                          <span>{new Date(order.created_at).toLocaleString()}</span>
                          <span>₹{order.total_amount}</span>
                        </div>
                        <div className="border-t border-stone-100 pt-1.5 text-[10px] font-bold text-stone-700">
                          Items:{' '}
                          {order.items.map((i) => `${i.name} (${i.size}) × ${i.quantity}`).join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
