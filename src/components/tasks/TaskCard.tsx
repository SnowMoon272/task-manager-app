"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onTaskClick?: (task: Task) => void;
}

const priorityColors = {
  low: "border-green-500/50 bg-green-500/10",
  medium: "border-yellow-500/50 bg-yellow-500/10",
  high: "border-red-500/50 bg-red-500/10",
};

const priorityIcons = {
  low: "🟢",
  medium: "🟡",
  high: "🔴",
};

export default function TaskCard({ task, onEdit, onDelete, onTaskClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Solo activar el click si no se está arrastrando y no se hizo click en botones
    if (!isDragging && !e.defaultPrevented && onTaskClick) {
      onTaskClick(task);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "hace unos minutos";
    if (diffInHours < 24) return `hace ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `hace ${diffInDays}d`;
    return formatDate(dateString);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleCardClick}
      className={`
        group relative cursor-grab active:cursor-grabbing
        bg-gray-800/50 backdrop-blur-sm border rounded-lg p-4
        transition-all duration-200 hover:bg-gray-800/70
        ${priorityColors[task.priority]}
        ${isDragging ? "opacity-50 rotate-2 scale-105 shadow-2xl" : "hover:shadow-lg"}
      `}
    >
      {/* Header con prioridad */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm">{priorityIcons[task.priority]}</span>
          <span className="text-xs text-gray-400 capitalize">
            {task.priority === "low" ? "Baja" : task.priority === "medium" ? "Media" : "Alta"}
          </span>
        </div>

        {/* Menú de acciones */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
              title="Editar tarea"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task._id);
              }}
              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
              title="Eliminar tarea"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* Título */}
      <h3 className="text-white font-medium text-sm mb-2 leading-tight">{task.title}</h3>

      {/* Descripción */}
      {task.description && (
        <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Subtareas */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Subtareas</span>
            <span>
              {task.subtasks.filter((st) => st.completed).length}/{task.subtasks.length}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (task.subtasks.filter((st) => st.completed).length / task.subtasks.length) * 100
                }%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-block px-2 py-0.5 text-xs bg-purple-500/20 text-purple-300 rounded-full"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="inline-block px-2 py-0.5 text-xs bg-gray-600/50 text-gray-400 rounded-full">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="truncate">{getTimeAgo(task.createdAt)}</span>

        {task.dueDate && (
          <span
            className={`
            px-2 py-0.5 rounded-full
            ${
              new Date(task.dueDate) < new Date()
                ? "bg-red-500/20 text-red-400"
                : "bg-blue-500/20 text-blue-400"
            }
          `}
          >
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      {/* Indicador de arrastre */}
      {isDragging && (
        <div className="absolute inset-0 bg-purple-500/20 border-2 border-purple-500 rounded-lg pointer-events-none" />
      )}
    </div>
  );
}

