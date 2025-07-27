"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import ClientOnly from "@/components/ClientOnly";

function StoreInitializerContent({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // Inicializar el store después del montaje
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar

  return <>{children}</>;
}

export function StoreInitializer({ children }: { children: React.ReactNode }) {
  return (
    <ClientOnly>
      <StoreInitializerContent>{children}</StoreInitializerContent>
    </ClientOnly>
  );
}

