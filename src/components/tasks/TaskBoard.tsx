"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
  pointerWithin,
  CollisionDetection,
} from "@dnd-kit/core";
import { Task, CreateTaskData } from "@/types";
import { useTasksStore } from "@/store/tasks";
import { useAuthStore } from "@/store/auth";
import TaskColumn from "./TaskColumn";
import TaskCard from "./TaskCard";
import CreateTaskModal from "./CreateTaskModal";
import TaskDetailModal from "./TaskDetailModal";

const columns = [
  {
    id: "todo",
    title: "Pendientes",
    emoji: "📝",
    color: "from-purple-600 to-purple-700",
  },
  {
    id: "in-progress",
    title: "En Progreso",
    emoji: "⏳",
    color: "from-cyan-600 to-cyan-700",
  },
  {
    id: "done",
    title: "Completadas",
    emoji: "✅",
    color: "from-pink-600 to-pink-700",
  },
];

export default function TaskBoard() {
  const { tasks, isLoading, error, createTask, moveTask, deleteTask, clearTasks } = useTasksStore();
  const fetchTasks = useTasksStore((state) => state.fetchTasks);
  const { user } = useAuthStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Algoritmo de detección de colisiones personalizado
  const customCollisionDetection: CollisionDetection = (args) => {
    // Primero intentamos con pointerWithin para priorizar donde está el puntero
    const pointerCollisions = pointerWithin(args);

    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }

    // Si no hay colisiones con el puntero, usamos rectIntersection como fallback
    return rectIntersection(args);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 50,
      },
    }),
  );

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar el componente

  // Detectar cambios de usuario y limpiar tareas
  useEffect(() => {
    if (user) {
      // Si hay un usuario anterior y es diferente al actual
      if (currentUserId && currentUserId !== user._id) {
        console.log("Usuario cambió, limpiando tareas anteriores");
        clearTasks();
        // Fetch las nuevas tareas del nuevo usuario
        fetchTasks();
      }
      setCurrentUserId(user._id);
    } else if (currentUserId) {
      // Si no hay usuario pero había uno antes (logout)
      console.log("Usuario se deslogueó, limpiando tareas");
      clearTasks();
      setCurrentUserId(null);
    }
  }, [user, currentUserId, clearTasks, fetchTasks]);

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

    // Si se está moviendo sobre una columna
    if (over.data.current?.type === "column") {
      const newStatus = over.data.current?.status as "todo" | "in-progress" | "done";
      if (newStatus && activeTask.status !== newStatus) {
        await moveTask(activeTask._id, newStatus);
      }
    }

    setActiveTask(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "task";
    const isOverTask = over.data.current?.type === "task";
    const isOverColumn = over.data.current?.type === "column";

    if (!isActiveTask) return;

    // Dropping a task over another task
    if (isActiveTask && isOverTask) {
      const activeTask = tasks.find((task) => task._id === activeId);
      const overTask = tasks.find((task) => task._id === overId);

      if (!activeTask || !overTask) return;

      if (activeTask.status !== overTask.status) {
        moveTask(activeTask._id, overTask.status);
      }
    }

    // Dropping a task over a column
    if (isActiveTask && isOverColumn) {
      const activeTask = tasks.find((task) => task._id === activeId);
      if (!activeTask) return;

      const newStatus = over.data.current?.status as "todo" | "in-progress" | "done";
      if (newStatus && activeTask.status !== newStatus) {
        moveTask(activeTask._id, newStatus);
      }
    }
  };

  const handleCreateTask = async (taskData: CreateTaskData) => {
    await createTask(taskData);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      await deleteTask(taskId);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedTask(null);
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header con botón para crear tarea */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Gestión de Tareas
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Organiza tus tareas arrastrándolas entre columnas
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
        >
          <span className="transition-transform group-hover:rotate-90">+</span>
          <span>Nueva tarea</span>
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Estado vacío cuando no hay tareas */}
      {!isLoading && !error && tasks.length === 0 && (
        <div className="text-center py-12 mb-6">
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            ¡Comienza tu jornada productiva!
          </h3>
          <p className="text-gray-400 mb-4">
            No tienes tareas aún. Crea tu primera tarea para empezar a organizarte.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
          >
            <span>+</span>
            <span>Crear mi primera tarea</span>
          </button>
        </div>
      )}

      {/* Board - Solo mostrar cuando hay tareas o no está en estado de error */}
      {!error && (tasks.length > 0 || isLoading) && (
        <DndContext
          sensors={sensors}
          collisionDetection={customCollisionDetection}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => (
              <TaskColumn
                key={column.id}
                id={column.id}
                title={column.title}
                emoji={column.emoji}
                color={column.color}
                tasks={getTasksByStatus(column.id)}
                onDelete={handleDeleteTask}
                onTaskClick={handleTaskClick}
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
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        task={selectedTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}

