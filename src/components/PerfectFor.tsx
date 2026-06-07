'use client';

import { motion } from 'framer-motion';

const audiences = [
  {
    title: 'Students',
    description:
      'Quick nutrition between classes. Clean energy for long study sessions without sugar crashes.',
    tag: 'Quick Energy',
  },
  {
    title: 'Professionals',
    description:
      'A healthy daily drink that saves time. Ditch the sugary office tea and chemical energy cans.',
    tag: 'Time Saving',
  },
  {
    title: 'Families',
    description:
      'A wholesome, clean alternative for the home. Premium nutrition that everyone actually enjoys.',
    tag: 'Better Choice',
  },
  {
    title: 'Health Conscious',
    description:
      'Natural ingredients with no added refined sugar. Transparent labels and real nutrition.',
    tag: 'Natural',
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function PerfectFor() {
  return (
    <section className="bg-[#F9F7F5] py-20 px-6 md:px-12 border-b border-[#E3DCD5]">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl sm:text-5xl font-black uppercase text-[#111111] tracking-tight">
            Perfect For <span className="text-[#FF5000]">Everyone</span>
          </h2>
          <div className="mt-4 mx-auto h-1.5 w-16 bg-[#FF5000]" />
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {audiences.map((item) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              className="group bg-white rounded-xl p-6 flex flex-col justify-between border-2 border-black shadow-[4px_4px_0px_0px_#111111] transition-transform duration-300 hover:-translate-y-1"
            >
              <div>
                <h3 className="text-xl font-black uppercase text-[#111111] mb-3">
                  {item.title}
                </h3>
                <p className="text-[#4E3A2E] font-medium text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E3DCD5]">
                <span className="inline-block text-xs font-black uppercase tracking-wider text-[#FF5000] bg-[#FF5000]/10 px-3 py-1 rounded-md">
                  {item.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
