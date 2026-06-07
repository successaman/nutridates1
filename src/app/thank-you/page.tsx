import type { Metadata } from 'next';
import ThankYouContent from '@/components/ThankYouContent';

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
  return <ThankYouContent />;
}
