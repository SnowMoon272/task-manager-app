"use client";

import { Task } from "@/types";
import ConfirmationModal from "../../ui/ConfirmationModal";
import {
  TaskHeader,
  TaskDescription,
  SubtaskList,
  SubtaskForm,
  CommentList,
  CommentForm,
  TaskInfo,
  useTaskDetail,
} from "./";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onUpdateSubtasks?: (taskId: string, subtasks: Task["subtasks"]) => void;
}

export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
  onUpdateSubtasks,
}: TaskDetailModalProps) {
  const {
    // Estados de UI
    isVisible,
    isAnimating,
    isEditingTask,

    // Estados de subtareas
    isCreatingSubtask,
    setIsCreatingSubtask,
    newSubtaskTitle,
    setNewSubtaskTitle,

    // Estados de edición
    editedTitle,
    setEditedTitle,
    editedDescription,
    setEditedDescription,
    editedPriority,
    setEditedPriority,
    editedStatus,
    setEditedStatus,

    // Estados de comentarios
    isCreatingComment,
    setIsCreatingComment,
    newCommentText,
    setNewCommentText,
    editingCommentId,
    editedCommentText,
    setEditedCommentText,

    // Estados de modales
    showIncompleteSubtasksAlert,
    setShowIncompleteSubtasksAlert,
    showSubtaskBlockAlert,
    setShowSubtaskBlockAlert,
    showDeleteConfirmation,
    showDeleteCommentConfirmation,
    showDeleteSubtaskConfirmation,
    subtaskToDelete,

    // Funciones
    formatDate,
    handleClose,
    handleEditTask,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
    confirmDelete,
    handleToggleSubtask,
    handleCreateSubtask,
    handleDeleteSubtask,
    confirmDeleteSubtask,
    handleCreateComment,
    handleEditComment,
    handleSaveCommentEdit,
    handleDeleteComment,
    confirmDeleteComment,
    cancelDelete,
    cancelDeleteComment,
    cancelDeleteSubtask,
    handleCancelCommentEdit,
  } = useTaskDetail({
    task,
    isOpen,
    onEdit,
    onDelete,
    onUpdateSubtasks,
    onClose,
  });

  if (!isVisible || !task) return null;

  // Manejadores de teclado
  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleSubtaskKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateSubtask();
    } else if (e.key === "Escape") {
      setNewSubtaskTitle("");
      setIsCreatingSubtask(false);
    }
  };

  const handleCommentKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleCreateComment();
    } else if (e.key === "Escape") {
      setIsCreatingComment(false);
      setNewCommentText("");
    }
  };

  const handleEditCommentKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSaveCommentEdit();
    } else if (e.key === "Escape") {
      handleCancelCommentEdit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ease-out ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full max-w-2xl mx-auto bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700/50 transition-all duration-300 ease-out ${
            isAnimating ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-700/50">
            {isEditingTask ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Editar Tarea</h2>
                  <button
                    onClick={handleCancelEdit}
                    className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-lg"
                  >
                    ✕
                  </button>
                </div>

                <TaskHeader
                  task={task}
                  isEditing={true}
                  editedTitle={editedTitle}
                  editedStatus={editedStatus}
                  editedPriority={editedPriority}
                  onTitleChange={setEditedTitle}
                  onStatusChange={setEditedStatus}
                  onPriorityChange={setEditedPriority}
                  onKeyPress={handleEditKeyPress}
                />

                <TaskDescription
                  task={task}
                  isEditing={true}
                  editedDescription={editedDescription}
                  onDescriptionChange={setEditedDescription}
                  onKeyPress={handleEditKeyPress}
                />

                <div className="flex items-center space-x-2 pt-2">
                  <button
                    onClick={handleSaveEdit}
                    disabled={!editedTitle.trim()}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700/50 border border-gray-600/50 hover:border-gray-500/50 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <TaskHeader
                  task={task}
                  isEditing={false}
                  editedTitle=""
                  editedStatus={task.status}
                  editedPriority={task.priority}
                  onTitleChange={() => {}}
                  onStatusChange={() => {}}
                  onPriorityChange={() => {}}
                  onKeyPress={() => {}}
                />

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Descripción - Solo se muestra cuando no está en modo edición */}
            {!isEditingTask && (
              <TaskDescription
                task={task}
                isEditing={false}
                editedDescription=""
                onDescriptionChange={() => {}}
                onKeyPress={() => {}}
              />
            )}

            {/* Subtareas */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-300">
                  {task.subtasks && task.subtasks.length > 0 ? (
                    <>
                      Subtareas ({task.subtasks.filter((st) => st.completed).length}/
                      {task.subtasks.length})
                    </>
                  ) : (
                    "Subtareas"
                  )}
                </h3>
                <div className="flex items-center space-x-2">
                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (task.subtasks.filter((st) => st.completed).length /
                              task.subtasks.length) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  )}
                  <button
                    onClick={() => setIsCreatingSubtask(true)}
                    disabled={isEditingTask}
                    className="px-2 py-1 text-xs bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded transition-colors"
                  >
                    + Agregar
                  </button>
                </div>
              </div>

              {/* Lista de subtareas existentes */}
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="mb-3">
                  <SubtaskList
                    subtasks={task.subtasks}
                    onToggleSubtask={handleToggleSubtask}
                    onDeleteSubtask={handleDeleteSubtask}
                  />
                </div>
              )}

              {/* Formulario para crear nueva subtarea */}
              {isCreatingSubtask && (
                <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/50">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Nueva Subtarea</h4>

                  {/* Mensaje informativo para tareas completadas */}
                  {task.status === "done" && (
                    <div className="mb-3 p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400 text-sm">✅</span>
                        <span className="text-green-400 text-xs">
                          Esta subtarea se marcará automáticamente como completada
                        </span>
                      </div>
                    </div>
                  )}

                  <SubtaskForm
                    newSubtaskTitle={newSubtaskTitle}
                    isCreating={false}
                    onTitleChange={setNewSubtaskTitle}
                    onSubmit={handleCreateSubtask}
                    onCancel={() => {
                      setNewSubtaskTitle("");
                      setIsCreatingSubtask(false);
                    }}
                    onKeyPress={handleSubtaskKeyPress}
                  />
                </div>
              )}

              {/* Mensaje cuando no hay subtareas */}
              {(!task.subtasks || task.subtasks.length === 0) && !isCreatingSubtask && (
                <p className="text-gray-500 text-sm italic">
                  No hay subtareas. Haz clic en &quot;Agregar&quot; para crear una.
                </p>
              )}
            </div>

            {/* Información de la tarea */}
            <TaskInfo task={task} formatDate={formatDate} />

            {/* Comentarios */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-300">
                  Comentarios ({task.comments?.length || 0})
                </h3>
                <button
                  onClick={() => setIsCreatingComment(true)}
                  disabled={isEditingTask}
                  className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded transition-colors"
                >
                  + Agregar
                </button>
              </div>

              {/* Lista de comentarios existentes */}
              {task.comments && task.comments.length > 0 && (
                <CommentList
                  comments={task.comments}
                  editingCommentId={editingCommentId}
                  editedCommentText={editedCommentText}
                  onEditComment={handleEditComment}
                  onDeleteComment={handleDeleteComment}
                  onSaveCommentEdit={handleSaveCommentEdit}
                  onCancelCommentEdit={handleCancelCommentEdit}
                  onEditCommentTextChange={setEditedCommentText}
                  onEditCommentKeyPress={handleEditCommentKeyPress}
                  formatDate={formatDate}
                />
              )}

              {/* Formulario para crear nuevo comentario */}
              {isCreatingComment && (
                <CommentForm
                  newCommentText={newCommentText}
                  onTextChange={setNewCommentText}
                  onSubmit={handleCreateComment}
                  onCancel={() => {
                    setIsCreatingComment(false);
                    setNewCommentText("");
                  }}
                  onKeyPress={handleCommentKeyPress}
                />
              )}

              {/* Mensaje cuando no hay comentarios */}
              {(!task.comments || task.comments.length === 0) && !isCreatingComment && (
                <CommentList
                  comments={[]}
                  editingCommentId={null}
                  editedCommentText=""
                  onEditComment={() => {}}
                  onDeleteComment={() => {}}
                  onSaveCommentEdit={() => {}}
                  onCancelCommentEdit={() => {}}
                  onEditCommentTextChange={() => {}}
                  onEditCommentKeyPress={() => {}}
                  formatDate={formatDate}
                />
              )}
            </div>
          </div>

          {/* Footer */}
          {!isEditingTask && (
            <div className="flex items-center justify-between p-6 border-t border-gray-700/50">
              {/* Botón eliminar a la izquierda */}
              <div>
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-all duration-200"
                  >
                    Eliminar
                  </button>
                )}
              </div>

              {/* Botones editar y cerrar a la derecha */}
              <div className="flex items-center space-x-3">
                {onEdit && (
                  <button
                    onClick={handleEditTask}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200"
                  >
                    Editar
                  </button>
                )}

                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700/50 border border-gray-600/50 hover:border-gray-500/50 rounded-lg transition-all duration-200"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modales de confirmación */}
      <ConfirmationModal
        isOpen={showIncompleteSubtasksAlert}
        title="No se puede completar"
        description={`No puedes marcar esta tarea como completada porque aún tienes ${
          task?.subtasks?.filter((st) => !st.completed).length
        } subtarea(s) pendiente(s).`}
        icon="⚠️"
        alertMode={true}
        confirmButtonText="Entendido"
        customContent={
          task && (
            <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
              <p className="text-sm text-gray-400 mb-2">Subtareas pendientes:</p>
              <ul className="text-sm text-gray-300 space-y-1">
                {task.subtasks
                  ?.filter((st) => !st.completed)
                  .slice(0, 3)
                  .map((subtask, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="text-yellow-400">⭕</span>
                      <span>{subtask.title}</span>
                    </li>
                  ))}
                {task.subtasks && task.subtasks.filter((st) => !st.completed).length > 3 && (
                  <li className="text-gray-500 text-xs">
                    y {task.subtasks.filter((st) => !st.completed).length - 3} más...
                  </li>
                )}
              </ul>
            </div>
          )
        }
        onConfirm={() => setShowIncompleteSubtasksAlert(false)}
      />

      <ConfirmationModal
        isOpen={showSubtaskBlockAlert}
        title="Acción bloqueada"
        description="No puedes marcar una subtarea como pendiente mientras la tarea principal esté en estado completada."
        icon="🔒"
        alertMode={true}
        confirmButtonText="Entendido"
        customContent={
          <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
            <p className="text-sm text-gray-400 mb-2">💡 Sugerencia:</p>
            <p className="text-sm text-gray-300">
              Para modificar esta subtarea, primero mueve la tarea principal a{" "}
              <span className="text-purple-400">&quot;Pendiente&quot;</span> o{" "}
              <span className="text-cyan-400">&quot;En Progreso&quot;</span>.
            </p>
          </div>
        }
        onConfirm={() => setShowSubtaskBlockAlert(false)}
      />

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        title="Confirmar eliminación"
        description="¿Estás seguro de que quieres eliminar la tarea "
        itemName={task?.title}
        icon="🗑️"
        warningMessage={
          task?.subtasks && task.subtasks.length > 0
            ? `Esta tarea tiene ${task.subtasks.length} subtarea(s) que también se eliminarán.`
            : undefined
        }
        confirmButtonText="Eliminar"
        cancelButtonText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <ConfirmationModal
        isOpen={showDeleteCommentConfirmation}
        title="Eliminar comentario"
        description="¿Estás seguro de que quieres eliminar este comentario"
        icon="💬"
        confirmButtonText="Eliminar"
        cancelButtonText="Cancelar"
        onConfirm={confirmDeleteComment}
        onCancel={cancelDeleteComment}
      />

      <ConfirmationModal
        isOpen={showDeleteSubtaskConfirmation}
        title="Eliminar subtarea"
        description="¿Estás seguro de que quieres eliminar la subtarea "
        itemName={subtaskToDelete?.title}
        icon="📋"
        confirmButtonText="Eliminar"
        cancelButtonText="Cancelar"
        onConfirm={confirmDeleteSubtask}
        onCancel={cancelDeleteSubtask}
      />
    </div>
  );
}

