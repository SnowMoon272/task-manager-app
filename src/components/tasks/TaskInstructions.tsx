"use client";

interface TaskInstructionsProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function TaskInstructions({ isVisible, onClose }: TaskInstructionsProps) {
  if (!isVisible) return null;

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 lg:p-6 transition-all duration-300 ease-out mb-4">
      {/* Botón de cerrar */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">📚 Guía de uso</h3>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-8 h-8 bg-red-600/20 hover:bg-red-600/40 rounded-full transition-all duration-200 group"
        >
          <span className="text-red-400 text-sm group-hover:rotate-90 transition-transform duration-200">
            ✕
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {/* Instrucciones para móvil */}
        <div className="md:hidden">
          <div className="flex items-start space-x-3 mb-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">👆</span>
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">Interacción con tareas</h4>
              <p className="text-gray-400 text-xs mt-1">
                <span className="font-medium text-purple-300">Toca</span> una tarea para ver
                detalles
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🚚</span>
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">Mover tareas</h4>
              <p className="text-gray-400 text-xs mt-1">
                <span className="font-medium text-cyan-300">Mantén presionado y arrastra</span> para
                cambiar de columna
              </p>
            </div>
          </div>
        </div>

        {/* Instrucciones para desktop */}
        <div className="hidden md:block">
          <div className="flex items-start space-x-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white">👆</span>
            </div>
            <div>
              <h4 className="text-white font-medium">Seleccionar tareas</h4>
              <p className="text-gray-400 text-sm mt-1">
                <span className="font-medium text-purple-300">Haz clic</span> en cualquier tarea
                para ver sus detalles completos, subtareas y opciones de edición
              </p>
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white">🖱️</span>
            </div>
            <div>
              <h4 className="text-white font-medium">Arrastrar tareas</h4>
              <p className="text-gray-400 text-sm mt-1">
                <span className="font-medium text-cyan-300">Arrastra y suelta</span> las tareas
                entre columnas para cambiar su estado de manera visual
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de estado del tablero */}
      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <div className="flex items-center justify-center lg:justify-start space-x-2 text-xs lg:text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Tablero interactivo activo</span>
        </div>
      </div>
    </div>
  );
}

