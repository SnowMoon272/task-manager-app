"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";

interface RouteGuardProps {
  children: React.ReactNode;
}

// Rutas que requieren autenticación
const protectedRoutes = ["/dashboard", "/tasks", "/profile", "/board", "/settings"];

// Rutas de autenticación (solo para usuarios no autenticados)
const authRoutes = ["/login", "/register"];

export default function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      checkAuth();
    }
  }, [checkAuth, hasMounted]);

  useEffect(() => {
    if (!hasMounted || isLoading) return;

    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    if (isProtectedRoute && !isAuthenticated) {
      // Redirigir a login si intenta acceder a ruta protegida sin auth
      const loginUrl = `/login?callbackUrl=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
      return;
    }

    if (isAuthRoute && isAuthenticated) {
      // Redirigir a dashboard si ya está autenticado y va a login/register
      router.push("/dashboard");
      return;
    }

    if (pathname === "/" && isAuthenticated) {
      // Redirigir a dashboard si está en home y ya está autenticado
      router.push("/dashboard");
      return;
    }
  }, [isAuthenticated, isLoading, pathname, router, hasMounted]);

  // No renderizar nada hasta que el componente se haya montado
  if (!hasMounted) {
    return null;
  }

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

