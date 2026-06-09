import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Nutri Dates',
  description: 'Terms of service and purchasing guidelines for ordering Nutri Dates Chocolate Dates Nutrition Powder online.',
  alternates: {
    canonical: 'https://nutridates.in/terms-conditions',
  },
};

export default function TermsConditions() {
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
              TERMS & CONDITIONS
            </h1>

            <p className="text-xs font-bold text-stone-500 mb-6">Last Updated: June 9, 2026</p>

            <div className="space-y-6 text-sm font-semibold text-[#4E3A2E] leading-relaxed">
              <p>
                Welcome to Nutri Dates (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By visiting our website and placing an order, you agree to comply with and be bound by the following terms and conditions.
              </p>

              <h2 className="text-lg font-black uppercase text-[#111111] mt-8">1. Product and Pricing</h2>
              <p>
                We offer the Nutri Dates Chocolate Dates Nutrition Powder (250g pack) for ₹299 (including taxes). Shipping charges may apply depending on promotional offers or delivery zones. We reserve the right to change packaging, sizes, or pricing at any time.
              </p>

              <h2 className="text-lg font-black uppercase text-[#111111] mt-8">2. Payments & Order Confirmation</h2>
              <p>
                We offer two primary options for checkout:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Online Payment (Razorpay)</strong>: Orders are processed securely via external API routing.</li>
                <li><strong>Buy on WhatsApp</strong>: Order details are pre-formatted and sent via WhatsApp to our official support channel (+91 7970574329). Your order is confirmed manually after billing details are validated.</li>
              </ul>

              <h2 className="text-lg font-black uppercase text-[#111111] mt-8">3. Shipping and Delivery</h2>
              <p>
                We process and ship orders directly from our manufacturing hub in Hazaribagh, Jharkhand. 
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Deliveries inside Jharkhand & Bihar typically take 2-4 working days.</li>
                <li>Deliveries to Delhi NCR, Mumbai, Bengaluru, and rest of India take 3-6 working days.</li>
                <li>We are not responsible for delivery delays caused by logistics partners, natural events, or incorrect shipping addresses.</li>
              </ul>

              <h2 className="text-lg font-black uppercase text-[#111111] mt-8">4. Return & Refund Policy</h2>
              <p>
                Due to the consumable nature of food and beverage products, we cannot accept returns once the packaging seal has been broken or opened. If you receive a damaged or incorrect package, please contact us on WhatsApp with photos within 24 hours of delivery, and we will dispatch a free replacement.
              </p>

              <h2 className="text-lg font-black uppercase text-[#111111] mt-8">5. Governing Law</h2>
              <p>
                These terms are governed by and construed in accordance with the laws of India, and any disputes will be subject to the exclusive jurisdiction of the courts of Jharkhand.
              </p>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
