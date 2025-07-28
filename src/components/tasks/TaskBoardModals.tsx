"use client";

import { Task, CreateTaskData } from "@/types";
import { CreateTaskModal, TaskDetailModal } from "./modals";
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

  // Error modal
  errorMessage: string | null;
  onCloseErrorModal: () => void;

  // Incomplete subtasks alert modal
  showIncompleteSubtasksAlert: boolean;
  alertTask: Task | null;
  onCloseIncompleteSubtasksAlert: () => void;
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
  errorMessage,
  onCloseErrorModal,
  showIncompleteSubtasksAlert,
  alertTask,
  onCloseIncompleteSubtasksAlert,
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

      {/* Modal de error */}
      <ConfirmationModal
        isOpen={!!errorMessage}
        title="⚠️ Error al actualizar tarea"
        description=""
        confirmButtonText="Entendido"
        alertMode={true}
        onConfirm={onCloseErrorModal}
        customContent={
          <div className="mt-4 p-4 bg-red-900/20 rounded-lg border border-red-500/30">
            <p className="text-red-300 text-sm whitespace-pre-line leading-relaxed">
              {errorMessage}
            </p>
          </div>
        }
      />

      {/* Modal de subtareas pendientes */}
      <ConfirmationModal
        isOpen={showIncompleteSubtasksAlert && !!alertTask}
        title="No se puede completar"
        description={`No puedes mover "${alertTask?.title}" a completada porque aún tiene ${
          alertTask?.subtasks?.filter((st) => !st.completed).length
        } subtarea(s) pendiente(s).`}
        icon="⚠️"
        alertMode={true}
        confirmButtonText="Entendido"
        customContent={
          alertTask && (
            <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
              <p className="text-sm text-gray-400 mb-2">Subtareas pendientes:</p>
              <ul className="text-sm text-gray-300 space-y-1">
                {alertTask.subtasks
                  ?.filter((st) => !st.completed)
                  .slice(0, 3)
                  .map((subtask, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="text-yellow-400">⭕</span>
                      <span>{subtask.title}</span>
                    </li>
                  ))}
                {alertTask.subtasks &&
                  alertTask.subtasks.filter((st) => !st.completed).length > 3 && (
                    <li className="text-gray-500 text-xs">
                      y {alertTask.subtasks.filter((st) => !st.completed).length - 3} más...
                    </li>
                  )}
              </ul>
            </div>
          )
        }
        onConfirm={onCloseIncompleteSubtasksAlert}
      />
    </>
  );
}

