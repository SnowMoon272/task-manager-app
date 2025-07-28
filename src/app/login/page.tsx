"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useModal } from "@/contexts/ModalContext";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginHeader from "@/components/auth/LoginHeader";
import LoginForm from "@/components/auth/LoginForm";

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const { login, isLoading } = useAuthStore();
  const { showError, showSuccess } = useModal();

  const handleSubmit = async (email: string, password: string) => {
    try {
      await login(email, password);

      // Mostrar modal de éxito antes de redirigir
      showSuccess("Has iniciado sesión exitosamente. Redirigiendo al dashboard...", "¡Bienvenido!");

      // Redirigir después de un delay más largo para que el usuario vea el mensaje
      setTimeout(() => {
        router.push(callbackUrl);
      }, 3500);
    } catch (err) {
      console.log("Error capturado en login:", err);

      // Mensaje simple para debug
      const errorMessage = "Credenciales incorrectas. Verifica tu email y contraseña.";

      console.log("Mostrando modal de error con mensaje:", errorMessage);
      // Mostrar el error en el modal
      showError(errorMessage, "Error de Inicio de Sesión");

      // Delay para verificar estado
      setTimeout(() => {
        console.log("Modal de error mostrado correctamente");
      }, 100);
    }
  };

  return (
    <AuthLayout>
      <LoginHeader />
      <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error="" />
    </AuthLayout>
  );
}

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LoginPage />
    </Suspense>
  );
}

