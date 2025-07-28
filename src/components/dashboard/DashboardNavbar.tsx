"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function DashboardNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Determinar qué botón mostrar basado en la ruta actual
  const getNavigationButton = () => {
    if (pathname === "/profile") {
      return (
        <Link
          href="/dashboard"
          className="group relative p-2 rounded-lg transition-all duration-300 border border-purple-400/30 hover:border-purple-400 text-purple-400 hover:bg-purple-400/10 backdrop-blur-sm"
          title="Dashboard"
        >
          <ChartBarIcon className="w-5 h-5" />
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Dashboard
          </span>
        </Link>
      );
    } else {
      // En dashboard y otras páginas, mostrar enlace al perfil
      return (
        <Link
          href="/profile"
          className="group relative p-2 rounded-lg transition-all duration-300 border border-purple-400/30 hover:border-purple-400 text-purple-400 hover:bg-purple-400/10 backdrop-blur-sm"
          title="Mi Perfil"
        >
          <UserIcon className="w-5 h-5" />
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Mi Perfil
          </span>
        </Link>
      );
    }
  };

  return (
    <nav className="bg-gray-800/30 backdrop-blur-sm border-b border-purple-500/30 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="cursor-pointer group">
              <h1 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-cyan-300 transition-all duration-300">
                Task Manager
              </h1>
            </Link>

            {/* Badge de usuario - solo visible en desktop */}
            <div className="hidden lg:flex ml-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-400/20 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-gray-300 font-medium">PRUEBA TÉCNICA T1</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center gap-3 mr-4">
              <span className="text-sm text-gray-300">
                Hola, <span className="text-purple-400 font-medium">{user?.name}</span>
              </span>
            </div>

            {getNavigationButton()}
            <button
              onClick={handleLogout}
              className="group relative p-2 rounded-lg transition-all duration-300 border border-red-400/30 hover:border-red-400 text-red-400 hover:bg-red-400/10 backdrop-blur-sm"
              title="Cerrar sesión"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Cerrar sesión
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-purple-500/20 mt-4">
            <div className="flex flex-col gap-3 pt-4">
              <div className="text-center mb-3">
                <span className="text-sm text-gray-300">
                  Hola, <span className="text-purple-400 font-medium">{user?.name}</span>
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {pathname === "/profile" ? (
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-300 border border-purple-400/30 hover:border-purple-400 text-purple-400 hover:bg-purple-400/10 backdrop-blur-sm"
                  >
                    <ChartBarIcon className="w-5 h-5" />
                    <span className="text-sm">Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    href="/profile"
                    className="flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-300 border border-purple-400/30 hover:border-purple-400 text-purple-400 hover:bg-purple-400/10 backdrop-blur-sm"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span className="text-sm">Mi Perfil</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-300 border border-red-400/30 hover:border-red-400 text-red-400 hover:bg-red-400/10 backdrop-blur-sm"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span className="text-sm">Cerrar sesión</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

