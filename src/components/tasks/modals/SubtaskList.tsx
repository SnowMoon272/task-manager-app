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
          className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600"
        >
          <div className="flex items-center flex-1">
            <input
              type="checkbox"
              checked={subtask.completed}
              onChange={() => onToggleSubtask(index)}
              className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span
              className={`flex-1 ${
                subtask.completed ? "line-through text-gray-400" : "text-white"
              }`}
            >
              {subtask.title}
            </span>
          </div>
          <button
            onClick={() => onDeleteSubtask(index, subtask.title)}
            className="ml-2 text-red-400 hover:text-red-300 transition-colors"
            title="Eliminar subtarea"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
}

