'use client';

import { useState, useEffect } from 'react';
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
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#razorpay') {
        setIsCheckoutOpen(true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Check initially on mount
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    // Remove the hash from URL without reloading
    if (window.location.hash === '#razorpay') {
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
    </main>
  );
}
