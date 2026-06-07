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
  title: "Nutri Dates | Sip The Strength",
  description:
    "Date-Based Nutrition Drink Made With Real Ingredients. Rich Taste. Daily Nutrition. Order Nutri Dates Today.",
  keywords: [
    "Nutri Dates",
    "chocolate dates powder",
    "nutrition drink",
    "date based nutrition",
    "healthy milkshake",
    "natural energy drink",
    "FMCG India",
    "healthy beverage",
  ],
  authors: [{ name: "Priyam Gupta" }],
  creator: "Nutri Dates",
  publisher: "Nutri Dates",
  openGraph: {
    title: "Nutri Dates | Sip The Strength",
    description:
      "Date-Based Nutrition Drink Made With Real Ingredients. Rich Taste. Daily Nutrition. Order Nutri Dates Today.",
    type: "website",
    locale: "en_IN",
    siteName: "Nutri Dates",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nutri Dates | Sip The Strength",
    description:
      "Date-Based Nutrition Drink Made With Real Ingredients. Rich Taste. Daily Nutrition.",
  },
  robots: {
    index: true,
    follow: true,
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
        {/* Google Analytics placeholder */}
      </head>
      <body className="min-h-full flex flex-col bg-primary-bg">
        {children}
      </body>
    </html>
  );
}
