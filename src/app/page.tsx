"use client";

import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CTASection from "@/components/home/CTASection";
import Navbar from "@/components/home/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />

      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </div>
  );
}

