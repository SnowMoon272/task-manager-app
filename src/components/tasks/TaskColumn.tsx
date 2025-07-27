"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task } from "@/types";
import TaskCard from "./TaskCard";

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  emoji: string;
  color: string;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onTaskClick?: (task: Task) => void;
}

export default function TaskColumn({
  id,
  title,
  tasks,
  emoji,
  color,
  onEdit,
  onDelete,
  onTaskClick,
}: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "column",
      status: id,
    },
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header de la columna */}
      <div
        className={`
        px-4 py-3 rounded-t-lg border-b border-gray-700
        bg-gradient-to-r ${color}
      `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{emoji}</span>
            <h3 className="font-semibold text-white">{title}</h3>
          </div>
          <span className="text-sm text-white/80 bg-white/20 px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Área de drop */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 p-4 space-y-3 bg-gray-900/30 backdrop-blur-sm rounded-b-lg
          min-h-[400px] transition-all duration-200 border-2 border-transparent
          ${isOver ? "bg-gray-700/50 border-purple-500/50 shadow-lg shadow-purple-500/25" : ""}
        `}
      >
        <SortableContext
          items={tasks.map((task) => task._id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500 text-center">
              <div className="text-3xl mb-2">🌌</div>
              <p className="text-sm">No hay tareas aquí</p>
              <p className="text-xs text-gray-600">Arrastra una tarea para comenzar</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onTaskClick={onTaskClick}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}

