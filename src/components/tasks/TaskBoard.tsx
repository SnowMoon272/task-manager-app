"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { ClockIcon, DocumentTextIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

import { useAuthStore } from "@/store/auth";
import { useTasksStore } from "@/store/tasks";
import { Task, CreateTaskData } from "@/types";
import TaskBoardHeader, { TaskFilters } from "./TaskBoardHeader";
import TaskColumn from "./TaskColumn";
import TaskCard from "./TaskCard";
import CreateTaskModal from "./modals/CreateTaskModal";
import TaskDetailModal from "./modals/TaskDetailModal";
import TaskInstructions from "./TaskInstructions";
import ConfirmationModal from "../ui/ConfirmationModal";

export default function TaskBoard() {
  const { user } = useAuthStore();
  const { tasks, isLoading, error, fetchTasks, createTask, updateTask, deleteTask, clearTasks } =
    useTasksStore();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    priority: null,
    status: null,
  });

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Encontrar la tarea que se está moviendo
    const activeTask = tasks.find((task: Task) => task._id === activeId);
    if (!activeTask) return;

    // Determinar el nuevo estado basado en el contenedor de destino
    let newStatus = activeTask.status;
    if (overId === "todo") newStatus = "todo";
    else if (overId === "in-progress") newStatus = "in-progress";
    else if (overId === "done") newStatus = "done";
    else {
      // Si se suelta sobre otra tarea, usar el estado de esa tarea
      const overTask = tasks.find((task: Task) => task._id === overId);
      if (overTask) newStatus = overTask.status;
    }

    // Solo actualizar si el estado cambió
    if (newStatus !== activeTask.status) {
      try {
        await updateTask(activeId, { status: newStatus });
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    }
  };

  const handleCreateTask = async (taskData: CreateTaskData) => {
    await createTask(taskData);
    setIsCreateModalOpen(false);
  };

  const handleDeleteTask = async (taskId: string) => {
    const task = tasks.find((t: Task) => t._id === taskId);
    if (task) {
      setTaskToDelete(task);
      setShowDeleteConfirmation(true);
    }
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

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleFiltersChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete._id);
    }
    setShowDeleteConfirmation(false);
    setTaskToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setTaskToDelete(null);
  };

  const getFilteredTasks = () => {
    let filteredTasks = tasks;

    if (filters.priority) {
      filteredTasks = filteredTasks.filter((task: Task) => task.priority === filters.priority);
    }

    if (filters.status) {
      filteredTasks = filteredTasks.filter((task: Task) => task.status === filters.status);
    }

    return filteredTasks;
  };

  const filteredTasks = getFilteredTasks();

  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter((task: Task) => task.status === status);
  };

  const activeTask = activeId ? tasks.find((task: Task) => task._id === activeId) : null;

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
        <TaskBoardHeader
          onCreateTask={() => setIsCreateModalOpen(true)}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Loading spinner cuando está cargando por primera vez */}
        {isLoading && tasks.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px] sm:min-h-[500px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400 text-sm sm:text-base">Cargando tareas...</p>
            </div>
          </div>
        ) : tasks.length === 0 ? (
          // Estado vacío cuando no hay tareas
          <div
            className={`text-center mb-6 flex flex-col justify-center ${
              isCreateModalOpen ? "py-20 min-h-[500px]" : "py-12 min-h-[300px]"
            }`}
          >
            <div className="text-4xl sm:text-6xl mb-4">🚀</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">
              ¡Comienza tu jornada productiva!
            </h3>
            <p className="text-sm sm:text-base text-gray-400 mb-6 max-w-md mx-auto px-4">
              No tienes tareas aún. Crea tu primera tarea para empezar a organizarte.
            </p>
          </div>
        ) : filteredTasks.length === 0 && (filters.priority || filters.status) ? (
          // Estado cuando no hay tareas que coincidan con los filtros
          <div
            className={`text-center mb-6 flex flex-col justify-center ${
              isCreateModalOpen ? "py-20 min-h-[400px]" : "py-12 min-h-[250px]"
            }`}
          >
            <div className="text-4xl sm:text-6xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">
              No se encontraron tareas
            </h3>
            <p className="text-sm sm:text-base text-gray-400 mb-6 max-w-md mx-auto px-4">
              No hay tareas que coincidan con los filtros seleccionados.
            </p>
          </div>
        ) : (
          // Board principal con drag and drop
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
              <TaskColumn
                id="todo"
                title="Pendientes"
                tasks={getTasksByStatus("todo")}
                icon={DocumentTextIcon}
                color="from-purple-500/25 to-purple-700/35"
                iconColor="text-purple-400"
                onTaskClick={handleTaskClick}
                onDelete={handleDeleteTask}
              />
              <TaskColumn
                id="in-progress"
                title="En Progreso"
                tasks={getTasksByStatus("in-progress")}
                icon={ClockIcon}
                color="from-cyan-500/25 to-cyan-700/35"
                iconColor="text-cyan-400"
                onTaskClick={handleTaskClick}
                onDelete={handleDeleteTask}
              />
              <TaskColumn
                id="done"
                title="Completadas"
                tasks={getTasksByStatus("done")}
                icon={CheckCircleIcon}
                color="from-green-500/30 to-green-700/40"
                iconColor="text-green-400"
                onTaskClick={handleTaskClick}
                onDelete={handleDeleteTask}
              />
            </div>

            <DragOverlay>
              {activeTask ? (
                <TaskCard task={activeTask} onTaskClick={() => {}} onDelete={() => {}} />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}

        {/* Instrucciones solo si hay tareas o al menos una vez se han mostrado */}
        {tasks.length > 0 && (
          <TaskInstructions
            isVisible={showInstructions}
            onClose={() => setShowInstructions(false)}
          />
        )}

        {/* Modal de crear tarea */}
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTask}
        />

        {/* Modal de detalle de tarea */}
        {selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedTask(null);
            }}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onUpdateSubtasks={async (taskId, subtasks) => {
              await updateTask(taskId, { subtasks });
            }}
          />
        )}

        {/* Modal de confirmación de eliminación */}
        <ConfirmationModal
          isOpen={showDeleteConfirmation}
          title="Eliminar Tarea"
          description={`¿Estás seguro de que quieres eliminar la tarea "${taskToDelete?.title}"?`}
          warningMessage="Esta acción no se puede deshacer."
          confirmButtonText="Eliminar"
          cancelButtonText="Cancelar"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </div>
    </div>
  );
}

