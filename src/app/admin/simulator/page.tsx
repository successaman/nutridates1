'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderSimulatorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Hazaribagh',
    state: 'Jharkhand',
    pincode: '825301',
    size: '250g',
    quantity: 1,
    payment_method: 'Cash on Delivery'
  });

  const SIZES_PRICING: Record<string, number> = {
    '250g': 299,
    '500g': 549,
    '1kg': 999
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (increment: number) => {
    setFormData((prev) => ({
      ...prev,
      quantity: Math.max(1, Math.min(10, prev.quantity + increment))
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.phone || !formData.address) {
      alert('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    const unitPrice = SIZES_PRICING[formData.size] || 299;
    const totalAmount = unitPrice * formData.quantity;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.customer_name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          total_amount: totalAmount,
          payment_method: formData.payment_method,
          items: [
            {
              id: 'prod_chocolate_mix',
              name: 'Chocolate Dates Powder',
              price: unitPrice,
              quantity: formData.quantity,
              size: formData.size
            }
          ]
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert(`Simulated order ${data.order.id} placed successfully!`);
        router.push('/admin/orders');
      } else {
        alert('Failed to place order: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to order endpoint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-[#111111] min-h-screen pb-16">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tight">
          Order Simulator
        </h2>
        <p className="text-sm font-semibold text-[#4E3A2E] mt-1 uppercase tracking-wider">
          Inject simulated custom orders to test timelines, tracking updates, and invoices
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulator Form (2/3 width) */}
        <form 
          onSubmit={handleSubmit}
          className="border-4 border-black bg-white rounded-xl shadow-[6px_6px_0px_0px_#111111] p-6 lg:col-span-2 space-y-5"
        >
          <h3 className="text-xs font-black uppercase tracking-widest text-[#FF5000] border-b-2 border-black pb-3">
            ⚡ Simulated Order Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-black uppercase text-black mb-1.5">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleInputChange}
                className="w-full border-2 border-black rounded-lg px-4 py-2 text-xs bg-white text-black font-semibold focus:outline-hidden focus:border-[#FF5000]"
                placeholder="e.g. Aman Gupta"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border-2 border-black rounded-lg px-4 py-2 text-xs bg-white text-black font-semibold focus:outline-hidden"
                placeholder="10-digit number"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border-2 border-black rounded-lg px-4 py-2 text-xs bg-white text-black font-semibold focus:outline-hidden"
                placeholder="optional"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-black uppercase text-black mb-1.5">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border-2 border-black rounded-lg px-4 py-2 text-xs bg-white text-black font-semibold focus:outline-hidden"
                placeholder="e.g. Flat 304, Green Apartment"
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1.5">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full border-2 border-black rounded-lg px-4 py-2 text-xs bg-white text-black font-semibold focus:outline-hidden"
                required
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1.5">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full border-2 border-black rounded-lg px-4 py-2 text-xs bg-white text-black font-semibold focus:outline-hidden"
                required
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1.5">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full border-2 border-black rounded-lg px-4 py-2 text-xs bg-white text-black font-semibold focus:outline-hidden"
                required
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1.5">
                Payment Type
              </label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleInputChange}
                className="w-full border-2 border-black rounded-lg px-3 py-2 text-xs bg-white text-black font-black uppercase focus:outline-hidden"
              >
                <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                <option value="Online (Razorpay)">Online (Razorpay)</option>
              </select>
            </div>
          </div>

          <div className="border-t border-stone-200 pt-4 flex gap-3 justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#FF5000] text-white border-2 border-black rounded-lg px-6 py-3 text-xs font-black uppercase tracking-widest cursor-pointer shadow-[3px_3px_0px_0px_#111111] disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : '⚡ Submit simulated order'}
            </button>
          </div>
        </form>

        {/* Pricing Summary Cart (1/3 width) */}
        <div className="space-y-6">
          <div className="border-4 border-black bg-[#FBF9F6] rounded-xl shadow-[6px_6px_0px_0px_#111111] p-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#2B1D14] border-b-2 border-black pb-3">
              📦 Product & Pricing
            </h3>

            {/* Size Selector */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase text-stone-400 tracking-wider">
                Select Package Size
              </label>
              <div className="flex flex-col gap-2">
                {Object.entries(SIZES_PRICING).map(([sz, pr]) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, size: sz }))}
                    className={`border-2 py-2 px-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex justify-between items-center ${
                      formData.size === sz
                        ? 'border-black bg-[#FF5000] text-white shadow-[2px_2px_0px_0px_#111111]'
                        : 'border-stone-300 bg-white text-[#4E3A2E] hover:border-black'
                    }`}
                  >
                    <span>{sz} Pack</span>
                    <span>₹{pr}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase text-stone-400 tracking-wider">
                Quantity
              </label>
              <div className="flex items-center border-2 border-black rounded-lg overflow-hidden bg-white max-w-[140px]">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-1.5 text-sm font-black hover:bg-stone-100 border-r border-black select-none cursor-pointer"
                >
                  -
                </button>
                <span className="flex-1 text-center font-bold text-xs text-black">
                  {formData.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-1.5 text-sm font-black hover:bg-stone-100 border-l border-black select-none cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Billing Card */}
            <div className="border-2 border-black rounded-lg bg-white p-4 space-y-2 text-xs font-bold mt-2">
              <div className="flex justify-between uppercase">
                <span className="text-stone-500">Package Size</span>
                <span className="text-black">{formData.size}</span>
              </div>
              <div className="flex justify-between uppercase">
                <span className="text-stone-500">Unit Price</span>
                <span className="text-black">₹{SIZES_PRICING[formData.size]}</span>
              </div>
              <div className="flex justify-between uppercase">
                <span className="text-stone-500">Quantity</span>
                <span className="text-black">{formData.quantity}x</span>
              </div>
              <div className="flex justify-between uppercase">
                <span className="text-stone-500">Shipping</span>
                <span className="text-emerald-600 font-black">Free</span>
              </div>
              <hr className="border-stone-200" />
              <div className="flex justify-between uppercase font-black text-sm">
                <span>Payable Total</span>
                <span className="text-[#FF5000]">₹{SIZES_PRICING[formData.size] * formData.quantity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
