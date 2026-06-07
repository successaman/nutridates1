'use client';

import { motion } from 'framer-motion';

const features = [
  {
    num: '01',
    title: 'Real Ingredients',
    description:
      'Made with dates, oats, dry fruits, and cocoa. No artificial fillers.',
  },
  {
    num: '02',
    title: 'Natural Energy',
    description:
      'Powered by slow-release carbohydrates from dates and oats.',
  },
  {
    num: '03',
    title: 'Rich Fiber & Nutrition',
    description:
      'Whole oats and dates provide essential fiber for easy digestion.',
  },
  {
    num: '04',
    title: 'Rich Chocolate Taste',
    description:
      'Rich chocolate flavor from premium cocoa that feels like a treat.',
  },
  {
    num: '05',
    title: 'Convenient Routine',
    description:
      'Mix, shake, and enjoy in 60 seconds. Perfect for busy lifestyles.',
  },
  {
    num: '06',
    title: 'Honest Pricing',
    description:
      'Just ₹18.7 per serving. Premium clean nutrition at an honest price.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function WhyNutriDates() {
  return (
    <section className="bg-white py-20 px-6 md:px-12 border-b border-[#E3DCD5]">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black uppercase text-[#111111] tracking-tight">
            Why <span className="text-[#FF5000]">Nutri Dates</span>?
          </h2>
          <div className="mt-4 mx-auto h-1.5 w-16 bg-[#FF5000]" />
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="group bg-[#F9F7F5] rounded-xl p-6 border-2 border-black shadow-[4px_4px_0px_0px_#111111] transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="text-2xl font-black text-[#FF5000] block mb-3">
                {feature.num}
              </span>
              <h3 className="text-lg font-black uppercase text-[#111111] mb-2">
                {feature.title}
              </h3>
              <p className="text-[#4E3A2E] font-medium text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
