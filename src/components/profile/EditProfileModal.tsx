"use client";

import { useState } from "react";
import SpaceButton from "@/components/ui/SpaceButton";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSave: (newName: string) => Promise<void>;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  currentName,
  onSave,
}: EditProfileModalProps) {
  const [name, setName] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      return;
    }

    if (name.trim() === currentName.trim()) {
      setError("El nombre no ha cambiado");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await onSave(name.trim());
      onClose();
    } catch (error) {
      console.error("Error in modal:", error);
      const errorMessage = error instanceof Error ? error.message : "Error al actualizar el perfil";

      // Si es un error de conexión o servidor, mostrar mensaje más amigable
      if (errorMessage.includes("fetch") || errorMessage.includes("Internal server error")) {
        setError("Error de conexión. Verifica que el servidor esté funcionando.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800/90 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-white mb-4">Editar Perfil</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              className="w-full px-3 py-2 bg-gray-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="Ingresa tu nombre"
              disabled={isLoading}
              required
            />
          </div>

          {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}

          <div className="flex justify-end space-x-3">
            <SpaceButton
              onClick={onClose}
              variant="secondary"
              className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
            >
              Cancelar
            </SpaceButton>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

