'use client';

import { motion } from 'framer-motion';

const PERKS = [
  {
    title: '15% Commission',
    desc: 'Earn on every order from your referral code',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: 'Free Monthly Supply',
    desc: 'Get a free pack every month as an active ambassador',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25" />
      </svg>
    ),
  },
  {
    title: 'Custom Discount Code',
    desc: 'Your unique code for your audience to get special pricing',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
      </svg>
    ),
  },
  {
    title: 'Brand Recognition',
    desc: 'Get featured on our Instagram and website',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
  },
];

const TARGET_CITIES = [
  'Hazaribagh',
  'Ranchi',
  'Jamshedpur',
  'Dhanbad',
  'Patna',
  'Delhi',
  'Mumbai',
  'Bengaluru',
  'Hyderabad',
  'Kolkata',
  'Pune',
  'Lucknow',
];

const whatsappApplyUrl =
  'https://wa.me/917970574329?text=Hi%20Priyam%2C%20I%20want%20to%20represent%20Nutri%20Dates%20as%20a%20City%20Ambassador%20for%20my%20city!%20Please%20share%20the%20details.';

export default function AmbassadorSection() {
  return (
    <section className="bg-[#2B1D14] py-20 md:py-28 px-6 overflow-hidden border-b border-[#3A2415]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block border-2 border-white bg-[#FF5000] text-white text-xs font-black tracking-widest uppercase px-3.5 py-1.5 mb-6">
            Join The Movement
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight leading-tight">
            Become a City Ambassador
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base font-medium text-stone-400 leading-relaxed">
            Are you a gym trainer, fitness coach, college leader, or health influencer?
            Represent Nutri Dates in your city. Earn commissions, get free products, and build your personal brand.
          </p>
        </motion.div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {PERKS.map((perk, i) => (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="border-2 border-[#4A3B32] bg-[#3A2415] rounded-xl p-5 text-center"
            >
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-[#FF5000]/10 text-[#FF5000] mb-3">
                {perk.icon}
              </div>
              <h3 className="text-sm font-black uppercase text-white tracking-wide">{perk.title}</h3>
              <p className="mt-1.5 text-xs font-medium text-stone-400 leading-relaxed">{perk.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Target Cities */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-xs font-black uppercase tracking-widest text-stone-500 mb-4">
            Actively recruiting in
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {TARGET_CITIES.map((city) => (
              <span
                key={city}
                className="border border-[#4A3B32] bg-[#2B1D14] text-stone-300 text-xs font-bold px-3 py-1.5 rounded-md"
              >
                {city}
              </span>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center"
        >
          <a
            href={whatsappApplyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#FF5000] text-white font-black uppercase tracking-wider text-sm px-8 py-4 rounded-lg border-2 border-white shadow-[4px_4px_0px_0px_#FFFFFF] hover:shadow-[2px_2px_0px_0px_#FFFFFF] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Apply via WhatsApp
          </a>
          <p className="mt-4 text-xs font-semibold text-stone-500">
            No fees. No hassle. Start earning from Day 1.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
