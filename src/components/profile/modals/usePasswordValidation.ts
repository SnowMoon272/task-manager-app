import { useState } from "react";

interface UsePasswordValidationProps {
  onSave: (currentPassword: string, newPassword: string) => Promise<void>;
  onClose: () => void;
}

export function usePasswordValidation({ onSave, onClose }: UsePasswordValidationProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  const validatePasswords = (): string | null => {
    if (!currentPassword.trim()) {
      return "La contraseña actual es requerida";
    }

    if (!newPassword.trim()) {
      return "La nueva contraseña es requerida";
    }

    if (newPassword.length < 6) {
      return "La nueva contraseña debe tener al menos 6 caracteres";
    }

    if (newPassword !== confirmPassword) {
      return "Las nuevas contraseñas no coinciden";
    }

    if (currentPassword === newPassword) {
      return "La nueva contraseña debe ser diferente a la actual";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validatePasswords();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      await onSave(currentPassword, newPassword);

      setSuccess("Contraseña cambiada exitosamente");

      setTimeout(() => {
        resetForm();
        onClose();
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error al cambiar la contraseña");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    success,
    isLoading,
    clearMessages,
    resetForm,
    handleSubmit,
  };
}

