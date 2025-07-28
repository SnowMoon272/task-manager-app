"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { Task, CreateTaskData } from "@/types";
import TaskBoardModals from "./TaskBoardModals";

interface TaskBoardModalsGlobalProps {
  isCreateModalOpen: boolean;
  selectedTask: Task | null;
  taskToDelete: Task | null;
  errorMessage: string | null;
  showIncompleteSubtasksAlert: boolean;
  alertTask: Task | null;
  onCloseCreateModal: () => void;
  onCreateTask: (taskData: CreateTaskData) => Promise<void>;
  onCloseDetailModal: () => void;
  onEditTask: (task: Task) => Promise<void>;
  onDeleteTask: (taskId: string) => void;
  onUpdateSubtasks: (taskId: string, subtasks: Task["subtasks"]) => Promise<void>;
  onCloseDeleteModal: () => void;
  onConfirmDelete: () => Promise<void>;
  onCloseErrorModal: () => void;
  onCloseIncompleteSubtasksAlert: () => void;
}

export default function TaskBoardModalsGlobal(props: TaskBoardModalsGlobalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Detectar si hay modales activos
  const hasActiveModal =
    props.isCreateModalOpen ||
    props.selectedTask ||
    props.taskToDelete ||
    props.errorMessage ||
    props.showIncompleteSubtasksAlert;

  // Controlar el scroll de la página cuando hay modales activos
  useEffect(() => {
    if (!mounted) return;

    if (hasActiveModal) {
      // Deshabilitar scroll de la página
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;

      // Calcular el ancho del scrollbar para evitar saltos de layout
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
        // Restaurar scroll cuando el modal se cierre
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [hasActiveModal, mounted]);

  // Solo renderizar si estamos en el cliente y hay modales activos
  if (!mounted || !hasActiveModal) return null;

  // Crear portal al body para que los modales aparezcan por encima de todo
  return createPortal(
    <div className="fixed inset-0" style={{ zIndex: 10000 }}>
      <TaskBoardModals {...props} />
    </div>,
    document.body,
  );
}

