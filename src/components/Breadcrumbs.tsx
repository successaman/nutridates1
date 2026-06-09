'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  const pathnames = pathname.split('/').filter((x) => x);

  // Generate breadcrumb list schema dynamically
  const breadcrumbListJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://nutridates.in"
      },
      ...pathnames.map((value, index) => {
        const url = `https://nutridates.in/${pathnames.slice(0, index + 1).join('/')}`;
        return {
          "@type": "ListItem",
          "position": index + 2,
          "name": value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' '),
          "item": url
        };
      })
    ]
  };

  return (
    <>
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListJsonLd) }}
      />

      {/* Visual Component */}
      <nav aria-label="Breadcrumb" className="bg-[#FBF9F6] border-b border-[#E3DCD5] py-3 px-6 md:px-12 z-20">
        <div className="mx-auto max-w-7xl">
          <ol className="flex items-center flex-wrap gap-2 text-xs md:text-sm font-bold uppercase tracking-wider text-[#4E3A2E]">
            <li>
              <Link href="/" className="hover:text-[#FF5000] transition-colors">
                Home
              </Link>
            </li>
            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join('/')}`;
              const label = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

              return (
                <li key={to} className="flex items-center gap-2">
                  <span className="text-[#FF5000]">&gt;</span>
                  {last ? (
                    <span className="text-[#111111]">{label}</span>
                  ) : (
                    <Link href={to} className="hover:text-[#FF5000] transition-colors">
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
}
