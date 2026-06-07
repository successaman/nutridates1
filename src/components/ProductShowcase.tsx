'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const benefits = [
  'Real Dates, Oats & Dry Fruits',
  'Date-Based Natural Sweetness',
  'No Refined Sugar or Chemical Additives',
  'Rich Fiber & Minerals in Every Sip',
  'Easy to Prepare in 60 Seconds',
];

export default function ProductShowcase() {
  return (
    <section
      className="w-full py-20 md:py-28 overflow-hidden bg-[#F9F7F5] border-b border-[#E3DCD5]"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Product Image Card */}
          <motion.div
            className="relative flex justify-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut' as const }}
          >
            <div className="relative w-full max-w-md aspect-4/3 sm:aspect-video lg:aspect-square border-4 border-black rounded-2xl overflow-hidden bg-white shadow-[8px_8px_0px_0px_#111111]">
              <Image
                src="/images/mockup-pedestal.jpg"
                alt="Nutri Dates Chocolate Dates Nutrition Powder Packs"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </motion.div>

          {/* Right — Product Info */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              duration: 0.6,
              ease: 'easeOut' as const,
            }}
          >
            {/* Tag */}
            <span
              className="inline-block self-start border-2 border-black bg-[#FF5000] text-white text-xs font-black tracking-widest uppercase px-3.5 py-1.5 mb-6"
            >
              The Formulation
            </span>

            {/* Heading */}
            <h2
              className="text-4xl md:text-5xl font-black uppercase text-[#111111] mb-6"
            >
              Chocolate Dates
              <br />
              Nutrition Powder
            </h2>

            {/* Description */}
            <p className="text-[#4E3A2E] text-base font-semibold leading-relaxed mb-8 max-w-lg">
              Crafted in Hazaribagh, Jharkhand, Nutri Dates combines dates, oats, dry fruits, and premium cocoa into a delicious milkshake powder. A healthy alternative that kids and adults love.
            </p>

            {/* Benefits List */}
            <ul className="space-y-4 mb-10">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-3 text-sm md:text-base font-bold text-[#111111]"
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-black bg-[#FF5000]"
                  >
                    <svg
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={4}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <motion.a
              href="#razorpay"
              className="inline-flex self-start items-center justify-center rounded-lg border-2 border-black bg-[#111111] px-8 py-4 text-sm md:text-base font-bold uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_#FF5000] hover:bg-[#FF5000] hover:shadow-[4px_4px_0px_0px_#111111] transition-all"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              Order Now — ₹299
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
