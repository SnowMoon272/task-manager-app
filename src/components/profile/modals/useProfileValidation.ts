import { useState, useCallback } from "react";

interface UseProfileValidationProps {
  currentName: string;
  onSave: (newName: string) => Promise<void>;
  onClose: () => void;
}

export const useProfileValidation = ({
  currentName,
  onSave,
  onClose,
}: UseProfileValidationProps) => {
  const [name, setName] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const clearMessages = useCallback(() => {
    setError("");
  }, []);

  const resetForm = useCallback(() => {
    setName(currentName);
    setError("");
    setIsLoading(false);
  }, [currentName]);

  const validateForm = useCallback(() => {
    if (name.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      return false;
    }

    if (name.trim() === currentName.trim()) {
      setError("El nombre no ha cambiado");
      return false;
    }

    return true;
  }, [name, currentName]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        await onSave(name.trim());
        onClose();
      } catch (error) {
        console.error("Error in modal:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Error al actualizar el perfil";

        // Si es un error de conexión o servidor, mostrar mensaje más amigable
        if (errorMessage.includes("fetch") || errorMessage.includes("Internal server error")) {
          setError("Error de conexión. Verifica que el servidor esté funcionando.");
        } else {
          setError(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [validateForm, onSave, onClose, name],
  );

  return {
    name,
    setName,
    error,
    isLoading,
    clearMessages,
    resetForm,
    handleSubmit,
  };
};

