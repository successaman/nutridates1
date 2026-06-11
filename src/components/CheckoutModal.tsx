'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  pincode?: string;
  city?: string;
  state?: string;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const router = useRouter();
  
  // Form values
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
  });

  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({});

  // Pack size and quantity
  const SIZES = [
    { size: '250g', price: 299 },
    { size: '500g', price: 549 },
    { size: '1kg', price: 999 }
  ];
  const [selectedSize, setSelectedSize] = useState<'250g' | '500g' | '1kg'>('250g');
  const [quantity, setQuantity] = useState<number>(1);

  const activeSize = SIZES.find(s => s.size === selectedSize) || SIZES[0];
  const totalPrice = activeSize.price * quantity;

  // Payment Option selection: 'razorpay' or 'whatsapp'
  const [purchaseMethod, setPurchaseMethod] = useState<'razorpay' | 'whatsapp'>('razorpay');

  // Loading state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for that field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-+]/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit number';
    }

    if (!formData.address.trim()) newErrors.address = 'Delivery address is required';
    
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Enter a valid 6-digit pincode';
    }

    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      setProcessStep('Creating order in database...');
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          total_amount: totalPrice,
          payment_method: purchaseMethod === 'razorpay' ? 'Online (Razorpay)' : 'Cash on Delivery',
          items: [
            {
              id: 'prod_chocolate_mix',
              name: 'Chocolate Dates Powder',
              price: activeSize.price,
              quantity,
              size: selectedSize
            }
          ]
        })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to place order');
      }

      const order = resData.order;

      if (purchaseMethod === 'razorpay') {
        // Simulate Razorpay Gateway steps
        setProcessStep('Connecting to Razorpay Secure API...');
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        setProcessStep('Verifying payment connection...');
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        setProcessStep('Confirming transaction with bank...');
        await new Promise((resolve) => setTimeout(resolve, 900));

        // Redirect to thank-you with orderId
        router.push(`/thank-you?orderId=${order.id}`);
      } else {
        // WhatsApp order
        setProcessStep('Formatting your order details...');
        await new Promise((resolve) => setTimeout(resolve, 600));

        const message = `Hello Nutri Dates Team!\n\nI want to order Chocolate Dates Nutrition Powder (${selectedSize}) x ${quantity}.\n\nOrder ID: ${order.id}\n\nMy Delivery Details:\n- Name: ${formData.fullName}\n- Phone: ${formData.phone}\n- Email: ${formData.email}\n- Address: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}\n\nOrder Total: ₹${totalPrice} (Cash on Delivery / UPI)\n\nPlease confirm my order. Thanks!`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/917970574329?text=${encodedMessage}`;
        
        // Open whatsapp tab
        window.open(whatsappUrl, '_blank');
        
        // Redirect page to thank-you with orderId
        router.push(`/thank-you?orderId=${order.id}`);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert('Checkout failed: ' + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isProcessing ? onClose : undefined}
            className="fixed inset-0 bg-black/60"
          />

          {/* Modal Content container */}
          <motion.div
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.8 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="relative z-10 flex h-full w-full max-w-2xl flex-col bg-[#FFFDF9] shadow-2xl overflow-hidden sm:h-auto sm:rounded-xl border-4 border-black"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-black px-6 py-4 bg-[#F9F7F5]">
              <div>
                <h3 className="font-sans text-xl font-black uppercase text-[#111111] tracking-tighter">
                  Secure Checkout
                </h3>
                <p className="text-xs font-bold text-[#4E3A2E] mt-0.5 uppercase tracking-wider">
                  Nutri Dates · 250g Pack (₹299)
                </p>
              </div>
              {!isProcessing && (
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-black hover:bg-stone-200 border-2 border-transparent active:border-black transition-colors cursor-pointer"
                  aria-label="Close Checkout"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:max-h-[70vh]">
              {isProcessing ? (
                // Processing Animation screen
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                  <div className="relative mb-8 h-16 w-16">
                    {/* Ring loader */}
                    <div className="absolute inset-0 rounded-full border-4 border-[#FF5000]/20" />
                    <div
                      className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
                      style={{ borderColor: '#FF5000', borderTopColor: 'transparent' }}
                    />
                  </div>
                  <h4 className="font-sans text-lg font-black uppercase tracking-tight text-[#111111] mb-2">
                    Processing Your Order...
                  </h4>
                  <p className="text-sm font-semibold text-[#4E3A2E] h-6 transition-all duration-300">
                    {processStep}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Delivery Details */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#FF5000] mb-4">
                      1. Delivery Details
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* Name */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-black uppercase text-[#111111] mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm bg-white text-[#111111] font-semibold focus:outline-hidden focus:border-[#FF5000] ${
                            errors.fullName ? 'border-red-500' : 'border-black'
                          }`}
                          placeholder="Full Name"
                        />
                        {errors.fullName && (
                          <p className="mt-1 text-xs font-bold text-red-500">{errors.fullName}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-black uppercase text-[#111111] mb-1.5">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm bg-white text-[#111111] font-semibold focus:outline-hidden focus:border-[#FF5000] ${
                            errors.phone ? 'border-red-500' : 'border-black'
                          }`}
                          placeholder="10-digit mobile number"
                        />
                        {errors.phone && (
                          <p className="mt-1 text-xs font-bold text-red-500">{errors.phone}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-black uppercase text-[#111111] mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm bg-white text-[#111111] font-semibold focus:outline-hidden focus:border-[#FF5000] ${
                            errors.email ? 'border-red-500' : 'border-black'
                          }`}
                          placeholder="email@example.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs font-bold text-red-500">{errors.email}</p>
                        )}
                      </div>

                      {/* Address */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-black uppercase text-[#111111] mb-1.5">
                          Shipping Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm bg-white text-[#111111] font-semibold focus:outline-hidden focus:border-[#FF5000] ${
                            errors.address ? 'border-red-500' : 'border-black'
                          }`}
                          placeholder="House/Flat No, Apartment, Street name"
                        />
                        {errors.address && (
                          <p className="mt-1 text-xs font-bold text-red-500">{errors.address}</p>
                        )}
                      </div>

                      {/* Pincode */}
                      <div>
                        <label className="block text-xs font-black uppercase text-[#111111] mb-1.5">
                          Pincode
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm bg-white text-[#111111] font-semibold focus:outline-hidden focus:border-[#FF5000] ${
                            errors.pincode ? 'border-red-500' : 'border-black'
                          }`}
                          placeholder="6-digit PIN code"
                        />
                        {errors.pincode && (
                          <p className="mt-1 text-xs font-bold text-red-500">{errors.pincode}</p>
                        )}
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-xs font-black uppercase text-[#111111] mb-1.5">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm bg-white text-[#111111] font-semibold focus:outline-hidden focus:border-[#FF5000] ${
                            errors.city ? 'border-red-500' : 'border-black'
                          }`}
                          placeholder="City"
                        />
                        {errors.city && (
                          <p className="mt-1 text-xs font-bold text-red-500">{errors.city}</p>
                        )}
                      </div>

                      {/* State */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-black uppercase text-[#111111] mb-1.5">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm bg-white text-[#111111] font-semibold focus:outline-hidden focus:border-[#FF5000] ${
                            errors.state ? 'border-red-500' : 'border-black'
                          }`}
                          placeholder="State"
                        />
                        {errors.state && (
                          <p className="mt-1 text-xs font-bold text-red-500">{errors.state}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Step 1.5: Select Pack Size & Quantity */}
                  <div className="border-t-2 border-stone-200 pt-5">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#FF5000] mb-4">
                      1.5 Select Size & Quantity
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* Size Selector */}
                      <div>
                        <label className="block text-xs font-black uppercase text-[#111111] mb-1.5">
                          Select Pack Size
                        </label>
                        <div className="flex gap-2">
                          {SIZES.map((s) => (
                            <button
                              key={s.size}
                              type="button"
                              onClick={() => setSelectedSize(s.size as any)}
                              className={`flex-1 rounded-lg border-2 py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                                selectedSize === s.size
                                  ? 'border-black bg-[#FF5000] text-white shadow-[2px_2px_0px_0px_#111111]'
                                  : 'border-stone-300 bg-white text-[#4E3A2E] hover:border-black'
                              }`}
                            >
                              {s.size} (₹{s.price})
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div>
                        <label className="block text-xs font-black uppercase text-[#111111] mb-1.5">
                          Quantity
                        </label>
                        <div className="flex items-center border-2 border-black rounded-lg overflow-hidden bg-white max-w-[140px]">
                          <button
                            type="button"
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="px-3 py-2 text-sm font-black hover:bg-stone-100 border-r border-black select-none cursor-pointer"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center font-bold text-sm text-black">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity(q => Math.min(10, q + 1))}
                            className="px-3 py-2 text-sm font-black hover:bg-stone-100 border-l border-black select-none cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Buying Options */}
                  <div className="border-t-2 border-stone-200 pt-5">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#FF5000] mb-4">
                      2. Purchase Options
                    </h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {/* Option 1: Razorpay Card/UPI */}
                      <label
                        className={`relative flex cursor-pointer flex-col rounded-lg border-2 p-4 transition-all ${
                          purchaseMethod === 'razorpay'
                            ? 'border-black bg-[#FF5000]/5 ring-1 ring-black shadow-[2px_2px_0px_0px_#111111]'
                            : 'border-stone-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="purchaseMethod"
                          value="razorpay"
                          checked={purchaseMethod === 'razorpay'}
                          onChange={() => setPurchaseMethod('razorpay')}
                          className="sr-only"
                        />
                        <span className="flex items-center justify-between font-black uppercase text-sm mb-1.5 text-[#111111]">
                          <span>Pay Online (Razorpay)</span>
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                              purchaseMethod === 'razorpay'
                                ? 'border-[#FF5000]'
                                : 'border-stone-300'
                            }`}
                          >
                            {purchaseMethod === 'razorpay' && (
                              <span className="h-2 w-2 rounded-full bg-[#FF5000]" />
                            )}
                          </span>
                        </span>
                        <span className="text-xs font-semibold text-[#4E3A2E] leading-relaxed">
                          Secure instant payment via Card, Net Banking, or UPI (GPay/PhonePe).
                        </span>
                      </label>

                      {/* Option 2: Buy on WhatsApp */}
                      <label
                        className={`relative flex cursor-pointer flex-col rounded-lg border-2 p-4 transition-all ${
                          purchaseMethod === 'whatsapp'
                            ? 'border-emerald-600 bg-emerald-50/10 ring-1 ring-emerald-600 shadow-[2px_2px_0px_0px_#047857]'
                            : 'border-stone-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="purchaseMethod"
                          value="whatsapp"
                          checked={purchaseMethod === 'whatsapp'}
                          onChange={() => setPurchaseMethod('whatsapp')}
                          className="sr-only"
                        />
                        <span className="flex items-center justify-between font-black uppercase text-sm mb-1.5 text-emerald-800">
                          <span>Buy on WhatsApp</span>
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                              purchaseMethod === 'whatsapp'
                                ? 'border-emerald-600'
                                : 'border-stone-300'
                            }`}
                          >
                            {purchaseMethod === 'whatsapp' && (
                              <span className="h-2 w-2 rounded-full bg-emerald-600" />
                            )}
                          </span>
                        </span>
                        <span className="text-xs font-semibold text-stone-600 leading-relaxed">
                          Send address details via WhatsApp. Pay cash or UPI on delivery.
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Order Review Card with thumbnail */}
                  <div className="rounded-lg bg-[#F9F7F5] p-4 border-2 border-black flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 border-2 border-black bg-white rounded-lg overflow-hidden">
                      <Image
                        src="/images/mockup-front.jpg"
                        alt="Nutri Dates Pack"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs font-bold text-[#4E3A2E] mb-1">
                        <span>Chocolate Dates Nutrition Powder ({selectedSize})</span>
                        <span>₹{activeSize.price} x {quantity}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-[#4E3A2E] mb-2">
                        <span>Delivery Shipping</span>
                        <span className="text-emerald-600 uppercase font-black">Free</span>
                      </div>
                      <hr className="border-stone-200 my-1" />
                      <div className="flex justify-between text-sm font-black text-[#111111] uppercase">
                        <span>Amount Payable</span>
                        <span>₹{totalPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <motion.button
                      type="submit"
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                      className={`flex w-full items-center justify-center gap-2 rounded-lg py-4 text-base font-black uppercase tracking-wider text-white border-2 border-black cursor-pointer shadow-[4px_4px_0px_0px_#111111] transition-transform ${
                        purchaseMethod === 'whatsapp'
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : 'bg-[#FF5000] hover:bg-[#E04700]'
                      }`}
                    >
                      {purchaseMethod === 'whatsapp' ? (
                        <>
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          Buy on WhatsApp
                        </>
                      ) : (
                        <>
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                            />
                          </svg>
                          Complete Secure Payment
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer trust badge */}
            <div className="flex items-center justify-center gap-3 border-t-2 border-black px-6 py-4 bg-[#F9F7F5] text-center text-xs text-[#111111] font-black uppercase">
              <span className="flex items-center gap-1 text-emerald-700">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                  />
                </svg>
                Secure Gateway
              </span>
              <span>·</span>
              <span>Free Delivery</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
