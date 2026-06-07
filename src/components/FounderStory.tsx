'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function FounderStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={sectionRef} className="bg-white py-20 md:py-28 px-6 overflow-hidden border-b border-[#E3DCD5]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column — Founder Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center lg:items-start"
          >
            <div className="relative w-full max-w-md overflow-hidden border-4 border-black rounded-xl bg-white shadow-[8px_8px_0px_0px_#111111]">
              <motion.div style={{ y: imageY }} className="w-full">
                <Image
                  src="/images/founder.png"
                  alt="Priyam Gupta — Founder of Nutri Dates"
                  width={600}
                  height={600}
                  className="aspect-square object-cover w-full scale-110"
                  priority
                />
              </motion.div>
            </div>
            <div className="mt-6 text-center lg:text-left">
              <p className="text-xl font-black uppercase text-[#111111]">Priyam Gupta</p>
              <p className="text-xs font-black uppercase tracking-wider text-[#FF5000] mt-1">
                Founder, Nutri Dates
              </p>
            </div>
          </motion.div>

          {/* Right Column — Story */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Pill */}
            <span className="inline-block border-2 border-black bg-[#FF5000] text-white text-xs font-black tracking-widest uppercase px-3.5 py-1.5 mb-6">
              Our Story
            </span>

            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl font-black uppercase text-[#111111] tracking-tight leading-none mb-8">
              Started At 16,
              <br />
              On A Mission
            </h2>

            {/* Story Paragraphs */}
            <div className="space-y-5 text-[#4E3A2E] text-base font-semibold leading-relaxed">
              <p>
                At just 16, Priyam Gupta looked at the beverages around him —
                sugary drink mixes, artificial fillers, and empty promises. He
                knew there had to be a better way.
              </p>
              <p>
                Born from this frustration in Hazaribagh, Jharkhand, Nutri Dates combines the natural
                sweetness of dates with the nutrition of oats, dry fruits, and
                the rich taste of cocoa.
              </p>
              <p>
                This isn&apos;t just another milkshake powder. It&apos;s a mission to make real, clean nutrition accessible, affordable, and delicious for everyone.
              </p>
            </div>

            {/* Signature */}
            <motion.p
              className="mt-10 text-[#FF5000] text-base font-black uppercase tracking-wider"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              — Priyam Gupta, Founder
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
