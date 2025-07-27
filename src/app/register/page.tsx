"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import AuthLayout from "@/components/auth/AuthLayout";
import RegisterHeader from "@/components/auth/RegisterHeader";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  const [error, setError] = useState("");

  const router = useRouter();
  const { register, isLoading } = useAuthStore();

  const handleSubmit = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      await register(name, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la cuenta");
    }
  };

  return (
    <AuthLayout>
      <RegisterHeader />
      <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
    </AuthLayout>
  );
}

