import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Delivery Locations Across India | Nutri Dates',
  description:
    'Find shipping times, local customer reviews, and ambassador details for Nutri Dates Chocolate Dates Nutrition Powder in your city. Express delivery across Jharkhand, Bihar, and major metros.',
  alternates: {
    canonical: 'https://nutridates.in/locations',
  },
};

const locations = [
  { city: 'Hazaribagh', region: 'Jharkhand', desc: 'Our founding city and main processing facility. Next-day pickup and home delivery available.' },
  { city: 'Ranchi', region: 'Jharkhand', desc: 'Jharkhand\'s capital hub. Fast 24-48 hour delivery via express courier networks.' },
  { city: 'Jamshedpur', region: 'Jharkhand', desc: 'Steel City express delivery. 2-day doorstep dispatch.' },
  { city: 'Patna', region: 'Bihar', desc: 'Primary delivery hub for Bihar. 2-3 day transit times.' },
  { city: 'Delhi', region: 'NCR', desc: 'Fast track logistics hub serving Delhi, Noida, Gurugram, and Ghaziabad.' },
  { city: 'Mumbai', region: 'Maharashtra', desc: 'Serving fitness hubs and health-conscious communities in Maharashtra within 4 days.' },
];

export default function LocationsDirectory() {
  return (
    <>
      <Breadcrumbs />
      <main className="min-h-screen bg-[#FBF9F6] px-6 py-12 md:py-20">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <span className="inline-block border-2 border-black bg-[#FF5000] text-white text-xs font-black tracking-widest uppercase px-3 py-1 mb-4">
              Local SEO Directory
            </span>
            <h1 className="text-4xl font-black uppercase text-[#111111] tracking-tight">
              DELIVERY REGIONS & CITIES
            </h1>
            <p className="mt-2 text-sm font-semibold text-[#4E3A2E] max-w-xl mx-auto">
              Nutri Dates is expanding rapidly across India. Find specific delivery speeds, ambassador contacts, and local pickup locations in your city.
            </p>
          </div>

          {/* Grid list of cities */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc) => {
              const slug = loc.city.toLowerCase();
              return (
                <div
                  key={slug}
                  className="flex flex-col justify-between border-4 border-black bg-white p-6 rounded-xl shadow-[4px_4px_0px_0px_#111111] hover:shadow-[2px_2px_0px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5000]">
                      {loc.region}
                    </span>
                    <h2 className="text-xl font-black uppercase text-[#111111] mt-1 mb-3">
                      {loc.city}
                    </h2>
                    <p className="text-xs font-semibold text-[#4E3A2E] leading-relaxed mb-6">
                      {loc.desc}
                    </p>
                  </div>
                  <Link
                    href={`/locations/${slug}`}
                    className="inline-flex items-center justify-center rounded-lg border-2 border-black bg-[#111111] py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-[#FF5000] transition-colors"
                  >
                    View Local Info
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-14 text-center p-6 border-2 border-dashed border-stone-300 rounded-xl">
            <p className="text-xs font-black uppercase text-stone-500">
              Don&apos;t see your city listed?
            </p>
            <p className="text-sm font-bold text-[#4E3A2E] mt-2">
              We ship to all pin codes in India! You can place an order today via WhatsApp or Online Payment.
            </p>
            <Link
              href="/#order"
              className="mt-4 inline-flex border-2 border-black bg-[#FF5000] text-white px-6 py-2 text-xs font-black uppercase tracking-wider rounded-md"
            >
              Order Now
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
