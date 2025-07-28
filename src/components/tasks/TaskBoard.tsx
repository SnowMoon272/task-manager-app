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
import TaskBoardHeader, { TaskFilters } from "./TaskBoardHeader";
import ConfirmationModal from "../ui/ConfirmationModal";

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
  const { tasks, isLoading, error, createTask, moveTask, deleteTask, updateTask, clearTasks } =
    useTasksStore();
  const fetchTasks = useTasksStore((state) => state.fetchTasks);
  const { user } = useAuthStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({ priority: null, status: null });
  const [showIncompleteSubtasksAlert, setShowIncompleteSubtasksAlert] = useState(false);
  const [alertTask, setAlertTask] = useState<Task | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

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

  // Actualizar selectedTask cuando se actualice la tarea en el store
  useEffect(() => {
    if (selectedTask && tasks.length > 0) {
      const updatedTask = tasks.find((task) => task._id === selectedTask._id);
      if (updatedTask) {
        setSelectedTask(updatedTask);
      }
    }
  }, [tasks, selectedTask]);

  const hasIncompleteSubtasks = (task: Task) => {
    return (
      task.subtasks &&
      task.subtasks.length > 0 &&
      task.subtasks.some((subtask) => !subtask.completed)
    );
  };

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
      // Se soltó sobre una columna
      newStatus = over.data.current?.status as "todo" | "in-progress" | "done";
    } else if (over.data.current?.type === "task") {
      // Se soltó sobre otra tarea
      const overTask = tasks.find((task) => task._id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    // Solo proceder si hay un cambio de estado
    if (newStatus && activeTask.status !== newStatus) {
      // Verificar si se está intentando mover a "done" con subtareas pendientes
      if (newStatus === "done" && hasIncompleteSubtasks(activeTask)) {
        setAlertTask(activeTask);
        setShowIncompleteSubtasksAlert(true);
        setActiveTask(null);
        return;
      }

      // Ejecutar el movimiento de la tarea
      await moveTask(activeTask._id, newStatus);
    }

    setActiveTask(null);
  };

  const handleDragOver = () => {
    // Mantenemos los efectos visuales del drag sin hacer llamadas al servidor
    // Los efectos visuales se manejan automáticamente por @dnd-kit
    // La actualización real se ejecuta solo en handleDragEnd
  };

  const handleCreateTask = async (taskData: CreateTaskData) => {
    await createTask(taskData);
  };

  const handleDeleteTask = async (taskId: string) => {
    const task = tasks.find((t) => t._id === taskId);
    if (task) {
      setTaskToDelete(task);
      setShowDeleteConfirmation(true);
    }
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

  const handleEditTask = async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask._id, {
        title: updatedTask.title,
        description: updatedTask.description,
        priority: updatedTask.priority,
        status: updatedTask.status, // Agregar status a la actualización
        subtasks: updatedTask.subtasks, // Agregar subtareas a la actualización
        comments: updatedTask.comments, // Agregar comentarios a la actualización
      });
    } catch (error) {
      console.error("Error updating task:", error);
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

  const handleFiltersChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  const getFilteredTasks = () => {
    let filteredTasks = tasks;

    // Filtrar por prioridad
    if (filters.priority) {
      filteredTasks = filteredTasks.filter((task) => task.priority === filters.priority);
    }

    // Filtrar por estado
    if (filters.status) {
      filteredTasks = filteredTasks.filter((task) => task.status === filters.status);
    }

    return filteredTasks;
  };

  const getTasksByStatus = (status: string) => {
    const filteredTasks = getFilteredTasks();
    return filteredTasks.filter((task) => task.status === status);
  };

  // Obtener las columnas a mostrar basado en los filtros
  const getVisibleColumns = () => {
    if (filters.status) {
      // Si hay filtro de estado, mostrar solo esa columna
      return columns.filter((column) => column.id === filters.status);
    }
    return columns; // Mostrar todas las columnas
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className={`w-full ${isCreateModalOpen ? "min-h-screen" : ""}`}>
        <TaskBoardHeader
          onCreateTask={() => setIsCreateModalOpen(true)}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTask}
        />
      </div>
    );
  }

  return (
    <div className={`w-full ${isCreateModalOpen ? "min-h-screen" : ""}`}>
      {/* Header componentizado */}
      <TaskBoardHeader
        onCreateTask={() => setIsCreateModalOpen(true)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Estado vacío cuando no hay tareas */}
      {!isLoading && !error && tasks.length === 0 && !filters.priority && !filters.status && (
        <div
          className={`text-center mb-6 flex flex-col justify-center ${
            isCreateModalOpen ? "py-20 min-h-[500px]" : "py-12 min-h-[300px]"
          }`}
        >
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            ¡Comienza tu jornada productiva!
          </h3>
          <p className="text-gray-400 mb-4">
            No tienes tareas aún. Crea tu primera tarea para empezar a organizarte.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 mx-auto"
          >
            <span>+</span>
            <span>Crear mi primera tarea</span>
          </button>
        </div>
      )}

      {/* Estado cuando no hay tareas que coincidan con los filtros */}
      {!isLoading &&
        !error &&
        tasks.length > 0 &&
        getFilteredTasks().length === 0 &&
        (filters.priority || filters.status) && (
          <div
            className={`text-center mb-6 flex flex-col justify-center ${
              isCreateModalOpen ? "py-20 min-h-[400px]" : "py-12 min-h-[250px]"
            }`}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No se encontraron tareas</h3>
            <p className="text-gray-400 mb-4">
              No hay tareas que coincidan con los filtros seleccionados.
            </p>
            <button
              onClick={() => setFilters({ priority: null, status: null })}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg font-medium transition-all duration-300 mx-auto"
            >
              <span>🗑️</span>
              <span>Limpiar filtros</span>
            </button>
          </div>
        )}

      {/* Board - Solo mostrar cuando hay tareas filtradas o no está en estado de error */}
      {!error && (getFilteredTasks().length > 0 || isLoading) && (
        <DndContext
          sensors={sensors}
          collisionDetection={customCollisionDetection}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div
            className={`grid gap-6 ${
              filters.status ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
            }`}
          >
            {getVisibleColumns().map((column) => (
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

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
      />

      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        task={selectedTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />

      {/* Popup de alerta para subtareas incompletas */}
      <ConfirmationModal
        isOpen={showIncompleteSubtasksAlert && !!alertTask}
        title="No se puede completar"
        description={`No puedes mover "${alertTask?.title}" a completada porque aún tiene ${
          alertTask?.subtasks?.filter((st) => !st.completed).length
        } subtarea(s) pendiente(s).`}
        icon="⚠️"
        alertMode={true}
        confirmButtonText="Entendido"
        customContent={
          alertTask && (
            <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
              <p className="text-sm text-gray-400 mb-2">Subtareas pendientes:</p>
              <ul className="text-sm text-gray-300 space-y-1">
                {alertTask.subtasks
                  ?.filter((st) => !st.completed)
                  .slice(0, 3)
                  .map((subtask, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="text-yellow-400">⭕</span>
                      <span>{subtask.title}</span>
                    </li>
                  ))}
                {alertTask.subtasks &&
                  alertTask.subtasks.filter((st) => !st.completed).length > 3 && (
                    <li className="text-gray-500 text-xs">
                      y {alertTask.subtasks.filter((st) => !st.completed).length - 3} más...
                    </li>
                  )}
              </ul>
            </div>
          )
        }
        onConfirm={() => {
          setShowIncompleteSubtasksAlert(false);
          setAlertTask(null);
        }}
      />

      {/* Popup de confirmación de eliminación */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation && !!taskToDelete}
        title="Confirmar eliminación"
        description="¿Estás seguro de que quieres eliminar la tarea "
        itemName={taskToDelete?.title}
        icon="🗑️"
        warningMessage={
          taskToDelete?.subtasks && taskToDelete.subtasks.length > 0
            ? `Esta tarea tiene ${taskToDelete.subtasks.length} subtarea(s) que también se eliminarán.`
            : undefined
        }
        confirmButtonText="Eliminar"
        cancelButtonText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

