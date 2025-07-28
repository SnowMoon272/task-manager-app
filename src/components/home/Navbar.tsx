"use client";

import { useState } from "react";
import SpaceButton from "@/components/ui/SpaceButton";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-purple-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            TaskManager
          </h1>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4">
            <SpaceButton href="/login" variant="secondary">
              Iniciar Sesión
            </SpaceButton>
            <SpaceButton href="/register" variant="primary">
              Registrarse
            </SpaceButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-purple-400 hover:text-purple-300 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-purple-500/20">
            <div className="flex flex-col gap-3 pt-4">
              <SpaceButton href="/login" variant="secondary" className="w-full justify-center">
                Iniciar Sesión
              </SpaceButton>
              <SpaceButton href="/register" variant="primary" className="w-full justify-center">
                Registrarse
              </SpaceButton>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

