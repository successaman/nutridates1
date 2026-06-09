'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'What are the main ingredients in Nutri Dates?',
    a: 'Nutri Dates contains only four natural, clean ingredients: dehydrated premium dates, pure cocoa powder, rolled oats, and mixed dry fruits (almonds, cashews, pistachios). It contains zero refined sugar, zero preservatives, and zero chemical fillers.',
  },
  {
    q: 'Does Nutri Dates contain added refined sugar?',
    a: 'No, Nutri Dates contains 0% added refined sugar. All sweetness is derived naturally from dehydrated whole dates, making it an excellent replacement for sugary drink mixes.',
  },
  {
    q: 'Is dates powder safe for toddlers and kids?',
    a: 'Yes, dates powder is a whole food ingredient made by grinding dehydrated dates, making it completely safe and highly recommended for children as an alternative to sugary commercial chocolate mixes.',
  },
  {
    q: 'Can I use Nutri Dates as a pre-workout drink?',
    a: 'Yes! The combination of quick-release natural sugars from dates (for glycogen replenishment) and slow-release energy from complex oats makes it a perfect natural pre-workout fuel.',
  },
  {
    q: 'Can diabetic patients consume Nutri Dates?',
    a: 'Dates have a low-to-medium Glycemic Index (GI) and do not spike blood sugar like refined white sugar. However, diabetic patients should track their daily carb allowance and consult their dietician.',
  },
  {
    q: 'Do you offer shipping across India and Jharkhand?',
    a: 'Yes, we ship express across India directly from our facility in Hazaribagh, Jharkhand. Standard shipping takes 1-2 days inside Jharkhand/Bihar, and 3-5 business days for other states.',
  },
  {
    q: 'What is the shelf life of Nutri Dates powder?',
    a: 'Nutri Dates has a shelf life of 6 months. Since it contains no artificial preservatives or stabilizers, keep it sealed in a cool, dry place away from moisture.',
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

  const faqPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <section className="bg-white py-20 md:py-28 px-6 border-b border-[#E3DCD5]">
      {/* Dynamic FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }}
      />
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
