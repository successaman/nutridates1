'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  customer_name: string;
  phone: string;
  total_amount: number;
  payment_method: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  city: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    aov: 0
  });

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (res.ok && data.success) {
        const orderList: Order[] = data.orders || [];
        setOrders(orderList);
        calculateStats(orderList);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const calculateStats = (orderList: Order[]) => {
    const activeOrders = orderList.filter(o => o.status !== 'cancelled');
    const totalSales = activeOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    const totalOrders = orderList.length;
    const pendingOrders = orderList.filter(o => o.status === 'pending').length;
    const aov = activeOrders.length > 0 ? totalSales / activeOrders.length : 0;

    setStats({
      totalSales,
      totalOrders,
      pendingOrders,
      aov
    });
  };

  const handleGenerateTestData = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/orders/generate-test', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Successfully generated 25 realistic mock orders across Hazaribagh, Ranchi, Jamshedpur, Patna, Delhi and Mumbai!');
        await fetchDashboardData();
      } else {
        alert('Failed to generate test data: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to mock generator api.');
    } finally {
      setGenerating(false);
    }
  };

  const handleResetOrders = async () => {
    const confirmReset = window.confirm('WARNING: Are you sure you want to delete all orders? This will wipe out all mock/test orders and cannot be undone!');
    if (!confirmReset) return;

    setResetting(true);
    try {
      const res = await fetch('/api/orders/reset', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('All orders have been successfully cleared from the database.');
        await fetchDashboardData();
      } else {
        alert('Failed to reset orders: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to reset API.');
    } finally {
      setResetting(false);
    }
  };

  // Group sales by date for charts
  const getSalesTimelineData = () => {
    const datesMap: Record<string, number> = {};
    const sortedOrders = [...orders]
      .filter(o => o.status !== 'cancelled')
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    sortedOrders.forEach(o => {
      const dateStr = new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      datesMap[dateStr] = (datesMap[dateStr] || 0) + Number(o.total_amount);
    });

    // Convert to array
    return Object.entries(datesMap).slice(-8); // Get last 8 days of sales
  };

  // Get orders by city for geographical breakdown
  const getCityDistribution = () => {
    const cityMap: Record<string, number> = {};
    orders.forEach(o => {
      cityMap[o.city] = (cityMap[o.city] || 0) + 1;
    });

    return Object.entries(cityMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // top 5 cities
  };

  const salesTimeline = getSalesTimelineData();
  const topCities = getCityDistribution();

  // Find max sales value to scale the SVG chart bars
  const maxSalesVal = salesTimeline.length > 0 ? Math.max(...salesTimeline.map(item => item[1])) : 100;

  return (
    <div className="space-y-8 text-[#111111]">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-sm font-semibold text-[#4E3A2E] mt-1 uppercase tracking-wider">
            Real-time shop status & process metrics
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleGenerateTestData}
            disabled={generating || resetting}
            className="bg-[#2B1D14] hover:bg-black text-white border-2 border-black rounded-lg px-5 py-3 text-xs font-black uppercase tracking-widest cursor-pointer shadow-[3px_3px_0px_0px_#FF5000] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {generating ? '⚙️ Generating...' : '⚡ Generate Test Orders'}
          </button>

          <button
            onClick={handleResetOrders}
            disabled={generating || resetting}
            className="bg-red-600 hover:bg-red-700 text-white border-2 border-black rounded-lg px-5 py-3 text-xs font-black uppercase tracking-widest cursor-pointer shadow-[3px_3px_0px_0px_#111111] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {resetting ? '🗑️ Resetting...' : '🗑️ Reset Orders'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="border-4 border-black bg-white rounded-xl p-16 text-center shadow-[6px_6px_0px_0px_#111111]">
          <div className="animate-spin h-10 w-10 border-4 border-t-transparent border-[#FF5000] rounded-full mx-auto mb-4" />
          <p className="text-xs font-black uppercase text-black">Compiling Business Metrics...</p>
        </div>
      ) : (
        <>
          {/* KPI Metrics Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Sales Card */}
            <div className="border-4 border-black bg-white p-5 rounded-xl shadow-[4px_4px_0px_0px_#111111] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Total Sales</span>
                <p className="text-3xl font-black uppercase tracking-tight text-[#FF5000] mt-2">
                  ₹{stats.totalSales.toLocaleString('en-IN')}
                </p>
              </div>
              <span className="text-[10px] font-bold text-stone-500 mt-4 uppercase">Excludes Cancelled Orders</span>
            </div>

            {/* Total Orders Card */}
            <div className="border-4 border-black bg-white p-5 rounded-xl shadow-[4px_4px_0px_0px_#111111] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Total Orders</span>
                <p className="text-3xl font-black uppercase tracking-tight text-black mt-2">
                  {stats.totalOrders}
                </p>
              </div>
              <span className="text-[10px] font-bold text-stone-500 mt-4 uppercase">All lifetime submissions</span>
            </div>

            {/* Pending Orders Card */}
            <div className="border-4 border-black bg-white p-5 rounded-xl shadow-[4px_4px_0px_0px_#111111] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Pending Confirmation</span>
                <p className="text-3xl font-black uppercase tracking-tight text-amber-500 mt-2">
                  {stats.pendingOrders}
                </p>
              </div>
              <span className="text-[10px] font-bold text-stone-500 mt-4 uppercase">Needs status update</span>
            </div>

            {/* AOV Card */}
            <div className="border-4 border-black bg-white p-5 rounded-xl shadow-[4px_4px_0px_0px_#111111] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Avg Order Value (AOV)</span>
                <p className="text-3xl font-black uppercase tracking-tight text-[#3A2415] mt-2">
                  ₹{Math.round(stats.aov)}
                </p>
              </div>
              <span className="text-[10px] font-bold text-stone-500 mt-4 uppercase">Average ticket size</span>
            </div>
          </div>

          {/* Interactive SVG Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Chart (2/3 width) */}
            <div className="border-4 border-black bg-white p-6 rounded-xl shadow-[6px_6px_0px_0px_#111111] lg:col-span-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#FF5000] mb-6">
                📈 Sales Timeline (Recent Days)
              </h3>
              
              {salesTimeline.length === 0 ? (
                <div className="h-48 flex items-center justify-center border-2 border-dashed border-stone-200 rounded-lg text-xs font-bold text-stone-400 uppercase">
                  No sales data to display. Generate mock orders above!
                </div>
              ) : (
                <div className="flex flex-col">
                  {/* SVG Bar Chart */}
                  <div className="flex items-end gap-3 h-52 border-b-2 border-l-2 border-black px-4 pb-2">
                    {salesTimeline.map(([date, amount]) => {
                      // Calculate height percent
                      const pct = maxSalesVal > 0 ? (amount / maxSalesVal) * 80 : 0;
                      return (
                        <div key={date} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                          {/* Tooltip */}
                          <div className="absolute top-[-30px] hidden group-hover:block border-2 border-black bg-white text-[10px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded shadow-sm z-10">
                            ₹{amount}
                          </div>
                          {/* Bar */}
                          <div 
                            className="w-full bg-[#FF5000] border-2 border-black rounded-t transition-all hover:bg-[#3A2415]" 
                            style={{ height: `${Math.max(5, pct)}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  {/* Labels */}
                  <div className="flex justify-between items-center gap-3 px-4 pt-2 text-[9px] font-black uppercase text-stone-500">
                    {salesTimeline.map(([date]) => (
                      <span key={date} className="flex-1 text-center truncate">{date}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Geographical Distribution (1/3 width) */}
            <div className="border-4 border-black bg-white p-6 rounded-xl shadow-[6px_6px_0px_0px_#111111]">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#FF5000] mb-6">
                📍 Geographic Order Split
              </h3>
              {topCities.length === 0 ? (
                <div className="h-48 flex items-center justify-center border-2 border-dashed border-stone-200 rounded-lg text-xs font-bold text-stone-400 uppercase">
                  No city data.
                </div>
              ) : (
                <div className="space-y-4">
                  {topCities.map(([city, count], idx) => {
                    const total = orders.length;
                    const percent = Math.round((count / total) * 100);
                    // Harmonious colors
                    const barColors = ['bg-[#FF5000]', 'bg-[#3A2415]', 'bg-amber-500', 'bg-emerald-600', 'bg-stone-500'];
                    return (
                      <div key={city} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-stone-700">
                          <span className="uppercase font-black text-black">{city}</span>
                          <span>{count} orders ({percent}%)</span>
                        </div>
                        <div className="h-3 border-2 border-black rounded bg-stone-100 overflow-hidden">
                          <div 
                            className={`h-full border-r-2 border-black ${barColors[idx % barColors.length]}`} 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Recent Orders table */}
          <div className="border-4 border-black bg-white rounded-xl shadow-[6px_6px_0px_0px_#111111] overflow-hidden">
            <div className="bg-[#F9F7F5] border-b-4 border-black px-6 py-4 flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#111111]">
                📦 Recent Orders Feed
              </h3>
              <Link 
                href="/admin/orders" 
                className="text-xs font-black uppercase tracking-wider text-[#FF5000] hover:underline"
              >
                View All Orders →
              </Link>
            </div>
            
            {orders.length === 0 ? (
              <div className="p-8 text-center text-xs font-semibold text-stone-400 uppercase">
                No orders placed yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-bold text-[#4E3A2E]">
                  <thead>
                    <tr className="border-b-2 border-black bg-stone-50 uppercase text-[10px] tracking-wider text-black">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">City</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => {
                      const statusColors = {
                        pending: 'bg-amber-100 text-amber-800 border-amber-300',
                        confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
                        shipped: 'bg-indigo-100 text-indigo-800 border-indigo-300',
                        delivered: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                        cancelled: 'bg-red-100 text-red-800 border-red-300'
                      };

                      return (
                        <tr key={order.id} className="border-b border-stone-200 last:border-0 hover:bg-[#FDFCFB] transition-colors">
                          <td className="p-4 text-black font-extrabold">{order.id}</td>
                          <td className="p-4 uppercase text-[#111111]">{order.customer_name}</td>
                          <td className="p-4">{order.phone}</td>
                          <td className="p-4 uppercase">{order.city}</td>
                          <td className="p-4 text-[#FF5000] font-extrabold">₹{order.total_amount}</td>
                          <td className="p-4 text-center">
                            <span className={`inline-block border px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${statusColors[order.status] || ''}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 text-stone-400 font-semibold">
                            {new Date(order.created_at).toLocaleDateString('en-IN')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
