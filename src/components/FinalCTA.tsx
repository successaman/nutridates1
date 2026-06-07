'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const whatsappLink =
  'https://wa.me/917970574329?text=Hello%20Nutri%20Dates%20Team%2C%0A%0AI%20would%20like%20to%20order%20Chocolate%20Dates%20Nutrition%20Powder%20(250g).%0A%0APlease%20assist%20me%20with%20the%20purchase.';

export default function FinalCTA() {
  return (
    <section
      id="order"
      className="relative overflow-hidden py-20 md:py-28 bg-[#3A2415] border-b border-[#E3DCD5]"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
          className="mb-6 inline-flex items-center gap-2 rounded-md border-2 border-white bg-[#FF5000] px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-[2px_2px_0px_0px_#111111]"
        >
          Start Today
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-6 font-sans text-4xl font-black uppercase leading-tight text-white md:text-5xl lg:text-6xl"
        >
          Sip The Strength Daily
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mb-10 max-w-lg text-base font-semibold text-[#F9F7F5]/80"
        >
          Join hundreds of Indians switching to date-based clean nutrition drink.
        </motion.p>

        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative mx-auto mb-10 w-64 border-4 border-black bg-white rounded-xl shadow-[8px_8px_0px_0px_#111111] overflow-hidden"
        >
          <Image
            src="/images/mockup-pedestal.jpg"
            alt="Nutri Dates Chocolate Dates Nutrition Powder Packaging"
            width={320}
            height={260}
            className="w-full h-auto object-cover"
          />
        </motion.div>

        {/* Price */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <p className="text-5xl font-black text-white">₹299</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#F9F7F5]/60">
            250g Pack · 16 Servings · ₹18.7 per serving
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          {/* BUY NOW */}
          <motion.a
            href="#razorpay"
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            className="inline-flex w-full items-center justify-center rounded-lg border-2 border-black bg-[#FF5000] px-10 py-4 text-base font-black uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_#111111] sm:w-auto"
          >
            BUY NOW (Online)
          </motion.a>

          {/* WhatsApp */}
          <motion.a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-emerald-600 bg-white px-10 py-4 text-base font-black uppercase tracking-wider text-emerald-600 shadow-[4px_4px_0px_0px_#059669] sm:w-auto"
          >
            Buy on WhatsApp
          </motion.a>
        </motion.div>

        {/* Urgency */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F9F7F5]/50"
        >
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          Freshly Prepared Batch · Free Shipping
        </motion.div>
      </div>
    </section>
  );
}
