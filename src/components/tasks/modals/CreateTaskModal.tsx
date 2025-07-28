"use client";

import { CreateTaskData } from "@/types";
import { ModalBase, FormInput, FormTextarea, FormSelect, FormActions, useCreateTask } from "./";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskData) => Promise<void>;
}

const statusOptions = [
  { value: "todo", label: "📝 Pendiente" },
  { value: "in-progress", label: "⏳ En progreso" },
  { value: "done", label: "✅ Completada" },
];

const priorityOptions = [
  { value: "low", label: "🟢 Baja" },
  { value: "medium", label: "🟡 Media" },
  { value: "high", label: "🔴 Alta" },
];

export default function CreateTaskModal({ isOpen, onClose, onSubmit }: CreateTaskModalProps) {
  const { form, isSubmitting, handleFormSubmit, handleClose } = useCreateTask({
    onSubmit,
    onClose,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <ModalBase isOpen={isOpen} onClose={handleClose} title="Crear nueva tarea" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <FormInput
          id="title"
          label="Título"
          placeholder="Ingresa el título de la tarea"
          register={register("title")}
          error={errors.title?.message}
          required
        />

        <FormTextarea
          id="description"
          label="Descripción"
          placeholder="Describe la tarea (opcional)"
          register={register("description")}
          error={errors.description?.message}
          rows={3}
        />

        <FormSelect
          id="status"
          label="Estado inicial"
          register={register("status")}
          options={statusOptions}
          error={errors.status?.message}
        />

        <FormSelect
          id="priority"
          label="Prioridad"
          register={register("priority")}
          options={priorityOptions}
          error={errors.priority?.message}
        />

        <FormActions
          onCancel={handleClose}
          isSubmitting={isSubmitting}
          submitText="Crear tarea"
          loadingText="Creando..."
        />
      </form>
    </ModalBase>
  );
}

