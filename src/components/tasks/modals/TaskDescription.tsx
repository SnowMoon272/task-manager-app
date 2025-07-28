import { Task } from "@/types";

interface TaskDescriptionProps {
  task: Task;
  isEditing: boolean;
  editedDescription: string;
  onDescriptionChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export default function TaskDescription({
  task,
  isEditing,
  editedDescription,
  onDescriptionChange,
  onKeyPress,
}: TaskDescriptionProps) {
  if (isEditing) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
        <textarea
          value={editedDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          onKeyDown={onKeyPress}
          rows={4}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          placeholder="Descripción de la tarea..."
        />
      </div>
    );
  }

  if (!task.description) {
    return <div className="text-gray-400 italic">Sin descripción</div>;
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-300 mb-2">Descripción</h3>
      <p className="text-gray-300 whitespace-pre-wrap">{task.description}</p>
    </div>
  );
}

