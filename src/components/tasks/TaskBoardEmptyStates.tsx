"use client";

import { Task } from "@/types";
import { TaskFilters } from "./TaskBoardHeader";
import SpaceButton from "../ui/SpaceButton";

interface TaskBoardEmptyStatesProps {
  isLoading: boolean;
  error: string | null;
  tasks: Task[];
  filteredTasks: Task[];
  filters: TaskFilters;
  isCreateModalOpen: boolean;
  onCreateTask: () => void;
  onClearFilters: () => void;
}

export default function TaskBoardEmptyStates({
  isLoading,
  error,
  tasks,
  filteredTasks,
  filters,
  isCreateModalOpen,
  onCreateTask,
  onClearFilters,
}: TaskBoardEmptyStatesProps) {
  // Loading state
  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] sm:min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm sm:text-base">Cargando tareas...</p>
        </div>
      </div>
    );
  }

  // Error or loading states should not show empty states
  if (error || isLoading) {
    return null;
  }

  // Estado vacío cuando no hay tareas
  if (tasks.length === 0 && !filters.priority && !filters.status) {
    return (
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
        <div className="flex justify-center">
          <SpaceButton
            onClick={onCreateTask}
            variant="primary"
            className="inline-flex items-center gap-2"
          >
            <span>+</span>
            <span>Crear mi primera tarea</span>
          </SpaceButton>
        </div>
      </div>
    );
  }

  // Estado cuando no hay tareas que coincidan con los filtros
  if (tasks.length > 0 && filteredTasks.length === 0 && (filters.priority || filters.status)) {
    return (
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
        <div className="flex justify-center">
          <SpaceButton
            onClick={onClearFilters}
            variant="secondary"
            className="inline-flex items-center gap-2"
          >
            <span>🗑️</span>
            <span>Limpiar filtros</span>
          </SpaceButton>
        </div>
      </div>
    );
  }

  // No mostrar nada si hay tareas filtradas o está cargando
  return null;
}

