'use client';

import { useEffect } from 'react';
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/context/CartContext";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ProblemSection from "@/components/ProblemSection";
import ProductShowcase from "@/components/ProductShowcase";
import IngredientStory from "@/components/IngredientStory";
import WhyNutriDates from "@/components/WhyNutriDates";
import NutritionDashboard from "@/components/NutritionDashboard";
import HowToUse from "@/components/HowToUse";
import PerfectFor from "@/components/PerfectFor";
import FounderStory from "@/components/FounderStory";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import StickyBuyBar from "@/components/StickyBuyBar";
import CheckoutModal from "@/components/CheckoutModal";
import AmbassadorSection from "@/components/AmbassadorSection";
import ProductComparison from "@/components/ProductComparison";

export default function Home() {
  const { isCheckoutOpen, setIsCheckoutOpen, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#checkout' || window.location.hash === '#razorpay') {
        setIsCheckoutOpen(true);
      } else if (window.location.hash === '#cart') {
        setIsCartOpen(true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [setIsCheckoutOpen, setIsCartOpen]);

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    if (window.location.hash === '#checkout' || window.location.hash === '#razorpay' || window.location.hash === '#cart') {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
    }
  };

  return (
    <main>
      {/* Section 1: Hero */}
      <Hero />

      {/* Section 2: Trust Bar */}
      <TrustBar />

      {/* Section 3: The Problem */}
      <ProblemSection />

      {/* Section 4: Introducing Nutri Dates */}
      <ProductShowcase />

      {/* Section 5: Ingredient Story */}
      <IngredientStory />

      {/* Comparison Table (Google SGE / SEO Optimized) */}
      <ProductComparison />

      {/* Section 6: Why Nutri Dates */}
      <WhyNutriDates />

      {/* Section 7: Nutrition Dashboard */}
      <NutritionDashboard />

      {/* Section 8: How To Use */}
      <HowToUse />

      {/* Section 9: Perfect For */}
      <PerfectFor />

      {/* Section 10: Founder Story */}
      <FounderStory />

      {/* Section 11: Customer Reviews */}
      <Reviews />

      {/* Section 12: Ambassador Program Section */}
      <AmbassadorSection />

      {/* Section 13: FAQ */}
      <FAQ />

      {/* Section 14: Final CTA */}
      <FinalCTA />

      {/* Footer */}
      <Footer />

      {/* Sticky Buy Bar */}
      <StickyBuyBar />

      {/* Secure Checkout Modal (Razorpay + WhatsApp integration) */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={closeCheckout} />

      {/* Cart Drawer Overlay */}
      <CartDrawer />
    </main>
  );
}
