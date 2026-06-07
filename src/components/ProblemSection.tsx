'use client';

import { motion } from 'framer-motion';

const problems = [
  {
    num: '01',
    title: 'Sugary Drinks',
    description: 'Loaded with refined sugar and artificial chemical sweeteners.',
  },
  {
    num: '02',
    title: 'Artificial Ingredients',
    description: 'Chemical preservatives, stabilizers, and synthetic flavors.',
  },
  {
    num: '03',
    title: 'Complicated Labels',
    description: 'Confusing health claims that hide the actual ingredients.',
  },
  {
    num: '04',
    title: 'Unhealthy Routines',
    description: 'Quick sugary fixes that lead to energy crashes later.',
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
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};

export default function ProblemSection() {
  return (
    <section
      className="w-full py-20 md:py-28 bg-white border-b border-[#E3DCD5]"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        {/* Header */}
        <motion.div
          className="mx-auto max-w-2xl text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="text-4xl md:text-5xl font-black uppercase text-[#111111]"
          >
            The Drinks You Trust Are <span className="text-[#FF5000]">Failing You</span>
          </h2>
          <p className="mt-5 text-base font-semibold text-[#4E3A2E] leading-relaxed">
            Most daily drink mixes are packed with refined sugars, fillers, and chemical ingredients. You deserve transparency.
          </p>
        </motion.div>

        {/* Problem Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {problems.map((problem) => (
            <motion.div
              key={problem.title}
              variants={cardVariants}
              className="group rounded-xl border-2 border-black p-8 bg-white shadow-[4px_4px_0px_0px_#111111]"
            >
              <div className="text-3xl font-black text-[#FF5000] mb-4">
                {problem.num}
              </div>
              <h3
                className="text-xl font-black uppercase text-[#111111] mb-2"
              >
                {problem.title}
              </h3>
              <p className="text-[#4E3A2E] font-medium text-sm md:text-base leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
