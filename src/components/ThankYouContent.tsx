'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Confetti particle interface
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  delay: number;
}

// Order interface (local representation)
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
}

const COLORS = ['#FF5000', '#3A2415', '#111111', '#25D366', '#FBF9F6'];

function generateConfetti(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -(Math.random() * 20 + 5),
    size: Math.random() * 8 + 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
    delay: Math.random() * 0.8,
  }));
}

export default function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [particles, setParticles] = useState<Particle[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setParticles(generateConfetti(45));
  }, []);

  // Fetch Order Details
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setOrder(data.order);
        } else {
          setError(data.error || 'Failed to fetch order tracking');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Network error tracking your order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    // Poll for status updates every 15 seconds
    const interval = setInterval(fetchOrder, 15000);
    return () => clearInterval(interval);
  }, [orderId]);

  // Determine active step index for visual timeline
  const getTimelineStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const steps = [
    { label: 'Order Placed', desc: 'Awaiting merchant review' },
    { label: 'Confirmed', desc: 'Order details verified' },
    { label: 'Shipped Out', desc: 'Dispatched via DTDC Express' },
    { label: 'Delivered', desc: 'Package received & paid' }
  ];

  const activeIndex = order ? getTimelineStepIndex(order.status) : 0;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-y-auto bg-[#FBF9F6] px-4 py-16 md:py-24">
      {/* Confetti */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}vw`, y: `${p.y}vh`, rotate: 0, opacity: 1 }}
          animate={{
            y: '110vh',
            rotate: p.rotation + 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2.5 + Math.random() * 2,
            delay: p.delay,
            ease: 'easeIn',
          }}
          className="pointer-events-none absolute top-0 z-0"
          style={{
            width: p.size,
            height: p.size,
            borderRadius: Math.random() > 0.5 ? '50%' : '1px',
            backgroundColor: p.color,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Animated Checkmark */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-black bg-[#FF5000] shadow-[4px_4px_0px_0px_#111111]"
        >
          <svg
            className="h-10 w-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={4}
            stroke="currentColor"
          >
            <motion.path
              strokeLinecap="square"
              strokeLinejoin="miter"
              d="M4.5 12.75l6 6 9-13.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            />
          </svg>
        </motion.div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="mb-2 font-sans text-3xl font-black uppercase tracking-tight text-[#111111] md:text-4xl">
            {order?.status === 'cancelled' ? 'Order Cancelled' : 'Order Placed!'}
          </h1>
          <p className="text-sm font-semibold text-[#4E3A2E] max-w-md mx-auto leading-relaxed">
            {order?.status === 'cancelled'
              ? 'This order has been cancelled. Please check the timeline below for reasons or message support.'
              : 'Your fresh batch of Chocolate Dates Nutrition Powder is being prepared in Hazaribagh, Jharkhand.'}
          </p>
          {orderId && (
            <span className="inline-block mt-4 border-2 border-black bg-white px-4 py-1.5 text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#111111]">
              Order ID: {orderId}
            </span>
          )}
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="rounded-xl border-4 border-black bg-white p-8 text-center shadow-[6px_6px_0px_0px_#111111] mb-8">
            <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-[#FF5000] rounded-full mx-auto mb-4" />
            <p className="text-xs font-black uppercase text-[#111111]">Loading Tracking Timeline...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border-4 border-black bg-red-50 p-6 text-center shadow-[6px_6px_0px_0px_#111111] mb-8">
            <p className="text-sm font-black text-red-600 uppercase mb-2">Tracking Offline</p>
            <p className="text-xs font-bold text-stone-600">{error}</p>
          </div>
        ) : order ? (
          <>
            {/* Visual Progress Timeline (Horizontal on desktop, vertical on mobile) */}
            <div className="rounded-xl border-4 border-black bg-white p-6 md:p-8 shadow-[6px_6px_0px_0px_#111111] mb-8">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#FF5000] mb-6">
                Delivery Timeline Status
              </h2>

              {order.status === 'cancelled' ? (
                <div className="border-2 border-red-500 rounded-lg p-4 bg-red-50 text-left mb-6">
                  <p className="text-xs font-black text-red-600 uppercase">Order Cancelled</p>
                  <p className="text-xs font-semibold text-stone-700 mt-1">
                    {order.timeline[order.timeline.length - 1]?.note || 'Your order was cancelled.'}
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1">
                    Updated: {new Date(order.timeline[order.timeline.length - 1]?.timestamp).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative mb-6">
                  {/* Line between steps (desktop only) */}
                  <div className="hidden md:block absolute top-[18px] left-[12%] right-[12%] h-1 bg-stone-200 z-0">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-500" 
                      style={{ width: `${(activeIndex / 3) * 100}%` }}
                    />
                  </div>

                  {steps.map((step, idx) => {
                    const isCompleted = idx <= activeIndex;
                    const isActive = idx === activeIndex;

                    return (
                      <div key={step.label} className="flex md:flex-col items-start md:items-center gap-4 md:gap-2 text-left md:text-center relative z-10">
                        {/* Circle badge */}
                        <div 
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-black font-black text-xs shadow-[2px_2px_0px_0px_#111111] transition-colors ${
                            isCompleted 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-white text-stone-400'
                          } ${isActive ? 'ring-4 ring-emerald-100' : ''}`}
                        >
                          {isCompleted ? '✔' : idx + 1}
                        </div>
                        {/* Label & Description */}
                        <div>
                          <p className={`text-xs font-black uppercase tracking-tight ${
                            isCompleted ? 'text-black font-extrabold' : 'text-stone-400'
                          }`}>
                            {step.label}
                          </p>
                          <p className="text-[10px] font-semibold text-stone-500 mt-0.5 max-w-[140px] leading-tight">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Log Timeline Detail */}
              <div className="border-t border-stone-200 pt-5 text-left">
                <p className="text-[10px] font-black uppercase text-stone-500 mb-3 tracking-widest">
                  Status Log Details
                </p>
                <div className="space-y-3.5">
                  {[...order.timeline].reverse().map((event, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs leading-relaxed">
                      <div className="h-2 w-2 rounded-full bg-black shrink-0 mt-1.5" />
                      <div>
                        <span className="font-extrabold uppercase text-[#111111] tracking-tight mr-2">
                          [{event.status}]
                        </span>
                        <span className="text-[#4E3A2E] font-semibold">{event.note}</span>
                        <p className="text-[9px] text-stone-400 mt-0.5">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary details */}
            <div className="rounded-xl border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_#111111] mb-8 text-left">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#FF5000] mb-4">
                Items Purchased
              </h2>
              <div className="divide-y border-stone-200">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 text-sm font-semibold text-[#4E3A2E]">
                    <div className="flex flex-col">
                      <span className="font-black text-[#111111] uppercase text-xs">{item.name}</span>
                      <span className="text-[10px] text-stone-500 font-bold uppercase mt-0.5">Pack Size: {item.size}</span>
                    </div>
                    <span>{item.quantity} × ₹{item.price}</span>
                  </div>
                ))}
                
                <div className="flex items-center justify-between py-3 text-xs font-bold text-[#4E3A2E]">
                  <span>Payment Method</span>
                  <span className="font-black text-[#111111] uppercase">{order.payment_method}</span>
                </div>

                <div className="flex items-start justify-between py-3 text-xs font-bold text-[#4E3A2E]">
                  <span>Shipping Address</span>
                  <span className="text-right text-[#111111] font-semibold max-w-[200px]">
                    {order.customer_name}<br />
                    {order.address}, {order.city}, {order.state} - {order.pincode}
                  </span>
                </div>

                <div className="flex items-center justify-between py-4 text-sm font-black text-[#111111] uppercase border-t-2 border-black pt-4">
                  <span>Grand Total</span>
                  <span className="text-lg font-black text-[#FF5000]">₹{order.total_amount}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-xl border-4 border-black bg-white p-8 text-center shadow-[6px_6px_0px_0px_#111111] mb-8">
            <p className="text-sm font-black text-[#111111] uppercase">No Order Specified</p>
            <p className="text-xs font-semibold text-stone-500 mt-2">
              Order details are missing. Click below to return to the homepage.
            </p>
          </div>
        )}

        {/* Viral Share Loop Widget */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 w-full border-4 border-black bg-white p-6 rounded-xl shadow-[6px_6px_0px_0px_#111111] text-center"
        >
          <span className="inline-block border-2 border-black bg-[#FF5000] text-white text-xs font-black tracking-widest uppercase px-3 py-1 mb-4">
            Spread The Strength
          </span>
          <h3 className="text-lg font-black uppercase text-[#111111] tracking-tight">
            Share on WhatsApp & Get 15% Off
          </h3>
          <p className="mt-2 text-xs font-semibold text-[#4E3A2E] leading-relaxed">
            Share this healthy energy drink with 3 friends or family members on WhatsApp. We will instantly email or WhatsApp you a <span className="text-[#FF5000] font-bold">15% discount coupon</span> for your next purchase!
          </p>
          <div className="mt-5">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                "Hey! I just ordered Nutri Dates — it's India's first Date-Based Chocolate Nutrition Powder with zero refined sugar. You should check it out: https://nutridates.in"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-lg bg-[#25D366] text-white px-6 py-3 text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#111111] transition-transform hover:translate-y-[-1px] cursor-pointer"
            >
              <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Share on WhatsApp
            </a>
          </div>
        </motion.div>

        {/* WhatsApp Support Button */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <motion.a
            href="https://wa.me/917970574329?text=Hello%20Nutri%20Dates%20Team%2C%0A%0AI%20would%20like%20to%20track%20my%20order."
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-emerald-600 transition-colors hover:text-emerald-700"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Message Support on WhatsApp
          </motion.a>

          <span className="hidden sm:inline text-stone-300">|</span>

          {/* Back to Home Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-[#111111] px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-[3px_3px_0px_0px_#FF5000] hover:bg-[#FF5000] transition-colors"
            >
              Back to Home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
