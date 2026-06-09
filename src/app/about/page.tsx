import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'About Us & Founder Story | Nutri Dates',
  description:
    'Learn about Nutri Dates, our roots in Hazaribagh, Jharkhand, and our founder Priyam Gupta. Discover our commitment to natural, date-based nutrition without refined sugars.',
  alternates: {
    canonical: 'https://nutridates.in/about',
  },
};

const aboutPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About Nutri Dates",
  "description": "Learn about the roots, mission, and founder of Nutri Dates in Hazaribagh, Jharkhand, India.",
  "publisher": {
    "@type": "Organization",
    "name": "Nutri Dates",
    "logo": {
      "@type": "ImageObject",
      "url": "https://nutridates.in/images/logo-uploaded.jpg"
    }
  },
  "mainEntity": {
    "@type": "Person",
    "name": "Priyam Gupta",
    "jobTitle": "Founder",
    "knowsAbout": ["Nutrition", "Food Tech", "Dates Nutrition", "Entrepreneurship"],
    "image": "https://nutridates.in/images/founder.png"
  }
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
      />
      
      <Breadcrumbs />

      <main className="min-h-screen bg-[#FBF9F6] px-6 py-12 md:py-20">
        <div className="mx-auto max-w-3xl">
          {/* Header Navigation link back */}
          <div className="mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#FF5000] hover:underline"
            >
              &larr; Back to Home
            </Link>
          </div>

          {/* Section 1: H1 Brand Title */}
          <article className="border-4 border-black bg-white p-8 md:p-12 rounded-xl shadow-[8px_8px_0px_0px_#111111]">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#111111] leading-none mb-6">
              ABOUT <span className="text-[#FF5000]">NUTRI DATES</span>
            </h1>
            
            <p className="text-lg font-bold text-[#3A2415] mb-6 leading-relaxed">
              Nutri Dates was founded with a singular, powerful mission: to craft natural, premium daily nutrition options that make wellness accessible and enjoyable for every Indian home.
            </p>

            <div className="space-y-6 text-sm font-semibold text-[#4E3A2E] leading-relaxed">
              <p>
                As a brand born and operated in <span className="text-black font-extrabold">Hazaribagh, Jharkhand</span>, we take pride in our roots. We set out to solve a common dilemma: most health drinks on the market are packed with refined sugars, chemical preservatives, and synthetic flavors. 
              </p>
              <p>
                We believed there was a better way. By utilizing the natural sweetness and dense nutrient profile of premium quality dates, combined with pure cocoa, oats, and rich dry fruits, we created India&apos;s first dedicated date-based chocolate nutrition powder.
              </p>
            </div>

            <hr className="my-10 border-t-2 border-stone-200" />

            {/* Section 2: Founder Profile */}
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#111111] mb-6">
              THE FOUNDER&apos;S STORY
            </h2>

            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
              <div className="relative w-40 h-40 border-4 border-black rounded-xl overflow-hidden bg-stone-100 shadow-[4px_4px_0px_0px_#111111] shrink-0">
                <Image
                  src="/images/founder.png"
                  alt="Priyam Gupta — Founder of Nutri Dates"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase text-[#FF5000] tracking-wide">
                  Priyam Gupta
                </h3>
                <p className="text-xs font-black uppercase text-stone-500 tracking-widest mt-0.5">
                  Founder & CEO, Nutri Dates
                </p>
                <p className="text-sm font-semibold text-[#4E3A2E] mt-4 leading-relaxed">
                  Priyam founded Nutri Dates in Hazaribagh after identifying the critical lack of clean, non-refined-sugar nutritional options for kids and adults. Guided by strict standards of sourcing and transparency, he oversees our production and formulation processes to ensure every batch meets premium D2C standards.
                </p>
              </div>
            </div>

            <hr className="my-10 border-t-2 border-stone-200" />

            {/* Section 3: E-E-A-T Quality Standards */}
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#111111] mb-6">
              OUR EEAT QUALITY STANDARDS
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="border-2 border-black p-5 rounded-lg bg-[#FBF9F6]">
                <h4 className="font-black text-sm uppercase text-[#FF5000] tracking-wider mb-2">
                  1. Premium Sourcing
                </h4>
                <p className="text-xs font-semibold text-[#4E3A2E] leading-relaxed">
                  Every single date and dry fruit is hand-inspected at our Jharkhand facility. We only partner with certified growers who share our commitment to clean farming.
                </p>
              </div>

              <div className="border-2 border-black p-5 rounded-lg bg-[#FBF9F6]">
                <h4 className="font-black text-sm uppercase text-[#FF5000] tracking-wider mb-2">
                  2. Lab-Tested Nutrition
                </h4>
                <p className="text-xs font-semibold text-[#4E3A2E] leading-relaxed">
                  Our nutritional contents (proteins, dietary fiber, iron, calcium) are tested to guarantee consistent quality and safety standards for daily consumption.
                </p>
              </div>

              <div className="border-2 border-black p-5 rounded-lg bg-[#FBF9F6]">
                <h4 className="font-black text-sm uppercase text-[#FF5000] tracking-wider mb-2">
                  3. Total Transparency
                </h4>
                <p className="text-xs font-semibold text-[#4E3A2E] leading-relaxed">
                  What you see is what you get. Our labels list every ingredient clearly: zero hidden sugars, zero filler maltodextrin, and zero synthetic preservatives.
                </p>
              </div>

              <div className="border-2 border-black p-5 rounded-lg bg-[#FBF9F6]">
                <h4 className="font-black text-sm uppercase text-[#FF5000] tracking-wider mb-2">
                  4. Direct Sincerity
                </h4>
                <p className="text-xs font-semibold text-[#4E3A2E] leading-relaxed">
                  As a D2C brand, we ship directly from our production floor in Hazaribagh to your doorstep, keeping middle-men costs out and freshness high.
                </p>
              </div>
            </div>

            {/* Dynamic Local Citation */}
            <div className="mt-10 p-4 border-l-4 border-[#FF5000] bg-stone-50 rounded-r-lg text-xs font-bold text-[#4E3A2E]">
              Registered Address: Hazaribagh, Jharkhand, India. For inquiries or customer support, WhatsApp us at +91 7970574329 or emailhello@nutridates.in.
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
