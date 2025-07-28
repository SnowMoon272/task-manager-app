"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
  pointerWithin,
  CollisionDetection,
} from "@dnd-kit/core";
import { ClockIcon, DocumentTextIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Task } from "@/types";
import TaskColumn from "./TaskColumn";
import TaskCard from "./TaskCard";
import { TaskFilters } from "./TaskBoardHeader";

const columns = [
  {
    id: "todo",
    title: "Pendientes",
    icon: DocumentTextIcon,
    iconColor: "text-purple-400",
    color: "from-purple-500/25 to-purple-700/35",
  },
  {
    id: "in-progress",
    title: "En Progreso",
    icon: ClockIcon,
    iconColor: "text-cyan-400",
    color: "from-cyan-500/25 to-cyan-700/35",
  },
  {
    id: "done",
    title: "Completadas",
    icon: CheckCircleIcon,
    iconColor: "text-green-400",
    color: "from-green-500/30 to-green-700/40",
  },
];

interface TaskBoardViewProps {
  tasks: Task[];
  filters: TaskFilters;
  onTaskClick: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onDragEnd: (taskId: string, newStatus: "todo" | "in-progress" | "done") => void;
}

export default function TaskBoardView({
  tasks,
  filters,
  onTaskClick,
  onDeleteTask,
  onDragEnd,
}: TaskBoardViewProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Algoritmo de detección de colisiones personalizado
  const customCollisionDetection: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }
    return rectIntersection(args);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 50,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "task") {
      setActiveTask(event.active.data.current.task);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find((task) => task._id === activeId);
    if (!activeTask) return;

    let newStatus: "todo" | "in-progress" | "done" | null = null;

    // Determinar el nuevo estado basado en dónde se soltó
    if (over.data.current?.type === "column") {
      newStatus = over.data.current?.status as "todo" | "in-progress" | "done";
    } else if (over.data.current?.type === "task") {
      const overTask = tasks.find((task) => task._id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    // Solo proceder si hay un cambio de estado
    if (newStatus && activeTask.status !== newStatus) {
      await onDragEnd(activeTask._id, newStatus);
    }

    setActiveTask(null);
  };

  const getTasksByStatus = (status: string) => {
    const filteredTasks = tasks.filter((task) => task.status === status);

    // Aplicar filtros adicionales si existen
    if (filters.priority) {
      return filteredTasks.filter((task) => task.priority === filters.priority);
    }

    return filteredTasks;
  };

  // Obtener las columnas a mostrar basado en los filtros
  const getVisibleColumns = () => {
    if (filters.status) {
      return columns.filter((column) => column.id === filters.status);
    }
    return columns;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className={`grid gap-4 sm:gap-6 ${
          filters.status ? "grid-cols-1 w-full max-w-2xl mx-auto" : "grid-cols-1 md:grid-cols-3"
        }`}
      >
        {getVisibleColumns().map((column) => (
          <TaskColumn
            key={column.id}
            id={column.id}
            title={column.title}
            icon={column.icon}
            iconColor={column.iconColor}
            color={column.color}
            tasks={getTasksByStatus(column.id)}
            onDelete={onDeleteTask}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="cursor-grabbing">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

