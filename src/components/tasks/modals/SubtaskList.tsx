import { Subtask } from "@/types";

interface SubtaskListProps {
  subtasks: Subtask[];
  onToggleSubtask: (index: number) => void;
  onDeleteSubtask: (index: number, title: string) => void;
}

export default function SubtaskList({
  subtasks,
  onToggleSubtask,
  onDeleteSubtask,
}: SubtaskListProps) {
  if (!subtasks || subtasks.length === 0) {
    return <div className="text-gray-400 text-center py-4 italic">No hay subtareas</div>;
  }

  return (
    <div className="space-y-2">
      {subtasks.map((subtask, index) => (
        <div
          key={subtask._id || index}
          className="group flex items-center justify-between py-1.5 px-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-md border border-gray-600/50 hover:border-gray-500/50 transition-all duration-200 cursor-pointer"
          onClick={() => onToggleSubtask(index)}
        >
          <div className="flex items-center flex-1 pointer-events-none">
            {/* Icono de estado */}
            <div className="mr-3 flex items-center justify-center w-5 h-5">
              {subtask.completed ? (
                <span className="text-green-400 text-sm">✅</span>
              ) : (
                <span className="text-yellow-400 text-sm">⭕</span>
              )}
            </div>

            <span
              className={`flex-1 transition-all duration-200 ${
                subtask.completed ? "line-through text-gray-400" : "text-white"
              }`}
            >
              {subtask.title}
            </span>
          </div>

          {/* Botón eliminar - visible en mobile, hover en desktop */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevenir que se active el toggle
              onDeleteSubtask(index, subtask.title);
            }}
            className="ml-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 rounded transition-all duration-200 pointer-events-auto"
            title="Eliminar subtarea"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
}

