import { useState } from "react";
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

interface UseCreateTaskProps {
  onSubmit: (data: CreateTaskData) => Promise<void>;
  onClose: () => void;
}

export const useCreateTask = ({ onSubmit, onClose }: UseCreateTaskProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateTaskFormData>({
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
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return {
    form,
    isSubmitting,
    handleFormSubmit,
    handleClose,
  };
};

export type { CreateTaskFormData };

