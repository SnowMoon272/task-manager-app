interface SubtaskFormProps {
  newSubtaskTitle: string;
  isCreating: boolean;
  onTitleChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export default function SubtaskForm({
  newSubtaskTitle,
  isCreating,
  onTitleChange,
  onSubmit,
  onCancel,
  onKeyPress,
}: SubtaskFormProps) {
  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <input
          type="text"
          value={newSubtaskTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          onKeyDown={onKeyPress}
          placeholder="Título de la nueva subtarea"
          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          autoFocus
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          disabled={isCreating}
          className="px-3 py-1.5 text-sm text-gray-300 bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={onSubmit}
          disabled={!newSubtaskTitle.trim() || isCreating}
          className="px-3 py-1.5 text-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-md hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? "Creando..." : "Crear"}
        </button>
      </div>
    </div>
  );
}

