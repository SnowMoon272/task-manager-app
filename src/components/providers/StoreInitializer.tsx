"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";

export function StoreInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      // Inicializar el store después del montaje del componente
      initialize();
    }
  }, [initialize, hasMounted]);

  // No renderizar nada hasta que el componente se haya montado
  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}

