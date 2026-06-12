import { db } from '@/lib/db';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderTrackingPage({ params }: PageProps) {
  const { orderId } = await params;
  
  let order = null;
  let errorMsg = '';

  try {
    order = await db.getOrderById(orderId);
  } catch (err: any) {
    console.error('Tracking page fetch error:', err);
    errorMsg = 'Failed to connect to database.';
  }

  // Parse shipment details from timeline if order is shipped
  const getFulfillmentDetails = () => {
    if (!order) return null;
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
        weight: '0.50kg'
      };
    }
  };

  const fulfillment = getFulfillmentDetails();

  // Status mapping
  const statuses = [
    { key: 'pending', label: 'Order Placed', desc: 'We have received your order details.' },
    { key: 'confirmed', label: 'Order Confirmed', desc: 'Your order is confirmed and packaging has started.' },
    { key: 'shipped', label: 'Package Dispatched', desc: 'Package handed over to carrier.' },
    { key: 'delivered', label: 'Delivered', desc: 'Package has been delivered successfully!' }
  ];

  // Get index of current status
  const getStatusIndex = (status: string) => {
    if (status === 'cancelled') return -1;
    return statuses.findIndex(s => s.key === status);
  };

  const currentIndex = order ? getStatusIndex(order.status) : -1;

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#111111] font-sans antialiased py-12 px-6">
      <div className="mx-auto max-w-2xl">
        
        {/* Store Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-black uppercase tracking-tight text-black border-4 border-black px-6 py-2 bg-[#FF5000] shadow-[4px_4px_0px_0px_#111111] rotate-[-1deg] hover:rotate-[1deg] transition-transform">
              NUTRI DATES
            </h1>
          </Link>
          <p className="text-xs font-bold text-[#4E3A2E] uppercase tracking-widest mt-4">
            SIP THE STRENGTH · LIVE ORDER TRACKING
          </p>
        </div>

        {errorMsg || !order ? (
          <div className="border-4 border-black bg-white rounded-2xl p-10 text-center shadow-[8px_8px_0px_0px_#111111] space-y-4">
            <span className="text-5xl">⚠️</span>
            <h2 className="text-xl font-black uppercase">Order Not Found</h2>
            <p className="text-sm font-semibold text-stone-500 max-w-md mx-auto">
              {errorMsg || `We couldn't find an order with the ID "${orderId}". Please verify your order receipt or link.`}
            </p>
            <Link 
              href="/" 
              className="inline-block bg-[#111111] hover:bg-[#FF5000] text-white border-2 border-black rounded-lg px-6 py-3 text-xs font-black uppercase tracking-widest cursor-pointer shadow-[3px_3px_0px_0px_#FF5000] transition-colors"
            >
              Back To Storefront
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Order Status Box */}
            <div className="border-4 border-black bg-white rounded-2xl p-6 md:p-8 shadow-[8px_8px_0px_0px_#111111] space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-black pb-4 gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Tracking Order</span>
                  <h2 className="text-xl font-black uppercase tracking-tight">{order.id}</h2>
                </div>
                <div className="flex flex-col sm:items-end">
                  <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Current Status</span>
                  <span className={`inline-block border-2 border-black px-3 py-1 rounded-full text-xs font-black uppercase shadow-[2px_2px_0px_0px_#111111] mt-1 ${
                    order.status === 'pending' ? 'bg-amber-400 text-black' :
                    order.status === 'confirmed' ? 'bg-blue-400 text-white' :
                    order.status === 'shipped' ? 'bg-indigo-400 text-white' :
                    order.status === 'delivered' ? 'bg-emerald-400 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Delivery ETA info */}
              {order.status === 'cancelled' ? (
                <div className="border-4 border-red-500 bg-red-50 rounded-xl p-4 text-xs font-semibold text-red-700">
                  This order was cancelled by the administrator. Reason: {order.timeline.find(t => t.note.includes('Cancelled:'))?.note || 'No reason provided.'}
                </div>
              ) : order.status === 'delivered' ? (
                <div className="border-4 border-emerald-500 bg-emerald-50 rounded-xl p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <span>🎉</span>
                  <span>Your package has been successfully delivered! Thank you for choosing Nutri Dates.</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FBF9F6] border-2 border-black p-4 rounded-xl">
                  <div>
                    <span className="text-[9px] font-black uppercase text-stone-400 block tracking-wider">Estimated Delivery</span>
                    <span className="text-sm font-black text-[#111111]">
                      {fulfillment ? fulfillment.est : 'Estimated 3-5 Business Days'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase text-stone-400 block tracking-wider">Courier Service</span>
                    <span className="text-sm font-black text-[#111111]">
                      {fulfillment ? `${fulfillment.carrier} (${fulfillment.tracking})` : 'Awaiting dispatch...'}
                    </span>
                  </div>
                </div>
              )}

              {/* Status Timeline Progress */}
              {order.status !== 'cancelled' && (
                <div className="relative pl-6 border-l-4 border-black space-y-8 py-2">
                  {statuses.map((step, idx) => {
                    const isCompleted = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;
                    
                    return (
                      <div key={step.key} className="relative">
                        {/* Bullet indicator */}
                        <div className={`absolute left-[-34px] top-0.5 h-6 w-6 rounded-full border-4 border-black flex items-center justify-center text-[10px] font-black shadow-[1px_1px_0px_0px_#111111] ${
                          isCompleted ? 'bg-[#FF5000] text-white' : 'bg-white text-stone-300'
                        }`}>
                          {isCompleted ? '✓' : ''}
                        </div>

                        {/* Title & Desc */}
                        <div className="space-y-1">
                          <h3 className={`text-sm font-black uppercase tracking-tight ${isCompleted ? 'text-black' : 'text-stone-400'}`}>
                            {step.label} {isCurrent && <span className="text-[9px] font-black uppercase tracking-wider text-[#FF5000] border-2 border-[#FF5000] px-1 rounded ml-1 bg-orange-50">Active</span>}
                          </h3>
                          <p className={`text-xs font-semibold leading-relaxed ${isCompleted ? 'text-[#4E3A2E]' : 'text-stone-300'}`}>
                            {step.desc}
                          </p>
                          
                          {/* Timestamp if present in timeline */}
                          {isCompleted && (
                            <span className="text-[9px] text-stone-400 font-bold block mt-1 uppercase">
                              {new Date(order!.timeline.find(t => t.status === step.key)?.timestamp || order!.created_at).toLocaleString('en-IN', {
                                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Shipment tracking link */}
            {fulfillment && (
              <div className="border-4 border-black bg-white rounded-2xl p-6 shadow-[8px_8px_0px_0px_#111111] space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#FF5000]">
                  🚚 Live Carrier Tracking
                </h3>
                <p className="text-xs font-semibold text-stone-500 leading-normal">
                  Your package has been shipped via <strong>{fulfillment.carrier}</strong>. You can copy the tracking number and track it on their official portal:
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="bg-[#2B1D14] text-amber-100 font-mono text-sm px-4 py-2 border-2 border-black rounded-lg w-full text-center sm:text-left select-all">
                    {fulfillment.tracking}
                  </div>
                  <a
                    href={
                      fulfillment.carrier.toLowerCase().includes('delhivery') ? `https://www.delhivery.com/track/package/${fulfillment.tracking}` :
                      fulfillment.carrier.toLowerCase().includes('dtdc') ? `https://www.dtdc.in/tracking/tracking_results.asp?SearchType=awb&txtAwbNo=${fulfillment.tracking}` :
                      `https://www.google.com/search?q=${encodeURIComponent(fulfillment.carrier + ' tracking ' + fulfillment.tracking)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-[#FF5000] hover:bg-black text-white border-2 border-black rounded-lg px-6 py-2.5 text-xs font-black uppercase tracking-wider text-center cursor-pointer shadow-[2px_2px_0px_0px_#111111] transition-all"
                  >
                    Track Shipment
                  </a>
                </div>
              </div>
            )}

            {/* Order Items Summary */}
            <div className="border-4 border-black bg-white rounded-2xl p-6 shadow-[8px_8px_0px_0px_#111111] space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#FF5000] border-b-2 border-black pb-2">
                📦 Items Purchased
              </h3>
              <div className="divide-y border-stone-100 text-xs font-bold text-[#4E3A2E]">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2.5">
                    <div>
                      <span className="font-black text-black uppercase">{item.name}</span>
                      <span className="text-[10px] text-stone-400 block uppercase">{item.size} Pack</span>
                    </div>
                    <span>{item.quantity} × ₹{item.price}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2.5 text-stone-400">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-black uppercase">FREE</span>
                </div>
                <div className="flex justify-between items-center py-3 border-t-2 border-black text-sm font-black text-black uppercase">
                  <span>Total Paid</span>
                  <span className="text-[#FF5000] text-base">₹{order.total_amount}</span>
                </div>
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="border-4 border-black bg-white rounded-2xl p-6 shadow-[8px_8px_0px_0px_#111111] space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#FF5000]">
                📍 Delivery Destination
              </h3>
              <div className="text-xs font-semibold text-[#4E3A2E] leading-relaxed">
                <p className="font-black text-black uppercase">{order.customer_name}</p>
                <p className="text-stone-500">Phone: {order.phone}</p>
                <p className="uppercase mt-1 text-black font-bold">
                  {order.address}, {order.city}, {order.state} - {order.pincode}
                </p>
              </div>
            </div>

            {/* Footer Support */}
            <div className="text-center pt-4 space-y-4">
              <p className="text-xs font-bold text-[#4E3A2E] uppercase">
                Need help with your delivery?
              </p>
              <a
                href={`https://wa.me/917970574329?text=${encodeURIComponent(`Hi Nutri Dates Team! I need support with my order: ${order.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border-2 border-black bg-emerald-500 hover:bg-[#FF5000] hover:text-white text-black text-xs font-black uppercase tracking-widest px-6 py-3 rounded-lg shadow-[3px_3px_0px_0px_#111111] transition-all cursor-pointer"
              >
                💬 WhatsApp Support
              </a>
              <div className="text-[10px] text-stone-400 font-semibold uppercase mt-6">
                Thank you for choosing Nutri Dates!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
