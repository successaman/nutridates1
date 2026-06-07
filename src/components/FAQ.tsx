'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'What is Nutri Dates?',
    a: 'Nutri Dates is a chocolate dates nutrition powder made with real dates, oats, dry fruits, and cocoa. It is a healthier and tastier alternative to traditional sugary drink mixes.',
  },
  {
    q: 'How do I prepare it?',
    a: 'Simply mix 15g of Nutri Dates with 200ml of milk or water and shake well. Your nutritious chocolate drink is ready in under 60 seconds.',
  },
  {
    q: 'What is the shelf life?',
    a: 'Nutri Dates has a shelf life of 60 days. Store in a cool, dry place away from direct sunlight.',
  },
  {
    q: 'How many servings are in one pack?',
    a: 'Each 250g pack contains approximately 16 servings of 15g each.',
  },
  {
    q: 'How should I store it?',
    a: 'Store in a cool, dry place. Keep the pack sealed after each use. Avoid exposure to moisture and direct sunlight.',
  },
  {
    q: 'Do you offer shipping across India?',
    a: 'Yes, we ship across India. Standard orders are typically delivered within 5-7 business days. We offer free shipping on all orders.',
  },
  {
    q: 'Is it suitable for children?',
    a: 'Yes! Nutri Dates is made with natural ingredients and is suitable for children above 3 years of age. It makes a great alternative to sugary chocolate drinks.',
  },
];

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <motion.svg
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' as const }}
      className="w-5 h-5 text-[#FF5000] flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </motion.svg>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="bg-white py-20 md:py-28 px-6 border-b border-[#E3DCD5]">
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl sm:text-5xl font-black uppercase text-[#111111] tracking-tight">
            Frequently Asked <span className="text-[#FF5000]">Questions</span>
          </h2>
          <div className="mt-4 mx-auto h-1.5 w-16 bg-[#FF5000]" />
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="border-2 border-black rounded-lg bg-[#F9F7F5] overflow-hidden"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between gap-4 text-left cursor-pointer p-5 bg-[#F9F7F5]"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-black uppercase tracking-tight text-[#111111]">
                    {faq.q}
                  </span>
                  <ChevronIcon isOpen={isOpen} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.25, ease: 'easeOut' as const },
                        opacity: { duration: 0.15, ease: 'easeInOut' as const },
                      }}
                      className="overflow-hidden bg-white border-t-2 border-black"
                    >
                      <p className="p-5 text-[#4E3A2E] text-sm md:text-base font-semibold leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
