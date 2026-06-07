'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const ingredients = [
  {
    name: 'Dates',
    image: '/images/dates.png',
    benefits: ['Natural Energy', 'Natural Sweetness', 'Vitamins & Minerals'],
  },
  {
    name: 'Oats',
    image: '/images/oats.png',
    benefits: ['Rich Fiber', 'Balanced Nutrition', 'Satiety Support'],
  },
  {
    name: 'Dry Fruits',
    image: '/images/dryfruits.png',
    benefits: ['Healthy Fats', 'Micronutrients', 'Taste Enhancement'],
  },
  {
    name: 'Cocoa',
    image: '/images/cocoa.png',
    benefits: ['Rich Chocolate Taste', 'Antioxidants', 'Premium Flavor'],
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

export default function IngredientStory() {
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
            Crafted With <span className="text-[#FF5000]">Nature&apos;s Best</span>
          </h2>
          <p className="mt-5 text-base font-semibold text-[#4E3A2E] leading-relaxed">
            Every ingredient chosen with pure purpose. Nothing artificial.
          </p>
        </motion.div>

        {/* Ingredient Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {ingredients.map((ingredient) => (
            <motion.div
              key={ingredient.name}
              variants={cardVariants}
              className="group rounded-xl overflow-hidden border-2 border-black bg-white shadow-[4px_4px_0px_0px_#111111] transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-48 md:h-56 overflow-hidden border-b-2 border-black">
                <Image
                  src={ingredient.image}
                  alt={ingredient.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <h3
                  className="text-2xl font-black uppercase text-[#111111] mb-4"
                >
                  {ingredient.name}
                </h3>

                {/* Benefit Pills */}
                <div className="flex flex-wrap gap-2">
                  {ingredient.benefits.map((benefit) => (
                    <span
                      key={benefit}
                      className="inline-block border border-black bg-[#F9F7F5] rounded-md px-3 py-1 text-xs font-bold text-[#111111]"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
