"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateTaskData } from "@/types";

const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(200, "El título no puede exceder 200 caracteres"),
  description: z
    .string()
    .max(1000, "La descripción no puede exceder 1000 caracteres")
    .optional()
    .or(z.literal("")),
  status: z.enum(["todo", "in-progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskData) => Promise<void>;
}

export default function CreateTaskModal({ isOpen, onClose, onSubmit }: CreateTaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
      reset();
    }, 300);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      status: "todo",
      priority: "medium",
    },
  });

  const handleFormSubmit = async (data: CreateTaskFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      reset();
      handleClose();
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-6">
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-all duration-300 ease-out ${
            isAnimating ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleClose}
        />

        {/* Modal */}
        <div
          className={`relative transform overflow-hidden rounded-lg bg-gray-800 border border-purple-500/30 text-left shadow-xl transition-all duration-300 ease-out w-full max-w-lg mx-auto ${
            isAnimating ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
          }`}
        >
          <div className="bg-gray-800 px-6 py-6">
            <div className="w-full">
              <h3 className="text-lg font-medium leading-6 text-white mb-6">Crear nueva tarea</h3>

              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                {/* Título */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                    Título *
                  </label>
                  <input
                    {...register("title")}
                    type="text"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ingresa el título de la tarea"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                  )}
                </div>

                {/* Descripción */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Descripción
                  </label>
                  <textarea
                    {...register("description")}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Describe la tarea (opcional)"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
                  )}
                </div>

                {/* Estado inicial */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                    Estado inicial
                  </label>
                  <select
                    {...register("status")}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="todo">📝 Pendiente</option>
                    <option value="in-progress">⏳ En progreso</option>
                    <option value="done">✅ Completada</option>
                  </select>
                </div>

                {/* Prioridad */}
                <div>
                  <label
                    htmlFor="priority"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Prioridad
                  </label>
                  <select
                    {...register("priority")}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="low">🟢 Baja</option>
                    <option value="medium">🟡 Media</option>
                    <option value="high">🔴 Alta</option>
                  </select>
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-md hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Creando..." : "Crear tarea"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

