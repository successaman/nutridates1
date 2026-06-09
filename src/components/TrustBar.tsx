'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const badges = [
  { label: 'Real Ingredients', desc: 'No artificial additives' },
  { label: 'No Refined Sugar', desc: 'Naturally sweetened' },
  { label: '16 Servings', desc: '15g daily serving' },
  { label: '250g Pack', desc: 'Perfect shelf life' },
  { label: 'Pan-India Shipping', desc: 'Express dispatch from Hazaribagh' },
] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function TrustBar() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <section
      className="w-full py-12 border-b border-[#E3DCD5] bg-[#F9F7F5]"
    >
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="scrollbar-hide mx-auto flex max-w-7xl gap-4 overflow-x-auto px-6 md:grid md:grid-cols-5 md:gap-5 md:px-12"
      >
        {badges.map((badge) => (
          <motion.div
            key={badge.label}
            variants={badgeVariants}
            className="flex min-w-[170px] shrink-0 flex-col justify-center rounded-lg border-2 border-black p-4 bg-white shadow-[2px_2px_0px_0px_#111111] md:min-w-0"
          >
            <span
              className="text-sm font-black uppercase tracking-tighter text-[#111111]"
            >
              {badge.label}
            </span>
            <span
              className="text-xs font-semibold text-[#4E3A2E] mt-1"
            >
              {badge.desc}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Hide scrollbar utility */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
