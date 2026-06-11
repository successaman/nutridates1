import type { Metadata } from 'next';
import ThankYouContent from '@/components/ThankYouContent';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Thank You | Nutri Dates',
  description:
    'Thank you for your order! Your Nutri Dates Chocolate Dates Nutrition Powder is being prepared and will be shipped shortly.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F9F7F5] font-sans font-black uppercase text-black">Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
