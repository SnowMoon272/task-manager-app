"use client";

interface TaskHeaderMainProps {
  onCreateTask: () => void;
  onToggleInstructions: () => void;
}

export default function TaskHeaderMain({
  onCreateTask,
  onToggleInstructions,
}: TaskHeaderMainProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
      <div className="text-center lg:text-left">
        <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Gestión de Tareas
        </h2>
        <p className="text-gray-400 text-sm lg:text-base mt-1">
          Organiza tus tareas de manera visual y eficiente
          <button
            onClick={onToggleInstructions}
            className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-blue-600/20 hover:bg-blue-600/40 rounded-full transition-all duration-300 group"
          >
            <span className="text-blue-400 text-xs animate-pulse group-hover:animate-bounce">
              ℹ️
            </span>
          </button>
        </p>
      </div>

      <button
        onClick={onCreateTask}
        className="group flex items-center justify-center lg:justify-start space-x-2 px-4 py-2 lg:px-6 lg:py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm lg:text-base font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 w-full lg:w-auto"
      >
        <span className="transition-transform group-hover:rotate-90 text-lg">+</span>
        <span className="hidden sm:inline">Nueva tarea</span>
        <span className="sm:hidden">Crear</span>
      </button>
    </div>
  );
}

