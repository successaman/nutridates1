'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface NutrientData {
  label: string;
  value: string;
  percent: number;
  color: string;
  description: string;
}

const nutrients: NutrientData[] = [
  {
    label: 'Calories',
    value: '390–420',
    percent: 40,
    color: '#FF5000', // Orange
    description: 'kcal of daily energy',
  },
  {
    label: 'Protein',
    value: '32–35g',
    percent: 33,
    color: '#3A2415', // Cocoa Brown
    description: 'For muscle & active support',
  },
  {
    label: 'Carbohydrates',
    value: '40–45g',
    percent: 43,
    color: '#111111', // Black
    description: 'Slow-release complex fuel',
  },
  {
    label: 'Natural Sugars',
    value: '20–25g',
    percent: 23,
    color: '#FF5000', // Orange
    description: '100% from whole dates',
  },
  {
    label: 'Fat',
    value: '6–8g',
    percent: 10,
    color: '#4E3A2E', // Medium Brown
    description: 'Healthy fats only',
  },
  {
    label: 'Fiber',
    value: '5–7g',
    percent: 12,
    color: '#111111', // Black
    description: 'For digestion and satiety',
  },
];

const RING_SIZE = 100;
const STROKE_WIDTH = 10;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function NutrientRing({ nutrient, index }: { nutrient: NutrientData; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  const offset = CIRCUMFERENCE - (nutrient.percent / 100) * CIRCUMFERENCE;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: 'easeOut' as const,
      }}
      className="bg-white rounded-xl p-6 flex flex-col items-center text-center border-2 border-black shadow-[4px_4px_0px_0px_#111111]"
    >
      {/* SVG Ring */}
      <div className="relative mb-4" style={{ width: RING_SIZE, height: RING_SIZE }}>
        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          className="-rotate-90"
        >
          {/* Background track */}
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#E3DCD5"
            strokeWidth={STROKE_WIDTH}
          />
          {/* Animated progress */}
          <motion.circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={nutrient.color}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="square"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={
              isInView
                ? { strokeDashoffset: offset }
                : { strokeDashoffset: CIRCUMFERENCE }
            }
            transition={{
              duration: 1.0,
              delay: index * 0.08,
              ease: 'easeOut' as const,
            }}
          />
        </svg>

        {/* Center value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.3, delay: index * 0.08 + 0.3 }}
            className="text-sm font-black text-[#111111] leading-tight"
          >
            {nutrient.value}
          </motion.span>
        </div>
      </div>

      {/* Label */}
      <h3 className="text-base font-black uppercase text-[#111111] mb-1">
        {nutrient.label}
      </h3>
      <p className="text-xs font-semibold text-[#4E3A2E]">{nutrient.description}</p>
    </motion.div>
  );
}

export default function NutritionDashboard() {
  return (
    <section className="bg-[#F9F7F5] py-20 px-6 md:px-12 border-b border-[#E3DCD5]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black uppercase text-[#111111] tracking-tight">
            Nutrition <span className="text-[#FF5000]">Dashboard</span>
          </h2>
          <p className="mt-4 text-[#4E3A2E] text-base font-semibold">
            Per 100g · 100% Honest Nutritional Transparency
          </p>
          <div className="mt-4 mx-auto h-1.5 w-16 bg-[#FF5000]" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nutrients.map((nutrient, i) => (
            <NutrientRing key={nutrient.label} nutrient={nutrient} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
