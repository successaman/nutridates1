import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';

interface CityData {
  city: string;
  region: string;
  lat: number;
  lng: number;
  deliveryTime: string;
  address: string;
  mapEmbedUrl?: string;
  localGymsCTA: string;
  faqs: { q: string; a: string }[];
}

const CITY_DATABASE: Record<string, CityData> = {
  hazaribagh: {
    city: 'Hazaribagh',
    region: 'Jharkhand',
    lat: 23.9925,
    lng: 85.3637,
    deliveryTime: 'Same-day pickup or next-day home delivery.',
    address: 'Nutri Dates Sourcing Facility, Hazaribagh, Jharkhand, 825301',
    localGymsCTA: 'Local gym partners, fitness centers, and sports academies in Hazaribagh get exclusive bulk pricing.',
    faqs: [
      { q: 'Can I pick up my order in Hazaribagh directly?', a: 'Yes! You can contact us on WhatsApp (+91 7970574329) to coordinate a direct pickup from our Hazaribagh facility to save on shipping costs.' },
      { q: 'What is the delivery time for Hazaribagh town?', a: 'All local orders inside Hazaribagh town are processed immediately and delivered within 24 hours.' },
      { q: 'Where are your ingredients sourced from?', a: 'Our premium dates and dry fruits are processed locally in Hazaribagh with strict quality inspection by our local team.' },
    ],
  },
  ranchi: {
    city: 'Ranchi',
    region: 'Jharkhand',
    lat: 23.3441,
    lng: 85.3096,
    deliveryTime: '1 to 2 working days via express Jharkhand courier.',
    address: 'Ranchi Delivery Depot, Lalpur / Kanke Road Hub, Ranchi, Jharkhand, 834001',
    localGymsCTA: 'Active in Ranchi gyms? Connect with our Ranchi Ambassador network at Lalpur, Khelgaon, and Morabadi.',
    faqs: [
      { q: 'How fast is shipping from Hazaribagh to Ranchi?', a: 'Extremely fast. Ranchi is just 90km from our Hazaribagh base, so orders typically arrive at Ranchi doorsteps in 24-48 hours.' },
      { q: 'Is Cash on Delivery (COD) available in Ranchi?', a: 'Yes, we offer Cash on Delivery and GPay on delivery for all sectors in Ranchi.' },
    ],
  },
  jamshedpur: {
    city: 'Jamshedpur',
    region: 'Jharkhand',
    lat: 22.8046,
    lng: 86.2029,
    deliveryTime: '2 to 3 working days via speed post or express logistics.',
    address: 'Jamshedpur Delivery Network, Bistupur/Sakchi Hub, Jamshedpur, Jharkhand, 831001',
    localGymsCTA: 'Jamshedpur athletes and fitness clubs can register with us for free product samples.',
    faqs: [
      { q: 'Do you deliver to Bistupur and Sakchi in Jamshedpur?', a: 'Yes, our delivery partners cover all primary pincodes in Jamshedpur including Kadma, Sonari, Bistupur, Sakchi, and Telco.' },
      { q: 'How do I track my Jamshedpur order?', a: 'Once your order is processed, we send a tracking ID via WhatsApp so you can monitor the shipment in real-time.' },
    ],
  },
  patna: {
    city: 'Patna',
    region: 'Bihar',
    lat: 25.5941,
    lng: 85.1376,
    deliveryTime: '2 to 3 working days.',
    address: 'Patna Express Distribution Hub, Fraser Road, Patna, Bihar, 800001',
    localGymsCTA: 'Patna college ambassadors and gym trainers can apply for local commissions via our City Ambassador Program.',
    faqs: [
      { q: 'Is free delivery available to Patna?', a: 'We run periodic free shipping promotions for Patna. Standard orders above ₹500 get completely free delivery.' },
      { q: 'Can I pay online using UPI for my Patna order?', a: 'Yes, we accept Google Pay, PhonePe, Paytm, and credit cards via our secure Razorpay gateway.' },
    ],
  },
  delhi: {
    city: 'Delhi',
    region: 'NCR',
    lat: 28.6139,
    lng: 77.2090,
    deliveryTime: '3 to 4 working days via air cargo dispatch.',
    address: 'Delhi NCR Fulfillment Center, Okhla / Dwarka Depot, New Delhi, 110020',
    localGymsCTA: 'Delhi fitness centers and D2C health drink consumers get super-fast courier dispatches from our national hub.',
    faqs: [
      { q: 'How do you ship from Jharkhand to Delhi NCR?', a: 'We partner with national air couriers (Delhivery, Bluedart) to ensure your dates powder reaches Delhi NCR within 3-4 days of placing an order.' },
      { q: 'Is there any custom duties or extra fees for Delhi?', a: 'No, the price of ₹299 includes all taxes. What you see during checkout is exactly what you pay.' },
    ],
  },
  mumbai: {
    city: 'Mumbai',
    region: 'Maharashtra',
    lat: 19.0760,
    lng: 72.8777,
    deliveryTime: '4 to 5 working days via express logistics.',
    address: 'West India Distribution Hub, Andheri / Bandra Depot, Mumbai, Maharashtra, 400053',
    localGymsCTA: 'Gyms, dieticians, and health cafes in Mumbai get wholesale pricing for retail partnerships.',
    faqs: [
      { q: 'How long does shipping to Mumbai take?', a: 'Our standard dispatch to Mumbai and Maharashtra takes 4-5 business days. Tracking details are shared immediately upon dispatch.' },
      { q: 'Why is Nutri Dates popular among Mumbai gym-goers?', a: 'It is sugar-free, date-based, rich in energy oats and dry fruits, and serves as an excellent natural pre-workout shake.' },
    ],
  },
};

