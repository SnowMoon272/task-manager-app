"use client";

import { useState, useEffect } from "react";
import { Task } from "@/types";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
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
}: TaskDetailModalProps) {
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
    }, 300);
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

  const handleEdit = () => {
    if (onEdit) {
      onEdit(task);
      handleClose();
    }
  };

  const handleDelete = () => {
    if (onDelete && confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      onDelete(task._id);
      handleClose();
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
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
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

            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-lg"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Descripción */}
            {task.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Descripción</h3>
                <p className="text-gray-400 leading-relaxed">{task.description}</p>
              </div>
            )}

            {/* Subtareas */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-300">
                    Subtareas ({task.subtasks.filter((st) => st.completed).length}/
                    {task.subtasks.length})
                  </h3>
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
                </div>

                <div className="space-y-2">
                  {task.subtasks.map((subtask, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-2 bg-gray-700/30 rounded-lg"
                    >
                      <span className="text-lg">{subtask.completed ? "✅" : "⭕"}</span>
                      <span
                        className={`flex-1 ${
                          subtask.completed ? "text-gray-500 line-through" : "text-gray-300"
                        }`}
                      >
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700/50">
            {onDelete && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-all duration-200"
              >
                Eliminar
              </button>
            )}

            {onEdit && (
              <button
                onClick={handleEdit}
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
      </div>
    </div>
  );
}

