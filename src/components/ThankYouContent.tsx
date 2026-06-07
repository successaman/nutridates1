'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/* ---------- confetti particle ---------- */
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  delay: number;
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
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(generateConfetti(45));
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F9F7F5] px-6 py-20">
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
            ease: 'easeIn' as const,
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
        className="relative z-10 w-full max-w-md text-center"
      >
        {/* Animated Checkmark in Orange/Black */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border-4 border-black bg-[#FF5000] shadow-[4px_4px_0px_0px_#111111]"
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
        <h1 className="mb-3 font-sans text-3xl font-black uppercase tracking-tight text-[#111111] md:text-4xl">
          Order Placed!
        </h1>
        <p className="mb-8 font-semibold text-[#4E3A2E]">
          Your fresh batch of Chocolate Dates Nutrition Powder is being prepared.
        </p>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-8 overflow-hidden rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_#111111]"
        >
          <div className="border-b-2 border-black px-6 py-4 bg-[#F9F7F5]">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#111111]">
              Order Summary
            </h2>
          </div>
          <div className="divide-y border-stone-200 px-6">
            <div className="flex items-center justify-between py-4 text-sm font-semibold text-[#4E3A2E]">
              <span>Product</span>
              <span className="font-bold text-[#111111]">Chocolate Dates Powder</span>
            </div>
            <div className="flex items-center justify-between py-4 text-sm font-semibold text-[#4E3A2E]">
              <span>Quantity</span>
              <span className="font-bold text-[#111111]">1 × 250g Pack</span>
            </div>
            <div className="flex items-center justify-between py-4 text-sm font-semibold text-[#4E3A2E]">
              <span>Amount</span>
              <span className="text-lg font-black text-[#FF5000]">₹299</span>
            </div>
          </div>
        </motion.div>

        {/* WhatsApp Support Button */}
        <motion.a
          href="https://wa.me/917970574329?text=Hello%20Nutri%20Dates%20Team%2C%0A%0AI%20would%20like%20to%20track%20my%20order."
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-emerald-600 transition-colors hover:text-emerald-700"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Track Order on WhatsApp
        </motion.a>

        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-[#111111] px-8 py-3 text-sm font-black uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_#FF5000] hover:bg-[#FF5000] transition-colors"
          >
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