// Next.js dynamic routing configuration
export async function generateStaticParams() {
  return Object.keys(CITY_DATABASE).map((city) => ({
    city: city,
  }));
}

// Generate metadata dynamically per city
export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const data = CITY_DATABASE[city];
  if (!data) return {};

  return {
    title: `Buy Chocolate Dates Powder in ${data.city}, ${data.region} | Nutri Dates`,
    description: `Order Nutri Dates Chocolate Dates Nutrition Powder in ${data.city}. ${data.deliveryTime} Express shipping, COD options, and local ambassador support.`,
    alternates: {
      canonical: `https://nutridates.in/locations/${city}`,
    },
  };
}

export default async function LocationPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const data = CITY_DATABASE[city];

  if (!data) {
    notFound();
  }

  // Create LocalBusiness schema dynamic payload
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Nutri Dates ${data.city}`,
    "image": "https://nutridates.in/images/product-hero.png",
    "telephone": "+917970574329",
    "email": "hello@nutridates.in",
    "priceRange": "₹299",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": data.address,
      "addressLocality": data.city,
      "addressRegion": data.region,
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": data.lat,
      "longitude": data.lng
    },
    "url": `https://nutridates.in/locations/${city}`,
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": data.city
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />

      <Breadcrumbs />

      <main className="min-h-screen bg-[#FBF9F6] px-6 py-12 md:py-20">
        <div className="mx-auto max-w-3xl">
          {/* Back link */}
          <div className="mb-8 flex justify-between items-center">
            <Link
              href="/locations"
              className="text-xs font-black uppercase text-[#FF5000] hover:underline"
            >
              &larr; Back to Locations
            </Link>
            <span className="text-[10px] font-black uppercase tracking-widest bg-stone-200 text-stone-700 px-2.5 py-1 rounded">
              Active Delivery Zone
            </span>
          </div>

          {/* Main Card */}
          <article className="border-4 border-black bg-white p-8 md:p-12 rounded-xl shadow-[8px_8px_0px_0px_#111111] mb-8">
            <span className="inline-block border-2 border-black bg-[#FF5000] text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 mb-4">
              Local Shipping & Delivery
            </span>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#111111] leading-none mb-6">
              NUTRI DATES IN <span className="text-[#FF5000]">{data.city.toUpperCase()}</span>
            </h1>

            {/* Delivery Alert Block */}
            <div className="border-2 border-black bg-[#F9F7F5] p-5 rounded-lg mb-8">
              <h2 className="text-xs font-black uppercase tracking-wider text-stone-500 mb-1">
                Estimated Shipping Time
              </h2>
              <p className="text-base font-black text-[#111111] leading-snug">
                {data.deliveryTime}
              </p>
            </div>

            <div className="space-y-6 text-sm font-semibold text-[#4E3A2E] leading-relaxed">
              <p>
                We are proud to serve health-conscious families, fitness enthusiasts, and gym-goers in <span className="text-black font-extrabold">{data.city}</span> directly from our production house. Our Chocolate Dates Nutrition Powder is crafted with premium quality ingredients, delivering pure stamina support and flavor without any added refined sugars.
              </p>

              <h2 className="text-lg font-black uppercase text-[#111111] mt-8 mb-2">Local Distribution Address</h2>
              <p className="italic text-xs text-stone-600 bg-stone-50 p-3 border-l-4 border-stone-400 rounded-r">
                {data.address}
              </p>

              <h2 className="text-lg font-black uppercase text-[#111111] mt-8 mb-2">Gym & Fitness Collaborations</h2>
              <p>
                {data.localGymsCTA} If you are a gym owner, personal trainer, or diet coach in {data.city}, please reach out to us on WhatsApp to request a free sample box or catalog for your clients.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/#order"
                className="flex-1 inline-flex items-center justify-center rounded-lg bg-[#FF5000] py-4 text-sm font-black uppercase tracking-wider text-white border-2 border-black shadow-[4px_4px_0px_0px_#111111] hover:shadow-[2px_2px_0px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                Buy Online (₹299)
              </Link>
              <a
                href={`https://wa.me/917970574329?text=Hello%20Nutri%20Dates%20Team%2C%20I%20live%20in%20${data.city}%20and%20I%20would%20like%20to%20order%20the%20Chocolate%20Dates%20Nutrition%20Powder.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-white py-4 text-sm font-black uppercase tracking-wider text-emerald-600 border-2 border-emerald-600 shadow-[4px_4px_0px_0px_#059669] hover:shadow-[2px_2px_0px_0px_#059669] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
              >
                Order via WhatsApp
              </a>
            </div>
          </article>

          {/* Localized FAQ Section */}
          <div className="border-4 border-black bg-white p-8 md:p-12 rounded-xl shadow-[6px_6px_0px_0px_#111111] mb-8">
            <h2 className="text-2xl font-black uppercase text-[#111111] tracking-tight mb-6">
              Frequently Asked Questions in {data.city}
            </h2>
            <div className="space-y-6">
              {data.faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-stone-200 pb-4 last:border-0 last:pb-0">
                  <h3 className="text-sm font-black uppercase text-[#FF5000] tracking-wide mb-1.5">
                    Q: {faq.q}
                  </h3>
                  <p className="text-xs font-semibold text-[#4E3A2E] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* NAP & Maps Frame Placeholder */}
          <div className="border-4 border-black bg-white p-8 md:p-12 rounded-xl shadow-[6px_6px_0px_0px_#111111]">
            <h2 className="text-2xl font-black uppercase text-[#111111] tracking-tight mb-6">
              Local Verification Hub
            </h2>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 text-left space-y-3">
                <p className="text-xs font-black uppercase text-stone-500">Contact Details (NAP consistency)</p>
                <p className="text-sm font-bold text-[#111111]">
                  Name: <span className="font-semibold text-stone-700">Nutri Dates India</span>
                </p>
                <p className="text-sm font-bold text-[#111111]">
                  Address: <span className="font-semibold text-stone-700">{data.address}</span>
                </p>
                <p className="text-sm font-bold text-[#111111]">
                  Phone: <span className="font-semibold text-stone-700">+91 7970574329</span>
                </p>
                <p className="text-sm font-bold text-[#111111]">
                  Email: <span className="font-semibold text-stone-700">hello@nutridates.in</span>
                </p>
              </div>
              <div className="w-full md:w-60 h-40 border-2 border-black rounded-lg bg-stone-100 flex items-center justify-center text-center p-4 relative overflow-hidden shadow-[2px_2px_0px_0px_#111111]">
                <div className="absolute inset-0 bg-stone-200 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#111 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 z-10">
                  Google Maps Embedding Support <br />
                  <span className="text-[#FF5000]">({data.city} coordinates verified)</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
