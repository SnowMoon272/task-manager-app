"use client";

import { Task, CreateTaskData } from "@/types";
import CreateTaskModal from "./modals/CreateTaskModal";
import TaskDetailModal from "./modals/TaskDetailModal";
import ConfirmationModal from "../ui/ConfirmationModal";

interface TaskBoardModalsProps {
  // Create modal
  isCreateModalOpen: boolean;
  onCloseCreateModal: () => void;
  onCreateTask: (data: CreateTaskData) => Promise<void>;

  // Detail modal
  selectedTask: Task | null;
  onCloseDetailModal: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateSubtasks: (taskId: string, subtasks: Task["subtasks"]) => void;

  // Delete confirmation modal
  taskToDelete: Task | null;
  onCloseDeleteModal: () => void;
  onConfirmDelete: () => void;
}

export default function TaskBoardModals({
  isCreateModalOpen,
  onCloseCreateModal,
  onCreateTask,
  selectedTask,
  onCloseDetailModal,
  onEditTask,
  onDeleteTask,
  onUpdateSubtasks,
  taskToDelete,
  onCloseDeleteModal,
  onConfirmDelete,
}: TaskBoardModalsProps) {
  return (
    <>
      {/* Modal de crear tarea */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={onCloseCreateModal}
        onSubmit={onCreateTask}
      />

      {/* Modal de detalle de tarea */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={onCloseDetailModal}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          onUpdateSubtasks={onUpdateSubtasks}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      <ConfirmationModal
        isOpen={!!taskToDelete}
        title="Eliminar Tarea"
        description={`¿Estás seguro de que quieres eliminar la tarea "${taskToDelete?.title}"?`}
        warningMessage="Esta acción no se puede deshacer."
        confirmButtonText="Eliminar"
        cancelButtonText="Cancelar"
        onConfirm={onConfirmDelete}
        onCancel={onCloseDeleteModal}
      />
    </>
  );
}

