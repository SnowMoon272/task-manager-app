"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import ClientOnly from "@/components/ClientOnly";

interface RouteGuardProps {
  children: React.ReactNode;
}

const protectedRoutes = ["/dashboard", "/profile"];
const authRoutes = ["/login", "/register"];

function RouteGuardContent({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, token } = useAuthStore();

  useEffect(() => {
    console.log("RouteGuard check:", {
      pathname,
      isAuthenticated,
      isLoading,
      hasToken: !!token,
    });

    // Esperar a que termine de cargar
    if (isLoading) {
      console.log("RouteGuard: Still loading, waiting...");
      return;
    }

    // Verificar rutas protegidas
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

    if (isProtectedRoute && !isAuthenticated) {
      console.log("RouteGuard: Redirecting to login - protected route without auth");
      router.push(`/`);
      return;
    }

    // Verificar rutas de auth cuando ya está autenticado
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
    if (isAuthRoute && isAuthenticated) {
      console.log("RouteGuard: Redirecting to dashboard - auth route while authenticated");
      router.push("/dashboard");
      return;
    }

    // Redirigir home a dashboard si está autenticado
    if (pathname === "/" && isAuthenticated) {
      console.log("RouteGuard: Redirecting from home to dashboard");
      router.push("/dashboard");
      return;
    }

    console.log("RouteGuard: Access allowed for", pathname);
  }, [isAuthenticated, isLoading, pathname, router, token]);

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

