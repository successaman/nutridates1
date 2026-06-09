'use client';

import { motion } from 'framer-motion';

const comparisonData = [
  {
    feature: 'Primary Sweetener',
    nutriDates: '100% Dehydrated Premium Dates',
    commercial: 'Up to 50% Added Refined Sugar (Sucrose, Glucose Syrup)',
    highlight: true,
  },
  {
    feature: 'Fiber & Digestibility',
    nutriDates: 'Rolled Oats (Soluble & Insoluble Fiber)',
    commercial: 'Starch, Maltodextrin, Wheat Gluten (Empty binders)',
    highlight: false,
  },
  {
    feature: 'Nutritional Value',
    nutriDates: 'Real Almonds, Cashews, and Pistachios',
    commercial: 'Synthetic Fortified Vitamins (Lower bio-availability)',
    highlight: true,
  },
  {
    feature: 'Chemical Preservatives',
    nutriDates: '0% Fillers, Preservatives, or Artificial Gums',
    commercial: 'Guar Gums, Cellulose Gums, Preservatives',
    highlight: false,
  },
  {
    feature: 'Sourcing Sincerity',
    nutriDates: 'Directly sourced & packaged in Hazaribagh, Jharkhand',
    commercial: 'Mass industrial processing factories with middle-men',
    highlight: true,
  },
];

export default function ProductComparison() {
  return (
    <section className="bg-[#FBF9F6] py-20 md:py-28 px-6 border-b border-[#E3DCD5] overflow-x-auto">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block border-2 border-black bg-[#FF5000] text-white text-xs font-black tracking-widest uppercase px-3.5 py-1.5 mb-6">
            Compare The Difference
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-[#111111] tracking-tight">
            NUTRITION COMPARISON
          </h2>
          <p className="mt-4 text-sm font-semibold text-[#4E3A2E] max-w-xl mx-auto leading-relaxed">
            Ditch the hidden sugar traps. Compare Nutri Dates with leading commercial chocolate milk additives.
          </p>
        </motion.div>

        {/* Semantic HTML Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="border-4 border-black bg-white rounded-xl shadow-[8px_8px_0px_0px_#111111] overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left text-sm font-bold text-[#4E3A2E]">
              <thead>
                <tr className="border-b-4 border-black bg-[#2B1D14] text-white uppercase text-xs tracking-wider">
                  <th className="p-4 md:p-6 border-r-2 border-black w-1/4">Comparison Factor</th>
                  <th className="p-4 md:p-6 border-r-2 border-black bg-[#FF5000] text-white w-3/8 text-center">
                    Nutri Dates Chocolate Mix
                  </th>
                  <th className="p-4 md:p-6 w-3/8 text-center bg-stone-100 text-[#111111]">
                    Sugary Commercial Drinks
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => (
                  <tr
                    key={row.feature}
                    className={`border-b-2 border-black last:border-0 hover:bg-[#F9F7F5] transition-colors`}
                  >
                    <td className="p-4 md:p-6 border-r-2 border-black bg-[#FBF9F6] text-[#111111] uppercase tracking-tight text-xs">
                      {row.feature}
                    </td>
                    <td className="p-4 md:p-6 border-r-2 border-black text-center text-black font-extrabold bg-[#FF5000]/5">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-emerald-600 text-base">✔</span>
                        <span>{row.nutriDates}</span>
                      </div>
                    </td>
                    <td className="p-4 md:p-6 text-center text-stone-500 bg-stone-50">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-red-500 text-sm">✖</span>
                        <span>{row.commercial}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Small disclosure */}
        <p className="mt-6 text-[10px] text-center font-bold text-stone-500 uppercase tracking-wide">
          Nutritional comparison based on standard chemical analysis of ingredients. Nutri Dates contains 0% sucrose syrup or filler maltodextrin.
        </p>
      </div>
    </section>
  );
}
