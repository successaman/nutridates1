import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Disclaimer & Disclosures | Nutri Dates',
  description: 'Nutritional disclosures and product usage guidelines for Nutri Dates nutrition drink powder.',
  alternates: {
    canonical: 'https://nutridates.in/disclaimer',
  },
};

export default function Disclaimer() {
  return (
    <>
      <Breadcrumbs />
      <main className="min-h-screen bg-[#FBF9F6] px-6 py-12 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <Link href="/" className="text-xs font-black uppercase text-[#FF5000] hover:underline">
              &larr; Back to Home
            </Link>
          </div>

          <article className="border-4 border-black bg-white p-8 md:p-12 rounded-xl shadow-[6px_6px_0px_0px_#111111]">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[#111111] mb-6">
              NUTRITIONAL DISCLAIMER
            </h1>

            <p className="text-xs font-bold text-stone-500 mb-6">Last Updated: June 9, 2026</p>

            <div className="space-y-6 text-sm font-semibold text-[#4E3A2E] leading-relaxed">
              <p>
                The information provided on this website, labels, or marketing materials for Nutri Dates is for nutritional and educational purposes only. It is not intended as medical advice or as a substitute for professional healthcare guidance.
              </p>

              <h2 className="text-lg font-black uppercase text-[#111111] mt-8">1. Not Medical Advice</h2>
              <p>
                Nutri Dates Chocolate Dates Nutrition Powder is a food product and nutritional supplement. It is not formulated to diagnose, treat, cure, or prevent any chronic disease, illness, or medical condition.
              </p>
              <p>
                If you have pre-existing health conditions, are pregnant, nursing, taking medications, or planning a medical procedure, consult with a qualified medical professional or doctor before introducing new health supplements into your daily diet.
              </p>

              <h2 className="text-lg font-black uppercase text-[#111111] mt-8">2. Ingredient & Allergy Information</h2>
              <p>
                Our product is crafted using: Premium Dates, Pure Cocoa, Oats, and mixed Dry Fruits (almonds, cashews, pistachios). 
              </p>
              <p className="border-2 border-[#FF5000] p-4 bg-[#FF5000]/5 rounded-lg font-bold text-black">
                ⚠️ ALLERGY WARNING: Contains Tree Nuts (Almonds, Cashews, Pistachios) and Oats (Gluten). Manufactured in a facility that handles dry agricultural products.
              </p>

              <h2 className="text-lg font-black uppercase text-[#111111] mt-8">3. Individual Results May Vary</h2>
              <p>
                Wellness benefits, stamina improvements, and energy levels derived from dates nutrition drink depend on overall diet, physical activity, metabolism, and age. Individual results may vary.
              </p>

              <h2 className="text-lg font-black uppercase text-[#111111] mt-8">4. Accuracy of Information</h2>
              <p>
                While we make every effort to ensure that nutritional values, caloric details, and health research cited on this page are correct, scientific understandings can evolve over time. We do not guarantee absolute accuracy or completeness of external research references.
              </p>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
