'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { useEffect } from 'react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartCount,
    addToCart,
  } = useCart();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);



  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const getProductImage = (id: string) => {
    if (id === 'prod_chocolate_mix') return '/images/mockup-front.jpg';
    if (id === 'prod_vanilla_mix') return '/images/mockup-pedestal.jpg';
    return '/images/logo-uploaded.jpg'; // fallback
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[110] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#FFFDF9] border-l-4 border-black shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-4 border-black bg-[#FBF9F6] px-6 py-5">
              <div>
                <h3 className="font-sans text-lg font-black uppercase text-[#111111] tracking-tight flex items-center gap-2">
                  🛒 Shopping Cart <span className="bg-[#FF5000] text-white border-2 border-black text-xs px-2 py-0.5 rounded-md shadow-[1px_1px_0px_0px_#111111]">{cartCount}</span>
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="rounded-lg p-2 text-black hover:bg-stone-200 border-2 border-transparent active:border-black transition-colors cursor-pointer text-xs font-black uppercase tracking-wider"
              >
                ✕ Close
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <span className="text-4xl">🫙</span>
                  <h4 className="font-sans text-sm font-black uppercase tracking-tight text-stone-400">
                    Your cart is empty
                  </h4>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="bg-black hover:bg-[#FF5000] text-white border-2 border-black rounded-lg px-4 py-2 text-xs font-black uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_#FF5000] transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={`${item.id}-${item.size}`}
                        className="flex items-center gap-4 border-2 border-black rounded-xl p-3 bg-white shadow-[2px_2px_0px_0px_#111111] relative"
                      >
                        {/* Thumbnail */}
                        <div className="relative h-16 w-16 shrink-0 border-2 border-black bg-[#FBF9F6] rounded-lg overflow-hidden">
                          <Image
                            src={item.image || getProductImage(item.id)}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-sans text-xs font-black uppercase text-black truncate">
                            {item.name}
                          </h4>
                          <span className="text-[10px] font-bold text-stone-500 uppercase">
                            Size: {item.size}
                          </span>
                          
                          {/* Quantity and Price row */}
                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center border-2 border-black rounded-lg overflow-hidden bg-white max-w-[90px]">
                              <button
                                onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                className="px-2 py-0.5 text-xs font-black hover:bg-stone-100 border-r border-black select-none cursor-pointer"
                              >
                                -
                              </button>
                              <span className="flex-1 text-center font-bold text-xs text-black min-w-[20px]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                className="px-2 py-0.5 text-xs font-black hover:bg-stone-100 border-l border-black select-none cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                            
                            {/* Price */}
                            <span className="text-xs font-black text-[#FF5000]">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="absolute top-2 right-2 text-stone-400 hover:text-red-500 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>


                </>
              )}
            </div>

            {/* Footer calculations & checkout */}
            {cart.length > 0 && (
              <div className="border-t-4 border-black bg-[#FBF9F6] p-6 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold uppercase text-stone-500">
                  <span>Subtotal</span>
                  <span className="text-black text-sm font-black">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold uppercase text-stone-500">
                  <span>Shipping Delivery</span>
                  <span className="text-emerald-600 font-black">FREE SHIPPING</span>
                </div>
                <hr className="border-stone-200 border" />
                <div className="flex justify-between items-center text-sm font-black uppercase text-black">
                  <span>Subtotal Amount</span>
                  <span className="text-lg text-[#FF5000] font-black">₹{cartSubtotal}</span>
                </div>

                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-[#FF5000] hover:bg-black text-white border-2 border-black rounded-lg py-4 text-sm font-black uppercase tracking-widest cursor-pointer shadow-[4px_4px_0px_0px_#111111] transition-all flex items-center justify-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  Proceed To Checkout
                </button>
                <p className="text-[9px] text-stone-500 font-bold uppercase text-center mt-2">
                  🔒 Secure order processed via WhatsApp or Razorpay
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
