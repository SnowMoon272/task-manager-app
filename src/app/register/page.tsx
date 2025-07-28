"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useErrorModal, useSuccessModal } from "@/hooks/useModals";
import AuthLayout from "@/components/auth/AuthLayout";
import RegisterHeader from "@/components/auth/RegisterHeader";
import RegisterForm from "@/components/auth/RegisterForm";
import ErrorModal from "@/components/ui/ErrorModal";
import SuccessModal from "@/components/ui/SuccessModal";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const errorModal = useErrorModal();
  const successModal = useSuccessModal();

  const handleSubmit = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    errorModal.close();

    if (password !== confirmPassword) {
      errorModal.open("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      errorModal.open("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      await register(name, email, password);
      successModal.open("Cuenta creada exitosamente. Redirigiendo al dashboard...");

      // Redirección con delay para mostrar el modal de éxito
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear la cuenta";
      errorModal.open(errorMessage);
    }
  };

  return (
    <>
      <AuthLayout>
        <RegisterHeader />
        <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} error="" />
      </AuthLayout>

      {/* Modal de Error */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        title="Error de Registro"
        message={errorModal.message}
        onClose={errorModal.close}
        type="error"
      />

      {/* Modal de Éxito */}
      <SuccessModal
        isOpen={successModal.isOpen}
        title="¡Registro Exitoso!"
        message={successModal.message}
        onClose={() => {
          successModal.close();
          router.push("/dashboard");
        }}
        autoCloseDelay={1500}
      />
    </>
  );
}

