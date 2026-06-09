import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy Policy | Nutri Dates',
  description: 'Our privacy practices and policies detailing how we collect, store, and protect your order details and personal information at Nutri Dates.',
  alternates: {
    canonical: 'https://nutridates.in/privacy-policy',
  },
};

export default function PrivacyPolicy() {
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
              PRIVACY POLICY
            </h1>

            <p className="text-xs font-bold text-stone-500 mb-6">Last Updated: June 9, 2026</p>

            <div className="space-y-6 text-sm font-semibold text-[#4E3A2E] leading-relaxed">
              <p>
                At Nutri Dates, we respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy explains how we collect, use, and safe-keep your data when you visit our website or make a purchase.
              </p>

              <h2 className="text-lg font-black uppercase text-[#111111] mt-8">1. Information We Collect</h2>
              <p>
                When you make an order or register on our landing page, we collect details necessary to process your delivery, including:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Full Name</li>
                <li>Delivery Address (City, State, Pincode)</li>
                <li>Phone Number (for WhatsApp coordination and shipping updates)</li>
                <li>Email Address</li>
              </ul>

              <h2 className="text-lg font-black uppercase text-[#111111] mt-8">2. How We Use Your Information</h2>
              <p>
                We use this collected information strictly to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Process, pack, and ship your orders from our Jharkhand facility.</li>
                <li>Coordinate Cash on Delivery (COD) or UPI payment verifications.</li>
                <li>Send order confirmations and delivery status notifications via WhatsApp or email.</li>
              </ul>

              <h2 className="text-lg font-black uppercase text-[#111111] mt-8">3. Cookies and Tracking</h2>
              <p>
                We may use basic analytics cookies to measure page speed, verify clicks, and improve mobile usability. This data is fully anonymized and helps us deliver a smoother browsing experience.
              </p>

              <h2 className="text-lg font-black uppercase text-[#111111] mt-8">4. Data Security</h2>
              <p>
                Your order data is stored securely. We do not sell, rent, or distribute your customer database to third parties for marketing purposes.
              </p>

              <h2 className="text-lg font-black uppercase text-[#111111] mt-8">5. Contact Information</h2>
              <p>
                For questions regarding data removal or privacy inquiries, contact us at:
              </p>
              <p className="font-bold text-black">
                Nutri Dates Team<br />
                Email: hello@nutridates.in<br />
                WhatsApp: +91 7970574329<br />
                Location: Hazaribagh, Jharkhand, India.
              </p>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
