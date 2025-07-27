"use client";

interface TaskFiltersType {
  priority?: "low" | "medium" | "high" | null;
  status?: "todo" | "in-progress" | "done" | null;
}

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
}

export default function TaskFilters({ filters, onFiltersChange }: TaskFiltersProps) {
  const handlePriorityFilter = (priority: "low" | "medium" | "high" | null) => {
    onFiltersChange({ ...filters, priority });
  };

  const handleStatusFilter = (status: "todo" | "in-progress" | "done" | null) => {
    onFiltersChange({ ...filters, status });
  };

  const clearFilters = () => {
    onFiltersChange({ priority: null, status: null });
  };

  const hasActiveFilters = filters.priority || filters.status;

  return (
    <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 mb-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filtro por prioridad */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-medium text-gray-300 whitespace-nowrap">
              Prioridad:
            </label>
            <div className="flex gap-1">
              <button
                onClick={() => handlePriorityFilter(null)}
                className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                  !filters.priority
                    ? "bg-gray-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => handlePriorityFilter("high")}
                className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                  filters.priority === "high"
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-red-600/20"
                }`}
              >
                Alta
              </button>
              <button
                onClick={() => handlePriorityFilter("medium")}
                className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                  filters.priority === "medium"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-yellow-600/20"
                }`}
              >
                Media
              </button>
              <button
                onClick={() => handlePriorityFilter("low")}
                className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                  filters.priority === "low"
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-green-600/20"
                }`}
              >
                Baja
              </button>
            </div>
          </div>

          {/* Filtro por estado */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-medium text-gray-300 whitespace-nowrap">Estado:</label>
            <div className="flex gap-1">
              <button
                onClick={() => handleStatusFilter(null)}
                className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                  !filters.status
                    ? "bg-gray-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => handleStatusFilter("todo")}
                className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                  filters.status === "todo"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-purple-600/20"
                }`}
              >
                📝 Pendientes
              </button>
              <button
                onClick={() => handleStatusFilter("in-progress")}
                className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                  filters.status === "in-progress"
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-cyan-600/20"
                }`}
              >
                ⏳ En Progreso
              </button>
              <button
                onClick={() => handleStatusFilter("done")}
                className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                  filters.status === "done"
                    ? "bg-pink-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-pink-600/20"
                }`}
              >
                ✅ Completadas
              </button>
            </div>
          </div>
        </div>

        {/* Botón limpiar filtros */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-all duration-200 self-start lg:self-auto"
          >
            <span className="text-xs">🗑️</span>
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400">Filtros activos:</span>
            {filters.priority && (
              <span className="px-2 py-1 bg-gray-700 text-white text-xs rounded-full">
                Prioridad:{" "}
                {filters.priority === "high"
                  ? "Alta"
                  : filters.priority === "medium"
                  ? "Media"
                  : "Baja"}
              </span>
            )}
            {filters.status && (
              <span className="px-2 py-1 bg-gray-700 text-white text-xs rounded-full">
                Estado:{" "}
                {filters.status === "todo"
                  ? "Pendientes"
                  : filters.status === "in-progress"
                  ? "En Progreso"
                  : "Completadas"}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

