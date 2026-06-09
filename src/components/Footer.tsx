'use client';

import Link from 'next/link';

const whatsappLink =
  'https://wa.me/917970574329?text=Hello%20Nutri%20Dates%20Team%2C%0A%0AI%20have%20a%20question.';

export default function Footer() {
  return (
    <footer className="bg-[#111111] px-6 py-16 border-t border-black">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="font-sans text-2xl font-black uppercase text-white tracking-tighter">
              Nutri Dates
            </h3>
            <p className="mt-1 text-xs font-black uppercase tracking-widest text-[#FF5000]">
              Sip The Strength
            </p>
            <p className="mt-4 max-w-xs text-sm font-medium leading-relaxed text-stone-400">
              India&apos;s premium chocolate dates nutrition powder — crafted for daily energy and wellness.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-stone-500">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'About Us', href: '/about' },
                { label: 'Delivery Locations', href: '/locations' },
                { label: 'Health Journal (Blog)', href: '/blog' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-semibold text-stone-400 transition-colors hover:text-[#FF5000]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-stone-500">
              Get in Touch
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-stone-400 transition-colors hover:text-emerald-500"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Us
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@nutridates.in"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-stone-400 transition-colors hover:text-[#FF5000]"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                  hello@nutridates.in
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/nutridatesofficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-stone-400 transition-colors hover:text-[#FF5000]"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-stone-800" />

        {/* Bottom */}
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm font-semibold text-stone-400">
            Crafted with passion in Hazaribagh, Jharkhand
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-stone-500 mt-2">
            <Link href="/privacy-policy" className="hover:text-[#FF5000] transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-conditions" className="hover:text-[#FF5000] transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link href="/disclaimer" className="hover:text-[#FF5000] transition-colors">
              Nutritional Disclaimer
            </Link>
          </div>
          <p className="text-xs text-stone-500 mt-2">
            © 2024 Nutri Dates. All rights reserved.
          </p>
          <p className="text-xs font-semibold text-stone-500">
            Founded by Priyam Gupta
          </p>
        </div>
      </div>
    </footer>
  );
}
