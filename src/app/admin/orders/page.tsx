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

interface TimelineEvent {
  status: string;
  timestamp: string;
  note: string;
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
  timeline: TimelineEvent[];
  created_at: string;
  updated_at: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | Order['status']>('all');
  
  // Drawer states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Shipping input states
  const [carrier, setCarrier] = useState('DTDC Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [showShipInput, setShowShipInput] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'manual' | 'shiprocket'>('shiprocket');
  const [shiprocketData, setShiprocketData] = useState<{ tracking_number: string, courier_name: string, shipping_charge: number, est_delivery: string, weight_kg: number } | null>(null);
  const [bookingLabel, setBookingLabel] = useState(false);
  const [printType, setPrintType] = useState<'invoice' | 'label'>('invoice');

  // Cancellation input states
  const [cancelReason, setCancelReason] = useState('Customer request');
  const [showCancelInput, setShowCancelInput] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(data.orders || []);
        applyFilters(data.orders || [], searchTerm, activeTab);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const applyFilters = (orderList: Order[], search: string, tab: string) => {
    let result = [...orderList];

    // Filter by Tab (Status)
    if (tab !== 'all') {
      result = result.filter(o => o.status === tab);
    }

    // Filter by Search Query
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(s) ||
        o.customer_name.toLowerCase().includes(s) ||
        o.phone.includes(s) ||
        o.city.toLowerCase().includes(s)
      );
    }

