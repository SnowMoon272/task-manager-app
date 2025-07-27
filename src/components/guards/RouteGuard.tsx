"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import ClientOnly from "@/components/ClientOnly";

interface RouteGuardProps {
  children: React.ReactNode;
}

// const protectedRoutes = ["/dashboard", "/tasks", "/profile", "/board", "/settings"];
// const authRoutes = ["/login", "/register"];

function RouteGuardContent({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // TEMPORALMENTE DESHABILITADO - Permitir navegación manual
    console.log("RouteGuard check (MANUAL MODE):", {
      pathname,
      isAuthenticated,
      isLoading,
    });

    // NO HACER REDIRECCIONES AUTOMÁTICAS
    return;
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  return (
    <ClientOnly>
      <RouteGuardContent>{children}</RouteGuardContent>
    </ClientOnly>
  );
}

