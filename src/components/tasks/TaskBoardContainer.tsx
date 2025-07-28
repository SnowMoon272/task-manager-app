"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth";
import { useTasksStore } from "@/store/tasks";
import { Task, CreateTaskData } from "@/types";
import TaskBoardView from "./TaskBoardView";
import TaskBoardEmptyStates from "./TaskBoardEmptyStates";
import TaskBoardHeader, { TaskFilters } from "./TaskBoardHeader";

export default function TaskBoardContainer({
  onModalStatesChange,
}: {
  onModalStatesChange?: (states: {
    isCreateModalOpen: boolean;
    selectedTask: Task | null;
    taskToDelete: Task | null;
    errorMessage: string | null;
    showIncompleteSubtasksAlert: boolean;
    alertTask: Task | null;
    onCloseCreateModal: () => void;
    onCreateTask: (taskData: CreateTaskData) => Promise<void>;
    onCloseDetailModal: () => void;
    onEditTask: (task: Task) => Promise<void>;
    onDeleteTask: (taskId: string) => void;
    onUpdateSubtasks: (taskId: string, subtasks: Task["subtasks"]) => Promise<void>;
    onCloseDeleteModal: () => void;
    onConfirmDelete: () => Promise<void>;
    onCloseErrorModal: () => void;
    onCloseIncompleteSubtasksAlert: () => void;
  }) => void;
}) {
  // Store hooks
  const { user } = useAuthStore();
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    clearTasks,
    moveTask,
  } = useTasksStore();

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showIncompleteSubtasksAlert, setShowIncompleteSubtasksAlert] = useState(false);
  const [alertTask, setAlertTask] = useState<Task | null>(null);

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
  const handleCreateTask = useCallback(
    async (taskData: CreateTaskData) => {
      await createTask(taskData);
      setIsCreateModalOpen(false);
    },
    [createTask],
  );

  const handleEditTask = useCallback(
    async (updatedTask: Task) => {
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
    },
    [updateTask],
  );

  const handleDeleteTaskFromModal = useCallback(
    (taskId: string) => {
      const task = tasks.find((t: Task) => t._id === taskId);
      if (task) {
        setTaskToDelete(task);
      }
    },
    [tasks],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete._id);
    }
    setTaskToDelete(null);
  }, [taskToDelete, deleteTask]);

  const handleUpdateSubtasks = useCallback(
    async (taskId: string, subtasks: Task["subtasks"]) => {
      try {
        await updateTask(taskId, { subtasks });
      } catch (error) {
        console.error("Error updating subtasks:", error);
      }
    },
    [updateTask],
  );

  // Comunicar estados de modales al padre (después de declarar los handlers)
  useEffect(() => {
    if (onModalStatesChange) {
      onModalStatesChange({
        isCreateModalOpen,
        selectedTask,
        taskToDelete,
        errorMessage,
        showIncompleteSubtasksAlert,
        alertTask,
        onCloseCreateModal: () => setIsCreateModalOpen(false),
        onCreateTask: handleCreateTask,
        onCloseDetailModal: () => setSelectedTask(null),
        onEditTask: handleEditTask,
        onDeleteTask: handleDeleteTaskFromModal,
        onUpdateSubtasks: handleUpdateSubtasks,
        onCloseDeleteModal: () => setTaskToDelete(null),
        onConfirmDelete: handleConfirmDelete,
        onCloseErrorModal: () => setErrorMessage(null),
        onCloseIncompleteSubtasksAlert: () => {
          setShowIncompleteSubtasksAlert(false);
          setAlertTask(null);
        },
      });
    }
  }, [
    isCreateModalOpen,
    selectedTask,
    taskToDelete,
    errorMessage,
    showIncompleteSubtasksAlert,
    alertTask,
    onModalStatesChange,
    handleCreateTask,
    handleEditTask,
    handleDeleteTaskFromModal,
    handleUpdateSubtasks,
    handleConfirmDelete,
  ]);

  // Handlers para interacciones
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleFiltersChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  // Handler para drag and drop
  const handleDragEnd = async (taskId: string, newStatus: "todo" | "in-progress" | "done") => {
    // Obtener la tarea antes de cualquier operación
    const task = tasks.find((t) => t._id === taskId);

    if (!task) {
      console.error("Tarea no encontrada:", taskId);
      return;
    }

    // VALIDACIÓN PREVIA: Verificar si se intenta completar una tarea con subtareas pendientes
    if (newStatus === "done" && task.subtasks && task.subtasks.length > 0) {
      const pendingSubtasks = task.subtasks.filter((subtask) => !subtask.completed);
      if (pendingSubtasks.length > 0) {
        console.log("Bloqueando movimiento - subtareas pendientes detectadas");
        // Mostrar modal de alerta INMEDIATAMENTE sin hacer la petición
        setAlertTask(task);
        setShowIncompleteSubtasksAlert(true);
        return; // No proceder con la petición
      }
    }

    // Si llegamos aquí, la validación pasó - proceder con la petición
    try {
      await moveTask(taskId, newStatus);
    } catch (error) {
      console.error("Error updating task status:", error);

      // Este catch es para otros errores no relacionados con subtareas
      const errorMsg =
        error instanceof Error ? error.message : "Error al actualizar el estado de la tarea";

      console.log("Error capturado:", errorMsg);
      console.log("Mostrando modal de error genérico");

      // Mostrar modal de error genérico para otros errores
      let formattedMsg = errorMsg;

      // Formatear el mensaje si es muy largo
      if (formattedMsg.length > 150) {
        if (formattedMsg.includes(": ")) {
          const [mainMessage, subtasksList] = formattedMsg.split(": ");
          formattedMsg = `${mainMessage}.\n\nSubtareas pendientes:\n${subtasksList
            .split(", ")
            .map((name) => `• ${name}`)
            .join("\n")}`;
        }
      }

      setErrorMessage(formattedMsg);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 sm:p-6 lg:p-8 overflow-hidden rounded-lg">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 sm:p-6 lg:p-8 overflow-hidden rounded-lg">
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
      </div>
    </div>
  );
}

