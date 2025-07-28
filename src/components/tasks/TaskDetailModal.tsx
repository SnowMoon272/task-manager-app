"use client";

import { useState, useEffect } from "react";
import { Task, Subtask } from "@/types";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onUpdateSubtasks?: (taskId: string, subtasks: Task["subtasks"]) => void;
}

const priorityColors = {
  low: "border-green-500/50 bg-green-500/10 text-green-400",
  medium: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
  high: "border-red-500/50 bg-red-500/10 text-red-400",
};

const priorityIcons = {
  low: "🟢",
  medium: "🟡",
  high: "🔴",
};

const statusLabels = {
  todo: "Pendiente",
  "in-progress": "En Progreso",
  done: "Completada",
};

const statusColors = {
  todo: "bg-purple-500/20 text-purple-400",
  "in-progress": "bg-cyan-500/20 text-cyan-400",
  done: "bg-pink-500/20 text-pink-400",
};

export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
  onUpdateSubtasks,
}: TaskDetailModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCreatingSubtask, setIsCreatingSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedPriority, setEditedPriority] = useState<"low" | "medium" | "high">("medium");
  const [editedStatus, setEditedStatus] = useState<"todo" | "in-progress" | "done">("todo");
  const [showIncompleteSubtasksAlert, setShowIncompleteSubtasksAlert] = useState(false);
  const [showSubtaskBlockAlert, setShowSubtaskBlockAlert] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  // Inicializar los campos de edición cuando se abra el modal o cambie la tarea
  useEffect(() => {
    if (task && isOpen) {
      setEditedTitle(task.title);
      setEditedDescription(task.description || "");
      setEditedPriority(task.priority);
      setEditedStatus(task.status);
    }
  }, [task, isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const handleDeleteSubtask = (subtaskIndex: number, subtaskTitle: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la subtarea "${subtaskTitle}"?`)) {
      if (task) {
        // Crear una nueva lista sin la subtarea eliminada
        const updatedSubtasks = task.subtasks.filter((_, index) => index !== subtaskIndex);

        // Crear una copia actualizada de la tarea con las subtareas modificadas
        const updatedTask = {
          ...task,
          subtasks: updatedSubtasks,
        };

        // Usar onUpdateSubtasks si está disponible, sino usar onEdit
        if (onUpdateSubtasks) {
          onUpdateSubtasks(task._id, updatedSubtasks);
        } else if (onEdit) {
          onEdit(updatedTask);
        }
      }
    }
  };

  const handleToggleSubtask = (subtaskIndex: number) => {
    if (task) {
      // Verificar si la tarea principal está completada y se está intentando marcar una subtarea como pendiente
      const currentSubtask = task.subtasks[subtaskIndex];
      const wouldBecomePending = currentSubtask.completed && task.status === "done";

      if (wouldBecomePending) {
        // Mostrar popup personalizado y evitar el cambio
        setShowSubtaskBlockAlert(true);
        return;
      }

      // Crear una copia de las subtareas con el estado alternado
      const updatedSubtasks = task.subtasks.map((subtask, index) => {
        if (index === subtaskIndex) {
          return {
            ...subtask,
            completed: !subtask.completed,
          };
        }
        return subtask;
      });

      // Crear una copia actualizada de la tarea con las subtareas modificadas
      const updatedTask = {
        ...task,
        subtasks: updatedSubtasks,
      };

      // Usar onUpdateSubtasks si está disponible, sino usar onEdit
      if (onUpdateSubtasks) {
        onUpdateSubtasks(task._id, updatedSubtasks);
      } else if (onEdit) {
        onEdit(updatedTask);
      }
    }
  };

  const handleCreateSubtask = () => {
    if (newSubtaskTitle.trim() && task) {
      // Determinar si la subtarea debe estar completada basado en el estado de la tarea principal
      const isTaskCompleted = task.status === "done";

      // Crear una nueva subtarea con campos temporales para el frontend
      // El backend se encargará de generar los valores correctos
      const newSubtask: Subtask = {
        _id: `temp-${Date.now()}`, // ID temporal
        title: newSubtaskTitle.trim(),
        completed: isTaskCompleted, // Marcar como completada si la tarea principal está completada
        createdAt: new Date().toISOString(), // Temporal
        updatedAt: new Date().toISOString(), // Temporal
      };

      // Crear la lista actualizada de subtareas
      const updatedSubtasks = [...(task.subtasks || []), newSubtask];

      // Crear una copia actualizada de la tarea con la nueva subtarea
      const updatedTask = {
        ...task,
        subtasks: updatedSubtasks,
      };

      // Usar onUpdateSubtasks si está disponible, sino usar onEdit
      if (onUpdateSubtasks) {
        onUpdateSubtasks(task._id, updatedSubtasks);
      } else if (onEdit) {
        onEdit(updatedTask);
      }

      // Limpiar el formulario
      setNewSubtaskTitle("");
      setIsCreatingSubtask(false);
    }
  };

  const handleCancelSubtask = () => {
    setNewSubtaskTitle("");
    setIsCreatingSubtask(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateSubtask();
    } else if (e.key === "Escape") {
      handleCancelSubtask();
    }
  };

  const handleEditTask = () => {
    setIsEditingTask(true);
  };

  const hasIncompleteSubtasks = (task: Task) => {
    return (
      task.subtasks &&
      task.subtasks.length > 0 &&
      task.subtasks.some((subtask) => !subtask.completed)
    );
  };

  const handleSaveEdit = () => {
    if (editedTitle.trim() && task) {
      // Verificar si se está intentando cambiar a "completada" con subtareas pendientes
      if (editedStatus === "done" && hasIncompleteSubtasks(task)) {
        setShowIncompleteSubtasksAlert(true);
        return;
      }

      const updatedTask = {
        ...task,
        title: editedTitle.trim(),
        description: editedDescription.trim() || undefined,
        priority: editedPriority,
        status: editedStatus,
      };

      if (onEdit) {
        onEdit(updatedTask);
      }

      setIsEditingTask(false);
    }
  };

  const handleCancelEdit = () => {
    // Restaurar los valores originales
    if (task) {
      setEditedTitle(task.title);
      setEditedDescription(task.description || "");
      setEditedPriority(task.priority);
      setEditedStatus(task.status);
    }
    setIsEditingTask(false);
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  if (!isVisible || !task) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (onDelete && task) {
      onDelete(task._id);
      handleClose();
    }
    setShowDeleteConfirmation(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
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
              /* Modo edición */
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

                {/* Formulario de edición */}
                <div className="space-y-4">
                  {/* Título */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      onKeyDown={handleEditKeyPress}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                      placeholder="Título de la tarea..."
                      autoFocus
                    />
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      onKeyDown={handleEditKeyPress}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 resize-none"
                      placeholder="Descripción de la tarea..."
                    />
                  </div>

                  {/* Prioridad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Prioridad
                    </label>
                    <div className="flex space-x-2">
                      {(["low", "medium", "high"] as const).map((priority) => (
                        <button
                          key={priority}
                          type="button"
                          onClick={() => setEditedPriority(priority)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            editedPriority === priority
                              ? priorityColors[priority]
                                  .replace("border-", "border-2 border-")
                                  .replace("/50", "")
                              : "border border-gray-600/50 text-gray-400 hover:border-gray-500/50"
                          }`}
                        >
                          {priorityIcons[priority]}{" "}
                          {priority === "low" ? "Baja" : priority === "medium" ? "Media" : "Alta"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Estado */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
                    <div className="flex space-x-2">
                      {(["todo", "in-progress", "done"] as const).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setEditedStatus(status)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            editedStatus === status
                              ? statusColors[status]
                                  .replace("bg-", "border-2 border-")
                                  .replace("/20", "/50")
                              : "border border-gray-600/50 text-gray-400 hover:border-gray-500/50"
                          }`}
                        >
                          {statusLabels[status]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Botones de acción */}
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
              </div>
            ) : (
              /* Modo vista normal */
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{priorityIcons[task.priority]}</span>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{task.title}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[task.status]
                        }`}
                      >
                        {statusLabels[task.status]}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          priorityColors[task.priority]
                        }`}
                      >
                        Prioridad{" "}
                        {task.priority === "low"
                          ? "Baja"
                          : task.priority === "medium"
                          ? "Media"
                          : "Alta"}
                      </span>
                    </div>
                  </div>
                </div>

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
            {!isEditingTask && task.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Descripción</h3>
                <p className="text-gray-400 leading-relaxed">{task.description}</p>
              </div>
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
                <div className="space-y-2 mb-3">
                  {task.subtasks.map((subtask, index) => {
                    const isTaskCompleted = task.status === "done";
                    const canToggle = !isTaskCompleted || !subtask.completed; // Permitir solo completar si la tarea está completada

                    return (
                      <div
                        key={subtask._id || index}
                        className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 group ${
                          canToggle
                            ? "bg-gray-700/30 hover:bg-gray-700/50"
                            : "bg-gray-700/20 border border-orange-500/30"
                        }`}
                      >
                        <span
                          className={`text-lg transition-transform duration-200 ${
                            canToggle
                              ? "group-hover:scale-110 cursor-pointer"
                              : "cursor-not-allowed opacity-60"
                          }`}
                          onClick={() => canToggle && handleToggleSubtask(index)}
                          title={
                            canToggle
                              ? `Clic para marcar como ${
                                  subtask.completed ? "pendiente" : "completada"
                                }`
                              : "No se puede cambiar el estado: tarea principal completada"
                          }
                        >
                          {subtask.completed ? "✅" : "⭕"}
                        </span>
                        <span
                          className={`flex-1 transition-all duration-200 ${
                            subtask.completed ? "text-gray-500 line-through" : "text-gray-300"
                          } ${canToggle ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                          onClick={() => canToggle && handleToggleSubtask(index)}
                          title={
                            canToggle
                              ? `Clic para marcar como ${
                                  subtask.completed ? "pendiente" : "completada"
                                }`
                              : "No se puede cambiar el estado: tarea principal completada"
                          }
                        >
                          {subtask.title}
                        </span>
                        {!canToggle && (
                          <span
                            className="text-orange-400 text-xs opacity-60"
                            title="Bloqueado: tarea principal completada"
                          >
                            🔒
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSubtask(index, subtask.title);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 rounded transition-all duration-200"
                          title="Eliminar subtarea"
                        >
                          🗑️
                        </button>
                      </div>
                    );
                  })}
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

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Título de la subtarea..."
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                      autoFocus
                    />
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleCreateSubtask}
                        disabled={!newSubtaskTitle.trim()}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:opacity-50 text-white text-sm rounded transition-colors"
                      >
                        Crear
                      </button>
                      <button
                        onClick={handleCancelSubtask}
                        className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 text-sm rounded transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Mensaje cuando no hay subtareas */}
              {(!task.subtasks || task.subtasks.length === 0) && !isCreatingSubtask && (
                <p className="text-gray-500 text-sm italic">
                  No hay subtareas. Haz clic en &quot;Agregar&quot; para crear una.
                </p>
              )}
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Etiquetas</h3>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 text-sm bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-1">Fecha de creación</h3>
                <p className="text-gray-400 text-sm">{formatDate(task.createdAt)}</p>
              </div>

              {task.dueDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-1">Fecha límite</h3>
                  <p
                    className={`text-sm ${
                      new Date(task.dueDate) < new Date() ? "text-red-400" : "text-blue-400"
                    }`}
                  >
                    {formatDate(task.dueDate)}
                    {new Date(task.dueDate) < new Date() && " (Vencida)"}
                  </p>
                </div>
              )}
            </div>

            {/* Asignado a */}
            {task.assignee && (
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-1">Asignado a</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {typeof task.assignee === "object"
                        ? task.assignee.name?.charAt(0)?.toUpperCase() || "U"
                        : "U"}
                    </span>
                  </div>
                  <span className="text-gray-300">
                    {typeof task.assignee === "object"
                      ? task.assignee.name || task.assignee.email
                      : task.assignee}
                  </span>
                </div>
              </div>
            )}
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

      {/* Popup de alerta para subtareas incompletas */}
      {showIncompleteSubtasksAlert && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-all duration-300" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-md mx-auto bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-2xl border border-red-500/50"
              style={{
                animation: "borderPulse 2s ease-in-out infinite",
              }}
            >
              <style jsx>{`
                @keyframes borderPulse {
                  0%,
                  100% {
                    border-color: rgba(239, 68, 68, 0.5);
                  }
                  50% {
                    border-color: rgba(239, 68, 68, 0.8);
                  }
                }
              `}</style>
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                    <span className="text-red-400 text-xl">⚠️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">No se puede completar</h3>
                    <p className="text-red-400 text-sm">Subtareas pendientes</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-300 leading-relaxed">
                    No puedes marcar esta tarea como{" "}
                    <span className="text-pink-400 font-medium">completada</span> porque aún tienes{" "}
                    <span className="text-yellow-400 font-medium">
                      {task?.subtasks?.filter((st) => !st.completed).length} subtarea(s)
                      pendiente(s)
                    </span>
                    .
                  </p>

                  <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                    <p className="text-sm text-gray-400 mb-2">Subtareas pendientes:</p>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {task?.subtasks
                        ?.filter((st) => !st.completed)
                        .slice(0, 3)
                        .map((subtask, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <span className="text-yellow-400">⭕</span>
                            <span>{subtask.title}</span>
                          </li>
                        ))}
                      {task?.subtasks && task.subtasks.filter((st) => !st.completed).length > 3 && (
                        <li className="text-gray-500 text-xs">
                          y {task.subtasks.filter((st) => !st.completed).length - 3} más...
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setShowIncompleteSubtasksAlert(false)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup de alerta para bloqueo de subtareas */}
      {showSubtaskBlockAlert && (
        <div className="fixed inset-0 z-70 overflow-y-auto">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-all duration-300" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-md mx-auto bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-2xl border border-orange-500/50"
              style={{
                animation: "borderPulse 2s ease-in-out infinite",
              }}
            >
              <style jsx>{`
                @keyframes borderPulse {
                  0%,
                  100% {
                    border-color: rgba(249, 115, 22, 0.5);
                  }
                  50% {
                    border-color: rgba(249, 115, 22, 0.8);
                  }
                }
              `}</style>
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <span className="text-orange-400 text-xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Acción bloqueada</h3>
                    <p className="text-orange-400 text-sm">Tarea principal completada</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-300 leading-relaxed">
                    No puedes marcar una{" "}
                    <span className="text-cyan-400 font-medium">subtarea como pendiente</span>{" "}
                    mientras la tarea principal esté en estado{" "}
                    <span className="text-pink-400 font-medium">completada</span>.
                  </p>

                  <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                    <p className="text-sm text-gray-400 mb-2">💡 Sugerencia:</p>
                    <p className="text-sm text-gray-300">
                      Para modificar esta subtarea, primero mueve la tarea principal a{" "}
                      <span className="text-purple-400">&quot;Pendiente&quot;</span> o{" "}
                      <span className="text-cyan-400">&quot;En Progreso&quot;</span>.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setShowSubtaskBlockAlert(false)}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all duration-200 font-medium"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup de confirmación de eliminación */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 z-80 overflow-y-auto">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-all duration-300" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-md mx-auto bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-2xl border border-red-500/50"
              style={{
                animation: "borderPulse 2s ease-in-out infinite",
              }}
            >
              <style jsx>{`
                @keyframes borderPulse {
                  0%,
                  100% {
                    border-color: rgba(239, 68, 68, 0.5);
                  }
                  50% {
                    border-color: rgba(239, 68, 68, 0.8);
                  }
                }
              `}</style>
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                    <span className="text-red-400 text-xl">🗑️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Confirmar eliminación</h3>
                    <p className="text-red-400 text-sm">Esta acción no se puede deshacer</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-300 leading-relaxed">
                    ¿Estás seguro de que quieres eliminar la tarea{" "}
                    <span className="text-purple-400 font-medium">&quot;{task?.title}&quot;</span>?
                  </p>

                  {task?.subtasks && task.subtasks.length > 0 && (
                    <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                      <p className="text-sm text-gray-400 mb-1">⚠️ Advertencia:</p>
                      <p className="text-sm text-yellow-400">
                        Esta tarea tiene {task.subtasks.length} subtarea(s) que también se
                        eliminarán.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700/50 border border-gray-600/50 hover:border-gray-500/50 rounded-lg transition-all duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

