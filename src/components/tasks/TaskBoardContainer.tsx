"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useTasksStore } from "@/store/tasks";
import { Task, CreateTaskData } from "@/types";
import TaskBoardView from "./TaskBoardView";
import TaskBoardModals from "./TaskBoardModals";
import TaskBoardEmptyStates from "./TaskBoardEmptyStates";
import TaskBoardHeader, { TaskFilters } from "./TaskBoardHeader";

export default function TaskBoardContainer() {
  // Store hooks
  const { user } = useAuthStore();
  const { tasks, isLoading, error, fetchTasks, createTask, updateTask, deleteTask, clearTasks } =
    useTasksStore();

  // Estados locales
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    priority: null,
    status: null,
  });

  // Estados para modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Effects
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Detectar cambios de usuario y limpiar tareas
  useEffect(() => {
    if (user) {
      if (currentUserId && currentUserId !== user._id) {
        console.log("Usuario cambió, limpiando tareas anteriores");
        clearTasks();
        fetchTasks();
      }
      setCurrentUserId(user._id);
    } else if (currentUserId) {
      console.log("Usuario se deslogueó, limpiando tareas");
      clearTasks();
      setCurrentUserId(null);
    }
  }, [user, currentUserId, clearTasks, fetchTasks]);

  // Actualizar selectedTask cuando se actualice la tarea en el store
  useEffect(() => {
    if (selectedTask && tasks.length > 0) {
      const updatedTask = tasks.find((task: Task) => task._id === selectedTask._id);
      if (updatedTask) {
        setSelectedTask(updatedTask);
      }
    }
  }, [tasks, selectedTask]);

  // Handlers para modales
  const handleCreateTask = async (taskData: CreateTaskData) => {
    await createTask(taskData);
    setIsCreateModalOpen(false);
  };

  const handleEditTask = async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask._id, {
        title: updatedTask.title,
        description: updatedTask.description,
        priority: updatedTask.priority,
        status: updatedTask.status,
        subtasks: updatedTask.subtasks,
        comments: updatedTask.comments,
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTaskFromModal = (taskId: string) => {
    const task = tasks.find((t: Task) => t._id === taskId);
    if (task) {
      setTaskToDelete(task);
    }
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete._id);
    }
    setTaskToDelete(null);
  };

  const handleUpdateSubtasks = async (taskId: string, subtasks: Task["subtasks"]) => {
    try {
      await updateTask(taskId, { subtasks });
    } catch (error) {
      console.error("Error updating subtasks:", error);
    }
  };

  // Handlers para interacciones
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleFiltersChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  // Handler para drag and drop
  const handleDragEnd = async (taskId: string, newStatus: "todo" | "in-progress" | "done") => {
    try {
      await updateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleClearFilters = () => {
    setFilters({ priority: null, status: null });
  };

  // Filtros y utilidades
  const getFilteredTasks = () => {
    let filteredTasks = tasks;

    // Solo filtrar por prioridad aquí
    // El filtro de estado se maneja en TaskBoardView para mostrar/ocultar columnas
    if (filters.priority) {
      filteredTasks = filteredTasks.filter((task: Task) => task.priority === filters.priority);
    }

    return filteredTasks;
  };

  const filteredTasks = getFilteredTasks();

  // Mostrar mensaje de error si existe
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Error al cargar las tareas</h3>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header del TaskBoard */}
        <TaskBoardHeader
          onCreateTask={() => setIsCreateModalOpen(true)}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Estados vacíos */}
        <TaskBoardEmptyStates
          isLoading={isLoading}
          error={error}
          tasks={tasks}
          filteredTasks={filteredTasks}
          filters={filters}
          isCreateModalOpen={isCreateModalOpen}
          onCreateTask={() => setIsCreateModalOpen(true)}
          onClearFilters={handleClearFilters}
        />

        {/* Vista principal del board (solo si hay tareas) */}
        {tasks.length > 0 && (
          <TaskBoardView
            tasks={filteredTasks}
            filters={filters}
            onTaskClick={handleTaskClick}
            onDeleteTask={handleDeleteTaskFromModal}
            onDragEnd={handleDragEnd}
          />
        )}

        {/* Modales */}
        <TaskBoardModals
          isCreateModalOpen={isCreateModalOpen}
          onCloseCreateModal={() => setIsCreateModalOpen(false)}
          onCreateTask={handleCreateTask}
          selectedTask={selectedTask}
          onCloseDetailModal={() => setSelectedTask(null)}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTaskFromModal}
          onUpdateSubtasks={handleUpdateSubtasks}
          taskToDelete={taskToDelete}
          onCloseDeleteModal={() => setTaskToDelete(null)}
          onConfirmDelete={handleConfirmDelete}
        />
      </div>
    </div>
  );
}

