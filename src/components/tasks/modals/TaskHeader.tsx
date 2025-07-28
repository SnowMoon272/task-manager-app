import { Task } from "@/types";

interface TaskHeaderProps {
  task: Task;
  isEditing: boolean;
  editedTitle: string;
  editedStatus: "todo" | "in-progress" | "done";
  editedPriority: "low" | "medium" | "high";
  onTitleChange: (value: string) => void;
  onStatusChange: (value: "todo" | "in-progress" | "done") => void;
  onPriorityChange: (value: "low" | "medium" | "high") => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const priorityColors = {
  low: "border-green-500/50 bg-green-500/10 text-green-400",
  medium: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
  high: "border-red-500/50 bg-red-500/10 text-red-400",
};

const priorityIcons = {
  low: "🟢",
  medium: "🟡",
  high: "🔴",
};

const statusLabels = {
  todo: "Pendiente",
  "in-progress": "En Progreso",
  done: "Completada",
};

const statusColors = {
  todo: "bg-purple-500/20 text-purple-400",
  "in-progress": "bg-cyan-500/20 text-cyan-400",
  done: "bg-pink-500/20 text-pink-400",
};

export default function TaskHeader({
  task,
  isEditing,
  editedTitle,
  editedStatus,
  editedPriority,
  onTitleChange,
  onStatusChange,
  onPriorityChange,
  onKeyPress,
}: TaskHeaderProps) {
  if (isEditing) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            onKeyDown={onKeyPress}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
            <select
              value={editedStatus}
              onChange={(e) => onStatusChange(e.target.value as "todo" | "in-progress" | "done")}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="todo">📝 Pendiente</option>
              <option value="in-progress">⏳ En progreso</option>
              <option value="done">✅ Completada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Prioridad</label>
            <select
              value={editedPriority}
              onChange={(e) => onPriorityChange(e.target.value as "low" | "medium" | "high")}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="low">🟢 Baja</option>
              <option value="medium">🟡 Media</option>
              <option value="high">🔴 Alta</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-white">{task.title}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status]}`}>
          {statusLabels[task.status]}
        </span>
        <span
          className={`px-2 py-1 rounded border text-xs font-medium flex items-center ${
            priorityColors[task.priority]
          }`}
        >
          {priorityIcons[task.priority]}{" "}
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>
    </div>
  );
}

