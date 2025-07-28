"use client";

import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CTASection from "@/components/home/CTASection";
import Navbar from "@/components/home/Navbar";
import StarField from "@/components/ui/StarField";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      {/* Background */}
      <StarField />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </div>
  );
}

