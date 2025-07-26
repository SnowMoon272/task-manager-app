"use client";

import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CTASection from "@/components/home/CTASection";
import SpaceButton from "@/components/ui/SpaceButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              TaskManager
            </h1>

            <div className="flex gap-4">
              <SpaceButton href="/login" variant="secondary">
                Iniciar Sesión
              </SpaceButton>
              <SpaceButton href="/register" variant="primary">
                Registrarse
              </SpaceButton>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </div>
  );
}

