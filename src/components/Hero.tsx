'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const floatVariants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

export default function Hero() {
  const { setIsCartOpen, cartCount, addToCart } = useCart();

  const whatsappUrl =
    'https://wa.me/917970574329?text=Hello%20Nutri%20Dates%20Team%2C%0A%0AI%20would%20like%20to%20order%20Chocolate%20Dates%20Nutrition%20Powder%20(250g).%0A%0APlease%20assist%20me%20with%20the%20purchase.';
  
  const instagramUrl = 'https://www.instagram.com/nutridatesofficial/';

  const handleBuyNowDirect = () => {
    addToCart({
      id: 'prod_chocolate_mix',
      name: 'Chocolate Dates Nutrition Powder',
      price: 299,
      quantity: 1,
      size: '250g',
    });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-white border-b border-stone-200 flex flex-col"
    >
      {/* ─── Header Navigation Bar ─── */}
      <div className="w-full border-b border-stone-200 bg-[#FBF9F6] z-20">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4 md:px-12">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo-uploaded.jpg"
              alt="Nutri Dates Logo"
              width={50}
              height={50}
              priority
              className="rounded-lg object-contain border border-stone-200 shadow-xs"
            />
            <div className="flex flex-col text-left">
              <span className="text-lg font-black tracking-tighter text-[#111111] leading-none uppercase">
                Nutri Dates
              </span>
              <span className="text-[9px] font-bold tracking-widest text-[#FF5000] uppercase mt-1">
                Sip The Strength
              </span>
            </div>
          </div>
          
          {/* Actions: Cart & Instagram */}
          <div className="flex items-center gap-3">
            {/* Cart Icon Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 rounded-lg border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-wider text-black bg-white shadow-[2px_2px_0px_0px_#111111] hover:bg-[#FF5000] hover:text-white transition-colors cursor-pointer"
            >
              🛒 Cart
              {cartCount > 0 && (
                <span className="bg-[#FF5000] text-white border border-black text-[10px] px-1.5 py-0.5 rounded-md leading-none ml-1">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Instagram Button */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-wider text-black bg-white shadow-[2px_2px_0px_0px_#111111] hover:bg-[#FF5000] hover:text-white transition-colors cursor-pointer"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Bold minimal background grids */}
      <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(#111 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex-1 flex flex-col items-center justify-center px-6 py-12 md:px-12 lg:flex-row lg:gap-16 max-w-7xl w-full"
      >
        {/* Left: Text Content */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          {/* Bold Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl font-black leading-[0.95] tracking-tighter sm:text-6xl md:text-7xl lg:text-[5.5rem] uppercase text-[#111111]"
          >
            SIP THE
            <br />
            <span className="text-[#FF5000]">STRENGTH</span>
          </motion.h1>

          {/* Bold Minimal Description */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-md text-base font-semibold leading-relaxed text-[#3A2415] md:max-w-lg md:text-lg"
          >
            Nutri Dates is India&apos;s premium Date-Based Chocolate Nutrition Powder made with real dates, rich cocoa, oats, and dry fruits. The perfect natural health drink for kids and adults, providing clean daily energy without any added refined sugar.
          </motion.p>

          {/* Pricing Info */}
          <motion.div variants={itemVariants} className="mt-8">
            <div className="inline-flex items-baseline gap-3 rounded-xl border-2 border-black px-5 py-2.5 bg-white shadow-[4px_4px_0px_0px_#111111]">
              <span className="text-3xl font-black text-[#111111]">₹299</span>
              <span className="text-sm font-bold text-[#4E3A2E] tracking-tight border-l border-stone-300 pl-3">
                250g Pack (16 Servings)
              </span>
            </div>
          </motion.div>

          {/* Bold CTA Actions */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col w-full sm:w-auto gap-4 sm:flex-row"
          >
            {/* Buy Now (Online) */}
            <motion.button
              onClick={handleBuyNowDirect}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              className="inline-flex items-center justify-center rounded-lg bg-[#FF5000] px-8 py-4 text-base font-bold uppercase tracking-wider text-white border-2 border-black shadow-[4px_4px_0px_0px_#111111] transition-transform cursor-pointer"
            >
              Buy Now (Online)
            </motion.button>

            {/* Buy on WhatsApp */}
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-white px-8 py-4 text-base font-bold uppercase tracking-wider text-emerald-600 border-2 border-emerald-600 shadow-[4px_4px_0px_0px_#059669] transition-transform"
            >
              Buy on WhatsApp
            </motion.a>
          </motion.div>
        </div>

        {/* Right: Product Image */}
        <motion.div
          variants={itemVariants}
          className="relative mt-12 flex flex-1 items-center justify-center lg:mt-0"
        >
          <motion.div
            variants={floatVariants}
            animate="animate"
            className="relative p-2 border-4 border-black bg-white rounded-2xl shadow-[12px_12px_0px_0px_#111111] overflow-hidden max-w-sm sm:max-w-md"
          >
            <Image
              src="/images/mockup-kitchen.jpg"
              alt="Nutri Dates Pack Shot"
              width={480}
              height={380}
              priority
              className="h-auto w-full object-cover rounded-lg"
            />
            
            {/* Absolute badge */}
            <div className="absolute top-4 right-4 bg-[#FF5000] border-2 border-black text-white text-xs font-black uppercase px-3 py-1.5 tracking-wider rotate-3">
              Fresh Batch
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
