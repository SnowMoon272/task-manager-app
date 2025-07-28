interface TaskInfoProps {
  task: {
    createdAt: string;
    dueDate?: string;
    assignee?: string | { name?: string; email?: string };
    tags?: string[];
  };
  formatDate: (dateString: string) => string;
}

export default function TaskInfo({ task, formatDate }: TaskInfoProps) {
  return (
    <div className="space-y-6">
      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Etiquetas</h3>
          <div className="flex flex-wrap gap-2">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block px-3 py-1 text-sm bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-1">Fecha de creación</h3>
          <p className="text-gray-400 text-sm">{formatDate(task.createdAt)}</p>
        </div>

        {task.dueDate && (
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-1">Fecha límite</h3>
            <p
              className={`text-sm ${
                new Date(task.dueDate) < new Date() ? "text-red-400" : "text-blue-400"
              }`}
            >
              {formatDate(task.dueDate)}
              {new Date(task.dueDate) < new Date() && " (Vencida)"}
            </p>
          </div>
        )}
      </div>

      {/* Asignado a */}
      {task.assignee && (
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-1">Asignado a</h3>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {typeof task.assignee === "object"
                  ? task.assignee.name?.charAt(0)?.toUpperCase() || "U"
                  : "U"}
              </span>
            </div>
            <span className="text-gray-300">
              {typeof task.assignee === "object"
                ? task.assignee.name || task.assignee.email
                : task.assignee}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

