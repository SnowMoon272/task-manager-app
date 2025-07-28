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
    <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 md:p-4 mb-4">
      <div className="flex flex-col gap-3 md:gap-4">
        {/* Header en móvil / Contenido principal en desktop */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 md:gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 md:gap-4 lg:gap-6">
            {/* Filtro por prioridad */}
            <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-3">
              <label className="text-sm font-medium text-gray-300 whitespace-nowrap">
                Prioridad:
              </label>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                <button
                  onClick={() => handlePriorityFilter(null)}
                  className={`px-2.5 md:px-3 py-1.5 md:py-1 text-xs rounded-full transition-all duration-200 whitespace-nowrap ${
                    !filters.priority
                      ? "bg-gray-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => handlePriorityFilter("high")}
                  className={`px-2.5 md:px-3 py-1.5 md:py-1 text-xs rounded-full transition-all duration-200 whitespace-nowrap ${
                    filters.priority === "high"
                      ? "bg-red-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-red-600/20"
                  }`}
                >
                  <span className="hidden sm:inline">🔴 </span>Alta
                </button>
                <button
                  onClick={() => handlePriorityFilter("medium")}
                  className={`px-2.5 md:px-3 py-1.5 md:py-1 text-xs rounded-full transition-all duration-200 whitespace-nowrap ${
                    filters.priority === "medium"
                      ? "bg-yellow-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-yellow-600/20"
                  }`}
                >
                  <span className="hidden sm:inline">🟡 </span>Media
                </button>
                <button
                  onClick={() => handlePriorityFilter("low")}
                  className={`px-2.5 md:px-3 py-1.5 md:py-1 text-xs rounded-full transition-all duration-200 whitespace-nowrap ${
                    filters.priority === "low"
                      ? "bg-green-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-green-600/20"
                  }`}
                >
                  <span className="hidden sm:inline">🟢 </span>Baja
                </button>
              </div>
            </div>

            {/* Filtro por estado */}
            <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-3">
              <label className="text-sm font-medium text-gray-300 whitespace-nowrap">Estado:</label>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                <button
                  onClick={() => handleStatusFilter(null)}
                  className={`px-2.5 md:px-3 py-1.5 md:py-1 text-xs rounded-full transition-all duration-200 whitespace-nowrap ${
                    !filters.status
                      ? "bg-gray-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => handleStatusFilter("todo")}
                  className={`px-2.5 md:px-3 py-1.5 md:py-1 text-xs rounded-full transition-all duration-200 whitespace-nowrap ${
                    filters.status === "todo"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-purple-600/20"
                  }`}
                >
                  📝 Pendientes
                </button>
                <button
                  onClick={() => handleStatusFilter("in-progress")}
                  className={`px-2.5 md:px-3 py-1.5 md:py-1 text-xs rounded-full transition-all duration-200 whitespace-nowrap ${
                    filters.status === "in-progress"
                      ? "bg-cyan-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-cyan-600/20"
                  }`}
                >
                  ⏳ <span className="hidden sm:inline">En Progreso</span>
                  <span className="sm:hidden">Progreso</span>
                </button>
                <button
                  onClick={() => handleStatusFilter("done")}
                  className={`px-2.5 md:px-3 py-1.5 md:py-1 text-xs rounded-full transition-all duration-200 whitespace-nowrap ${
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
              className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs md:text-sm transition-all duration-200 xl:self-start whitespace-nowrap"
            >
              <span className="text-xs">🗑️</span>
              <span className="hidden sm:inline">Limpiar filtros</span>
              <span className="sm:hidden">Limpiar</span>
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
    </div>
  );
}