    setFilteredOrders(result);
  };

  useEffect(() => {
    applyFilters(orders, searchTerm, activeTab);
  }, [searchTerm, activeTab, orders]);

  // Handle Order Status Update
  const updateOrderStatus = async (status: Order['status'], customNote?: string) => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          note: customNote || `Order status updated to ${status}.`
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSelectedOrder(data.order);
        // Refresh orders list
        await fetchOrders();
        // Reset states
        setShowShipInput(false);
        setShowCancelInput(false);
      } else {
        alert('Failed to update status: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error updating order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleShiprocketBooking = async () => {
    if (!selectedOrder) return;
    setBookingLabel(true);
    try {
      const res = await fetch('/api/shipping/shiprocket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: selectedOrder.id })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShiprocketData(data);
        setCarrier(data.courier_name);
        setTrackingNumber(data.tracking_number);
      } else {
        alert('Shiprocket Booking failed: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to Shiprocket service.');
    } finally {
      setBookingLabel(false);
    }
  };

  const getTrackingInfo = (order: Order) => {
    const shipEvent = order.timeline.find(t => t.status === 'shipped' && t.note.includes('Tracking'));
    if (!shipEvent) return null;
    
    const note = shipEvent.note;
    if (note.includes('[Fulfillment Info]')) {
      const carrierMatch = note.match(/Carrier:\s*([^|]+)/);
      const trackingMatch = note.match(/Tracking:\s*([^|]+)/);
      const estMatch = note.match(/Est:\s*([^|]+)/);
      const weightMatch = note.match(/Weight:\s*([^|]+)/);
      
      return {
        carrier: carrierMatch ? carrierMatch[1].trim() : 'Delhivery',
        tracking: trackingMatch ? trackingMatch[1].trim() : 'N/A',
        est: estMatch ? estMatch[1].trim() : '3-5 days',
        weight: weightMatch ? weightMatch[1].trim() : '0.5kg'
      };
    } else {
      const carrierMatch = note.match(/handed over to\s+([^.]+)/);
      const trackingMatch = note.match(/Tracking:\s*(.+)$/);
      return {
        carrier: carrierMatch ? carrierMatch[1].trim() : 'Carrier',
        tracking: trackingMatch ? trackingMatch[1].trim() : 'N/A',
        est: '3-5 days',
        weight: '0.5kg'
      };
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    const badges = {
      pending: 'bg-amber-100 text-amber-800 border-amber-300',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      shipped: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      delivered: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300'
    };
    return badges[status] || '';
  };

  return (
    <>
      <div className="space-y-6 text-[#111111] relative min-h-screen pb-16 print:hidden">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tight">
          Orders Feed
        </h2>
        <p className="text-sm font-semibold text-[#4E3A2E] mt-1 uppercase tracking-wider">
          Review, confirm and fulfill purchases
        </p>
      </div>

      {/* Search & Tabs Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-2 border-black pb-4">
        {/* Search */}
        <div className="w-full sm:max-w-xs">
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ID, Name, Phone or City..."
            className="w-full border-2 border-black rounded-lg px-4 py-2 text-xs bg-white text-black font-semibold focus:outline-hidden focus:border-[#FF5000]"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg border-2 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab
                  ? 'border-black bg-[#FF5000] text-white shadow-[2px_2px_0px_0px_#111111]'
                  : 'border-stone-300 bg-white text-[#4E3A2E] hover:border-black'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Grid */}
      {loading ? (
        <div className="border-4 border-black bg-white rounded-xl p-16 text-center shadow-[6px_6px_0px_0px_#111111]">
          <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-[#FF5000] rounded-full mx-auto mb-4" />
          <p className="text-xs font-black uppercase text-black">Compiling orders history...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="border-4 border-black bg-white rounded-xl p-16 text-center shadow-[6px_6px_0px_0px_#111111] text-xs font-bold text-stone-400 uppercase">
          No orders match your query.
        </div>
      ) : (
        <div className="border-4 border-black bg-white rounded-xl shadow-[6px_6px_0px_0px_#111111] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold text-[#4E3A2E]">
              <thead>
                <tr className="border-b-4 border-black bg-[#2B1D14] text-white uppercase text-[10px] tracking-wider">
                  <th className="p-4 border-r-2 border-black">Order ID</th>
                  <th className="p-4 border-r-2 border-black">Customer Name</th>
                  <th className="p-4 border-r-2 border-black">Phone</th>
                  <th className="p-4 border-r-2 border-black">City & State</th>
                  <th className="p-4 border-r-2 border-black text-center">Items (Size)</th>
                  <th className="p-4 border-r-2 border-black">Amount</th>
                  <th className="p-4 border-r-2 border-black text-center">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-stone-200 last:border-0 hover:bg-[#F9F7F5] transition-colors">
                    <td className="p-4 border-r border-stone-200 text-black font-extrabold">{order.id}</td>
                    <td className="p-4 border-r border-stone-200 uppercase text-[#111111]">{order.customer_name}</td>
                    <td className="p-4 border-r border-stone-200">{order.phone}</td>
                    <td className="p-4 border-r border-stone-200 uppercase">
                      {order.city}, {order.state}
                    </td>
                    <td className="p-4 border-r border-stone-200 text-center font-bold">
                      {order.items.map(i => `${i.quantity}×${i.size}`).join(', ')}
                    </td>
                    <td className="p-4 border-r border-stone-200 text-[#FF5000] font-black">₹{order.total_amount}</td>
                    <td className="p-4 border-r border-stone-200 text-center">
                      <span className={`inline-block border px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-black hover:bg-[#FF5000] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider cursor-pointer border border-black shadow-[2px_2px_0px_0px_#FF5000]"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-out Order Details Drawer overlay */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black z-40"
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
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b-2 border-black pb-4">
                  <div>
                    <span className="inline-block border border-black bg-[#FF5000] text-white text-[9px] font-black tracking-widest uppercase px-2 py-0.5 mb-1.5">
                      Fulfillment Drawer
                    </span>
                    <h3 className="text-xl font-black uppercase tracking-tight text-black">
                      Order Details: {selectedOrder.id}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setPrintType('invoice');
                        setTimeout(() => window.print(), 150);
                      }}
                      className="bg-[#FF5000] hover:bg-[#E04700] text-white border-2 border-black rounded px-2.5 py-1 text-[10px] font-black uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_#111111] transition-transform active:translate-y-0.5"
                    >
                      🖨️ Print Invoice
                    </button>
                    
                    {(selectedOrder.status === 'shipped' || selectedOrder.timeline.some(t => t.note.includes('Tracking'))) && (
                      <button
                        onClick={() => {
                          setPrintType('label');
                          setTimeout(() => window.print(), 150);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white border-2 border-black rounded px-2.5 py-1 text-[10px] font-black uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_#111111] transition-transform active:translate-y-0.5"
                      >
                        🏷️ Print Shipping Label
                      </button>
                    )}
                    
                    <button 
                      onClick={() => setSelectedOrder(null)}
                      className="text-stone-500 hover:text-black font-black uppercase text-[10px] cursor-pointer border-2 border-transparent hover:border-black rounded px-2.5 py-1"
                    >
                      ✕ Close
                    </button>
                  </div>
                </div>

                {/* Status Badging */}
                <div className="flex justify-between items-center bg-[#F9F7F5] border-2 border-black p-4 rounded-lg">
                  <div className="text-xs font-black uppercase text-stone-500">
                    Status: <span className={`inline-block border px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${getStatusBadge(selectedOrder.status)} ml-1`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-stone-400">
                    Received: {new Date(selectedOrder.created_at).toLocaleString()}
                  </span>
                </div>

                {/* Customer info card */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-stone-400 tracking-widest">
                    Customer & Delivery Details
                  </h4>
                  <div className="border-2 border-black rounded-lg p-4 space-y-2 text-xs font-semibold">
                    <p><span className="font-extrabold uppercase text-[#111111]">Name:</span> {selectedOrder.customer_name}</p>
                    <p><span className="font-extrabold uppercase text-[#111111]">Phone:</span> {selectedOrder.phone}</p>
                    {selectedOrder.email && <p><span className="font-extrabold uppercase text-[#111111]">Email:</span> {selectedOrder.email}</p>}
                    <p className="leading-relaxed">
                      <span className="font-extrabold uppercase text-[#111111]">Address:</span><br />
                      {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}
                    </p>
                  </div>
                </div>

                {/* Items & billing */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-stone-400 tracking-widest">
                    Items & Pricing
                  </h4>
                  <div className="border-2 border-black rounded-lg p-4 divide-y border-stone-100 text-xs">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 font-bold">
                        <div>
                          <span className="font-black text-[#111111] uppercase">{item.name}</span>
                          <span className="text-[10px] font-bold text-stone-500 block uppercase">{item.size} Pack</span>
                        </div>
                        <span>{item.quantity} × ₹{item.price}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-2 font-bold text-stone-600">
                      <span>Shipping</span>
                      <span className="text-emerald-600 uppercase font-black">Free</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t-2 border-black font-black text-sm uppercase text-[#111111]">
                      <span>Grand Total</span>
                      <span className="text-[#FF5000]">₹{selectedOrder.total_amount}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 text-[10px] font-bold text-stone-500">
                      <span>Method</span>
                      <span>{selectedOrder.payment_method}</span>
                    </div>
                  </div>
                </div>

                {/* Process Timeline Controls */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] font-black uppercase text-stone-400 tracking-widest">
                    Timeline Process Controls
                  </h4>
                  
                  {selectedOrder.status === 'cancelled' ? (
                    <div className="border-2 border-red-500 bg-red-50 text-red-700 p-4 rounded-lg text-xs font-semibold">
                      This order has been cancelled and cannot be edited.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {/* Confirm Order */}
                      {selectedOrder.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus('confirmed', 'Order confirmed by administrator.')}
                          disabled={isUpdating}
                          className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-black rounded-lg px-4 py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_#111111] transition-transform active:translate-y-0"
                        >
                          Confirm Order
                        </button>
                      )}

                      {/* Ship Order trigger */}
                      {(selectedOrder.status === 'pending' || selectedOrder.status === 'confirmed') && !showShipInput && (
                        <button
                          onClick={() => setShowShipInput(true)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white border-2 border-black rounded-lg px-4 py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_#111111]"
                        >
                          Ship Package
                        </button>
                      )}

                      {/* Deliver Order */}
                      {selectedOrder.status === 'shipped' && (
                        <button
                          onClick={() => updateOrderStatus('delivered', 'Package successfully delivered and paid.')}
                          disabled={isUpdating}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-black rounded-lg px-4 py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_#111111]"
                        >
                          Mark Delivered
                        </button>
                      )}

                      {/* Cancel Order trigger */}
                      {selectedOrder.status !== 'delivered' && !showCancelInput && (
                        <button
                          onClick={() => setShowCancelInput(true)}
                          className="bg-red-600 hover:bg-red-700 text-white border-2 border-black rounded-lg px-4 py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_#111111]"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  )}

                  {/* Input forms for Shipping / Cancellation details */}
                  {showShipInput && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-2 border-black rounded-lg p-4 bg-indigo-50/50 space-y-4 text-xs"
                    >
                      <div className="flex justify-between items-center border-b border-indigo-200 pb-2">
                        <span className="font-extrabold uppercase text-[#111111]">Select Shipping Method</span>
                        <div className="flex gap-1 bg-white border border-black rounded p-0.5">
                          <button
                            type="button"
                            onClick={() => setShippingMethod('shiprocket')}
                            className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider transition-colors ${
                              shippingMethod === 'shiprocket' ? 'bg-[#FF5000] text-white' : 'text-stone-600'
                            }`}
                          >
                            Shiprocket API
                          </button>
                          <button
                            type="button"
                            onClick={() => setShippingMethod('manual')}
                            className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider transition-colors ${
                              shippingMethod === 'manual' ? 'bg-[#FF5000] text-white' : 'text-stone-600'
                            }`}
                          >
                            Manual
                          </button>
                        </div>
                      </div>

                      {shippingMethod === 'shiprocket' ? (
                        <div className="space-y-3">
                          <p className="font-semibold text-stone-600 leading-normal">
                            Automatically book carrier, calculate weight, and generate a printable shipping label.
                          </p>
                          {!shiprocketData ? (
                            <button
                              type="button"
                              onClick={handleShiprocketBooking}
                              disabled={bookingLabel}
                              className="w-full bg-[#FF5000] text-white border-2 border-black rounded py-2 font-black uppercase text-[10px] tracking-wider shadow-[2px_2px_0px_0px_#111111] transition-transform active:translate-y-0.5"
                            >
                              {bookingLabel ? '⚙️ Contacting Shiprocket...' : '⚡ Generate Shiprocket Shipment'}
                            </button>
                          ) : (
                            <div className="border border-indigo-200 bg-white p-3 rounded space-y-2 leading-relaxed">
                              <p><span className="font-bold text-black uppercase">Courier:</span> {shiprocketData.courier_name}</p>
                              <p><span className="font-bold text-black uppercase">AWB/Tracking:</span> {shiprocketData.tracking_number}</p>
                              <p><span className="font-bold text-black uppercase">Estimated Weight:</span> {shiprocketData.weight_kg} kg</p>
                              <p><span className="font-bold text-black uppercase">Charge:</span> ₹{shiprocketData.shipping_charge}</p>
                              <p><span className="font-bold text-black uppercase">Delivery:</span> {shiprocketData.est_delivery}</p>
                            </div>
                          )}

                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => {
                                if (!shiprocketData) {
                                  alert('Please generate the shipment details first.');
                                  return;
                                }
                                updateOrderStatus(
                                  'shipped',
                                  `[Fulfillment Info] Carrier: ${shiprocketData.courier_name} | Tracking: ${shiprocketData.tracking_number} | Est: ${shiprocketData.est_delivery} | Weight: ${shiprocketData.weight_kg}kg`
                                );
                              }}
                              disabled={isUpdating || !shiprocketData}
                              className="bg-indigo-600 text-white border-2 border-black rounded px-3 py-1.5 font-bold uppercase text-[10px] disabled:opacity-50"
                            >
                              Confirm Dispatch
                            </button>
                            <button
                              onClick={() => {
                                setShiprocketData(null);
                                setShowShipInput(false);
                              }}
                              className="bg-white text-stone-600 border-2 border-stone-300 rounded px-3 py-1.5 font-bold uppercase text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[9px] font-black uppercase text-stone-500 mb-1">Carrier Name</label>
                            <input 
                              type="text"
                              value={carrier}
                              onChange={(e) => setCarrier(e.target.value)}
                              className="w-full border-2 border-black rounded px-2.5 py-1.5 bg-white text-black font-semibold text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black uppercase text-stone-500 mb-1">Tracking Code</label>
                            <input 
                              type="text"
                              value={trackingNumber}
                              onChange={(e) => setTrackingNumber(e.target.value)}
                              placeholder="e.g. DTDC8734208"
                              className="w-full border-2 border-black rounded px-2.5 py-1.5 bg-white text-black font-semibold text-xs"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateOrderStatus('shipped', `[Fulfillment Info] Carrier: ${carrier} | Tracking: ${trackingNumber || 'N/A'} | Est: 3-5 Days | Weight: 0.50kg`)}
                              disabled={isUpdating}
                              className="bg-indigo-600 text-white border-2 border-black rounded px-3 py-1.5 font-bold uppercase text-[10px]"
                            >
                              Confirm Dispatch
                            </button>
                            <button
                              onClick={() => setShowShipInput(false)}
                              className="bg-white text-stone-600 border-2 border-stone-300 rounded px-3 py-1.5 font-bold uppercase text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {showCancelInput && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-2 border-black rounded-lg p-4 bg-red-50/50 space-y-4 text-xs"
                    >
                      <p className="font-extrabold uppercase text-[#111111]">Specify Reason for Cancellation</p>
                      <div>
                        <input 
                          type="text"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          placeholder="e.g. Out of stock / Customer requested change"
                          className="w-full border-2 border-black rounded px-2.5 py-1.5 bg-white text-black font-semibold"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateOrderStatus('cancelled', `Cancelled: ${cancelReason}`)}
                          disabled={isUpdating}
                          className="bg-red-600 text-white border-2 border-black rounded px-3 py-1.5 font-bold uppercase text-[10px]"
                        >
                          Confirm Cancel
                        </button>
                        <button
                          onClick={() => setShowCancelInput(false)}
                          className="bg-white text-stone-600 border-2 border-stone-300 rounded px-3 py-1.5 font-bold uppercase text-[10px]"
                        >
                          Back
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Timeline display in drawer */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] font-black uppercase text-stone-400 tracking-widest">
                    Order Timeline Log
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.timeline.map((event, idx) => (
                      <div key={idx} className="flex gap-2.5 text-[11px] leading-relaxed font-semibold">
                        <div className="h-1.5 w-1.5 rounded-full bg-black shrink-0 mt-1.5" />
                        <div>
                          <span className="font-extrabold uppercase text-black">[{event.status}]</span>{' '}
                          <span className="text-stone-600">{event.note}</span>
                          <span className="text-[9px] text-stone-400 block mt-0.5">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
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

    {/* Printable Invoice & Shipping Label Container (Only rendered in printing) */}
    {selectedOrder && (
      <div className="hidden print:block bg-white text-black p-4 font-sans w-full max-w-[800px] mx-auto text-xs" style={{ boxSizing: 'border-box', pageBreakAfter: 'avoid' }}>
        {printType === 'label' ? (
          <div className="flex flex-col border-4 border-black p-6 rounded-2xl bg-white max-w-[450px] mx-auto space-y-4 shadow-[4px_4px_0px_0px_#111111]">
            <style dangerouslySetInnerHTML={{ __html: `
              @media print {
                html, body {
                  background-color: #fff !important;
                  color: #000 !important;
                  margin: 0 !important;
                }
                @page {
                  size: A6 portrait;
                  margin: 6mm;
                }
              }
            `}} />
            
            {/* Label Header */}
            <div className="flex justify-between items-center border-b-4 border-black pb-3">
              <div>
                <h1 className="text-xl font-black uppercase tracking-tight text-black">NUTRI DATES</h1>
                <p className="text-[8px] font-bold text-stone-500 uppercase tracking-widest leading-none">PREMIUM D2C HEALTH BRAND</p>
              </div>
              <div className="text-right border-2 border-black bg-black text-white px-2 py-1 text-[9px] font-black uppercase rounded">
                {getTrackingInfo(selectedOrder)?.carrier || 'Delhivery'}
              </div>
            </div>

            {/* Barcode Mockup */}
            <div className="border-2 border-black rounded p-3 flex flex-col items-center justify-center bg-stone-50">
              <div className="text-lg font-mono font-black text-black tracking-[0.25em] h-7 leading-none select-none">
                ||||| | | |||| ||| |||| | |||
              </div>
              <div className="text-[10px] font-mono font-bold text-black mt-1 uppercase">
                AWB: {getTrackingInfo(selectedOrder)?.tracking || 'N/A'}
              </div>
            </div>

            {/* Addresses Block */}
            <div className="space-y-3 border-b-2 border-black pb-3">
              <div>
                <span className="text-[8px] font-black uppercase text-stone-400 block tracking-widest mb-1">DELIVER TO:</span>
                <div className="text-xs font-bold leading-normal">
                  <p className="font-black text-black uppercase text-sm">{selectedOrder.customer_name}</p>
                  <p className="text-stone-700">Phone: {selectedOrder.phone}</p>
                  <p className="uppercase text-black mt-0.5 font-bold">
                    {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}
                  </p>
                </div>
              </div>
            </div>

            {/* Sender & Packet details */}
            <div className="grid grid-cols-2 gap-4 text-[10px] leading-tight">
              <div>
                <span className="text-[8px] font-black uppercase text-stone-400 block tracking-widest mb-0.5">SHIP FROM:</span>
                <p className="font-bold text-black uppercase">Nutri Dates Enterprise</p>
                <p className="text-stone-500">Main Store Road, Hazaribagh</p>
                <p className="text-stone-500">Jharkhand - 825301</p>
              </div>
              <div className="text-right flex flex-col justify-between items-end">
                <div>
                  <span className="text-[8px] font-black uppercase text-stone-400 block tracking-widest mb-0.5">METRICS:</span>
                  <p className="font-bold">Weight: {getTrackingInfo(selectedOrder)?.weight || '0.5kg'}</p>
                  <p className="font-bold">OrderID: {selectedOrder.id}</p>
                </div>
                <div className="border-2 border-black bg-stone-100 px-2 py-0.5 font-black text-[9px] uppercase tracking-wider text-black">
                  {selectedOrder.payment_method.toLowerCase().includes('cash') || selectedOrder.payment_method.toLowerCase().includes('delivery') ? 'COD (Pay on Delivery)' : 'PREPAID'}
                </div>
              </div>
            </div>

            {/* Label Footer */}
            <div className="border-t-2 border-black pt-2 text-[8px] font-bold text-stone-400 text-center uppercase">
              Please do not accept if seal is broken. Check tracking at nutridates.in/track/{selectedOrder.id}
            </div>
          </div>
        ) : (
          <div className="print-invoice-container flex flex-col justify-between h-full space-y-4">
            <style dangerouslySetInnerHTML={{ __html: `
              @media print {
                html, body {
                  height: 100%;
                  background-color: #fff !important;
                  color: #000 !important;
                  margin: 0 !important;
                  padding: 0 !important;
                }
                @page {
                  size: A4 portrait;
                  margin: 8mm 12mm 8mm 12mm;
                }
                .print-invoice-container {
                  max-height: 270mm;
                  overflow: hidden;
                }
              }
            `}} />
            {/* Header block */}
            <div className="flex justify-between items-start border-b border-stone-800 pb-3">
              <div>
                <h1 className="text-xl font-black uppercase tracking-tight text-black">NUTRI DATES</h1>
                <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest leading-none">India's Premium Date-Based Nutrition</p>
                <p className="mt-1.5 font-semibold text-stone-600 text-[10px] leading-tight">
                  FSSAI Lic No: 21124233000981<br />
                  Support: hello@nutridates.in | WhatsApp: +91 79705 74329
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-sm font-black uppercase tracking-wider text-orange-600 leading-none mb-1">TAX INVOICE</h2>
                <p className="font-extrabold text-black text-[11px]">Invoice ID: {selectedOrder.id}</p>
                <p className="text-stone-500 text-[10px]">Date: {new Date(selectedOrder.created_at).toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            {/* Addresses block */}
            <div className="grid grid-cols-2 gap-6 my-2">
              <div>
                <h3 className="font-black uppercase text-[8px] tracking-wider text-stone-400 mb-1">Customer / Shipping Address</h3>
                <div className="font-bold border border-stone-300 p-2.5 rounded text-[10px] leading-normal bg-stone-50/50">
                  <p className="text-xs font-black uppercase text-black">{selectedOrder.customer_name}</p>
                  <p className="text-stone-600 mt-1">Phone: {selectedOrder.phone}</p>
                  {selectedOrder.email && <p className="text-stone-600">Email: {selectedOrder.email}</p>}
                  <p className="mt-1 text-stone-700 uppercase">
                    {selectedOrder.address}<br />
                    {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-black uppercase text-[8px] tracking-wider text-stone-400 mb-1">Billing / Store Details</h3>
                <div className="font-semibold border border-stone-300 p-2.5 rounded text-stone-600 text-[10px] leading-normal bg-stone-50/50">
                  <p className="font-bold uppercase text-black">Nutri Dates Enterprise</p>
                  <p className="mt-0.5">Main Store Road, Hazaribagh</p>
                  <p>Jharkhand, India - 825301</p>
                  <p className="mt-1 text-[9px] text-stone-500 uppercase font-bold">GSTIN: MockGSTIN9817</p>
                </div>
              </div>
            </div>

            {/* Table of Items */}
            <div className="flex-1 min-h-[120px]">
              <table className="w-full text-left border border-stone-300 border-collapse">
                <thead>
                  <tr className="bg-stone-100 border-b border-stone-300 uppercase text-[9px] font-black text-black">
                    <th className="p-2 border-r border-stone-300">Product Description</th>
                    <th className="p-2 text-center border-r border-stone-300 w-20">Pack Size</th>
                    <th className="p-2 text-center border-r border-stone-300 w-16">Qty</th>
                    <th className="p-2 text-right border-r border-stone-300 w-24">Unit Price</th>
                    <th className="p-2 text-right w-28">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-stone-200 text-[10px] font-bold text-stone-800">
                      <td className="p-2 border-r border-stone-300 uppercase">{item.name}</td>
                      <td className="p-2 text-center border-r border-stone-300 uppercase">{item.size}</td>
                      <td className="p-2 text-center border-r border-stone-300">{item.quantity}</td>
                      <td className="p-2 text-right border-r border-stone-300">₹{item.price}</td>
                      <td className="p-2 text-right">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                  <tr className="font-bold border-t border-stone-300 text-stone-600 text-[10px]">
                    <td colSpan={3} className="p-2 border-r border-stone-300"></td>
                    <td className="p-2 text-right uppercase border-r border-stone-300">Shipping</td>
                    <td className="p-2 text-right text-emerald-600 uppercase font-black">Free</td>
                  </tr>
                  <tr className="font-black text-xs border-t border-stone-300 uppercase text-black bg-stone-50">
                    <td colSpan={3} className="p-2 border-r border-stone-300"></td>
                    <td className="p-2 text-right border-r border-stone-300">Grand Total</td>
                    <td className="p-2 text-right text-orange-600 text-sm">₹{selectedOrder.total_amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer block */}
            <div className="flex justify-between items-end border-t border-dashed border-stone-300 pt-3 mt-4">
              <div>
                <p className="font-bold uppercase text-[8px] text-stone-400">Payment Terms</p>
                <p className="font-extrabold uppercase text-[#111111] text-xs">{selectedOrder.payment_method}</p>
                <p className="text-[10px] text-stone-500 mt-1 font-semibold">Thank you for ordering healthy date powder with Nutri Dates!</p>
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="border border-stone-300 w-28 h-8 flex items-center justify-center font-mono font-bold tracking-widest text-[8px] uppercase text-stone-400 mb-1 leading-none">
                  ||||| {selectedOrder.id} |||||
                </div>
                <p className="text-[8px] font-bold text-stone-400 uppercase">Authorized Signature</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )}
  </>
);
}
