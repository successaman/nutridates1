import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Nutri Dates | Sip The Strength — India's Premium Chocolate Dates Nutrition Powder",
  description:
    "Nutri Dates — India's first Date-Based Chocolate Nutrition Powder made with real Dates, Cocoa, Oats & Dry Fruits. Natural energy drink from Hazaribagh, Jharkhand. Order online with express delivery across India.",
  keywords: [
    "Nutri Dates",
    "nutridates",
    "chocolate dates powder",
    "dates nutrition powder",
    "nutrition drink India",
    "date based nutrition",
    "healthy milkshake India",
    "natural energy drink India",
    "best nutrition powder India",
    "chocolate health drink",
    "FMCG India",
    "healthy beverage",
    "Hazaribagh",
    "Jharkhand",
    "Ranchi health drink",
    "buy nutrition powder online",
    "dates cocoa powder",
    "protein powder alternative",
    "gym nutrition India",
    "fitness drink India",
    "Priyam Gupta",
    "sip the strength",
    "natural health drink for kids",
    "dates powder for milk",
    "dry fruit milk mix",
    "weight gain health drink",
    "best energy supplement without sugar",
    "healthy chocolate milk powder",
    "dates and nuts powder",
    "ayurvedic energy drink India",
    "Indian D2C health brands",
    "Jharkhand start-up ecosystem",
    "healthy food startup Jharkhand",
    "dates health drink benefits",
    "organic dates drink powder"
  ],
  authors: [{ name: "Priyam Gupta" }],
  creator: "Nutri Dates",
  publisher: "Nutri Dates",
  metadataBase: new URL("https://nutridates.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Nutri Dates | Sip The Strength — India's Premium Dates Nutrition Powder",
    description:
      "Made with real Dates, Cocoa, Oats & Dry Fruits. Natural daily energy from Hazaribagh, Jharkhand. Express delivery across India.",
    type: "website",
    locale: "en_IN",
    siteName: "Nutri Dates",
    url: "https://nutridates.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nutri Dates | Sip The Strength",
    description:
      "India's first Date-Based Chocolate Nutrition Powder. Natural energy. Daily wellness. Order now.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "IN-JH",
    "geo.placename": "Hazaribagh",
    "geo.position": "23.9925;85.3637",
    ICBM: "23.9925, 85.3637",
  },
};

/* ── JSON-LD Structured Data ── */
const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Nutri Dates Chocolate Dates Nutrition Powder",
  image: "https://nutridates.in/images/product-hero.png",
  description:
    "Premium Chocolate Dates Nutrition Powder made with real Dates, Cocoa, Oats & Dry Fruits. 250g pack for daily energy and wellness.",
  brand: {
    "@type": "Brand",
    name: "Nutri Dates",
  },
  offers: {
    "@type": "Offer",
    url: "https://nutridates.in",
    priceCurrency: "INR",
    price: "299",
    priceValidUntil: "2027-12-31",
    availability: "https://schema.org/InStock",
    seller: {
      "@type": "Organization",
      name: "Nutri Dates",
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "124",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Nutri Dates",
  image: "https://nutridates.in/images/logo-uploaded.jpg",
  description:
    "India's premium Chocolate Dates Nutrition Powder brand. Crafted in Hazaribagh, Jharkhand.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hazaribagh",
    addressRegion: "Jharkhand",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 23.9925,
    longitude: 85.3637,
  },
  url: "https://nutridates.in",
  telephone: "+917970574329",
  sameAs: [
    "https://www.instagram.com/nutridatesofficial/",
  ],
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  founder: {
    "@type": "Person",
    name: "Priyam Gupta",
  },
  foundingLocation: {
    "@type": "Place",
    name: "Hazaribagh, Jharkhand, India",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nutri Dates",
  url: "https://nutridates.in",
  logo: "https://nutridates.in/images/logo-uploaded.jpg",
  description: "India's premium Date-Based Chocolate Nutrition Powder brand from Hazaribagh, Jharkhand.",
  founder: {
    "@type": "Person",
    name: "Priyam Gupta",
  },
  sameAs: [
    "https://www.instagram.com/nutridatesofficial/",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-7970574329",
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-primary-bg">
        {children}
      </body>
    </html>
  );
}
