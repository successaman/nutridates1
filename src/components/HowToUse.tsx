'use client';

import { motion } from 'framer-motion';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

/* ─── SVG Icons with new Orange/Black Colors ─── */

const MeasuringSpoonIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 28L24 16"
      stroke="#111111"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <ellipse
      cx="27"
      cy="13"
      rx="6"
      ry="5"
      stroke="#111111"
      strokeWidth="3"
      fill="#FF5000"
    />
    <path
      d="M9 31L12 28"
      stroke="#111111"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const GlassIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13 8H27L25 32H15L13 8Z"
      stroke="#111111"
      strokeWidth="3"
      strokeLinejoin="round"
      fill="#F9F7F5"
    />
    <path
      d="M14.5 16H25.5L25 32H15L14.5 16Z"
      fill="#FF5000"
      opacity="0.5"
    />
    <path d="M13 8H27" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const ShakerIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="12"
      y="12"
      width="16"
      height="22"
      rx="2"
      stroke="#111111"
      strokeWidth="3"
      fill="#F9F7F5"
    />
    <path d="M16 6H24V12H16V6Z" stroke="#111111" strokeWidth="3" fill="#FF5000" />
    <path d="M12 20H28" stroke="#111111" strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

const EnjoyIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="14" stroke="#111111" strokeWidth="3" fill="#F9F7F5" />
    <circle cx="15" cy="17" r="2" fill="#111111" />
    <circle cx="25" cy="17" r="2" fill="#111111" />
    <path
      d="M14 24C14 24 16.5 28 20 28C23.5 28 26 24 26 24"
      stroke="#FF5000"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const steps: Step[] = [
  {
    number: 1,
    title: 'Add 15g Powder',
    description: 'One scoop of Nutri Dates into your cup.',
    icon: <MeasuringSpoonIcon />,
  },
  {
    number: 2,
    title: 'Add 200ml Liquid',
    description: 'Works great with cold milk, warm milk, or water.',
    icon: <GlassIcon />,
  },
  {
    number: 3,
    title: 'Shake Well',
    description: 'Shake or stir for a smooth, rich chocolate blend.',
    icon: <ShakerIcon />,
  },
  {
    number: 4,
    title: 'Enjoy Strong!',
    description: 'Sip your daily nutrition and fuel your day.',
    icon: <EnjoyIcon />,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function HowToUse() {
  return (
    <section className="bg-white py-20 px-6 md:px-12 overflow-hidden border-b border-[#E3DCD5]">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-black uppercase text-[#111111] tracking-tight">
            Ready In <span className="text-[#FF5000]">60 Seconds</span>
          </h2>
          <div className="mt-4 mx-auto h-1.5 w-16 bg-[#FF5000]" />
        </motion.div>

        {/* ── Desktop / Tablet: Horizontal Timeline ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="hidden sm:grid sm:grid-cols-4 gap-0 relative"
        >
          {/* Connecting line */}
          <div className="absolute top-[20px] left-[12.5%] right-[12.5%] border-t-2 border-black z-0" />

          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={stepVariants}
              className="relative z-10 flex flex-col items-center text-center px-3"
            >
              {/* Number badge */}
              <div className="w-10 h-10 rounded-full bg-[#FF5000] border-2 border-black flex items-center justify-center text-white font-black text-sm shadow-[2px_2px_0px_0px_#111111]">
                {step.number}
              </div>

              {/* Icon container */}
              <div className="w-20 h-20 rounded-xl bg-[#F9F7F5] flex items-center justify-center mt-6 mb-4 border-2 border-black shadow-[4px_4px_0px_0px_#111111]">
                {step.icon}
              </div>

              {/* Text */}
              <h3 className="text-sm font-black uppercase text-[#111111] mb-1.5 leading-snug">
                {step.title}
              </h3>
              <p className="text-xs font-semibold text-[#4E3A2E] leading-relaxed max-w-[180px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Mobile: Vertical Timeline ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="sm:hidden relative pl-12"
        >
          {/* Vertical line */}
          <div className="absolute top-2 bottom-2 left-[19px] border-l-2 border-black z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={stepVariants}
              className={`relative z-10 flex items-start gap-4 ${
                i < steps.length - 1 ? 'pb-10' : ''
              }`}
            >
              {/* Number badge */}
              <div className="absolute -left-12 w-10 h-10 rounded-full bg-[#FF5000] border-2 border-black flex items-center justify-center text-white font-black text-sm shadow-[2px_2px_0px_0px_#111111] shrink-0">
                {step.number}
              </div>

              {/* Content */}
              <div className="flex items-center gap-4 bg-white rounded-xl p-4 border-2 border-black shadow-[4px_4px_0px_0px_#111111] w-full">
                <div className="w-14 h-14 rounded-lg bg-[#F9F7F5] flex items-center justify-center shrink-0 border-2 border-black">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase text-[#111111] mb-0.5">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#4E3A2E] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
