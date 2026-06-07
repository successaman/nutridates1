'use client';

import { motion } from 'framer-motion';

const reviews = [
  {
    quote:
      'Finally a drink mix that actually tastes good without all the sugar! My kids love it too.',
    name: 'Anita S.',
    title: 'Mother',
  },
  {
    quote:
      'I replaced my morning coffee with Nutri Dates and I feel so much more energetic throughout the day.',
    name: 'Rahul K.',
    title: 'Software Engineer',
  },
  {
    quote:
      'Best nutrition powder I have tried. The chocolate taste is amazing and I love that it is made with dates.',
    name: 'Priya M.',
    title: 'College Student',
  },
  {
    quote:
      'Affordable, tasty, and actually healthy. What more could you ask for? Ordering my third pack!',
    name: 'Vikram P.',
    title: 'Fitness Enthusiast',
  },
  {
    quote:
      'My entire family drinks this every morning. It is our new healthy ritual. Thank you Nutri Dates!',
    name: 'Sunita D.',
    title: 'Homemaker',
  },
  {
    quote:
      'As a nutritionist, I appreciate the ingredient transparency. Real dates, real oats, real nutrition.',
    name: 'Dr. Meena R.',
    title: 'Nutritionist',
  },
];

function Stars() {
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="w-5 h-5 text-[#FF5000]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function Reviews() {
  return (
    <section className="bg-white py-20 px-6 md:px-12 border-b border-[#E3DCD5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl sm:text-5xl font-black uppercase text-[#111111] tracking-tight">
            Loved By <span className="text-[#FF5000]">Hundreds</span>
          </h2>
          <p className="mt-4 text-[#4E3A2E] text-base font-semibold">
            Real feedback from verified daily customers.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <Stars />
            <span className="text-lg font-black text-[#111111] ml-1">4.8 / 5.0</span>
            <span className="text-[#4E3A2E] text-xs font-bold uppercase tracking-wider">(250+ reviews)</span>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {reviews.map((review) => (
            <motion.div
              key={review.name}
              variants={cardVariants}
              className="bg-[#F9F7F5] rounded-xl p-6 border-2 border-black shadow-[4px_4px_0px_0px_#111111]"
            >
              <Stars />
              <p className="font-bold text-[#111111] text-sm md:text-base leading-relaxed mb-6">
                &ldquo;{review.quote}&rdquo;
              </p>
              <div className="pt-4 border-t border-[#E3DCD5]">
                <p className="font-black text-[#111111] text-xs uppercase">
                  {review.name}
                </p>
                <p className="text-[10px] font-bold text-[#FF5000] uppercase mt-0.5">{review.title}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
