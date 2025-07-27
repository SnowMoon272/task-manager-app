"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginHeader from "@/components/auth/LoginHeader";
import LoginForm from "@/components/auth/LoginForm";
import DemoCredentials from "@/components/auth/DemoCredentials";

export default function LoginPage() {
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (email: string, password: string) => {
    setError("");

    try {
      await login(email, password);
      router.push(callbackUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    }
  };

  return (
    <AuthLayout>
      <LoginHeader />
      <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
      <DemoCredentials />
    </AuthLayout>
  );
}

