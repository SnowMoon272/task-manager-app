interface CommentFormProps {
  newCommentText: string;
  onTextChange: (text: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export default function CommentForm({
  newCommentText,
  onTextChange,
  onSubmit,
  onCancel,
  onKeyPress,
}: CommentFormProps) {
  return (
    <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/50 mb-4">
      <h4 className="text-sm font-medium text-gray-300 mb-3">Nuevo Comentario</h4>
      <div className="space-y-3">
        <textarea
          value={newCommentText}
          onChange={(e) => onTextChange(e.target.value)}
          onKeyDown={onKeyPress}
          placeholder="Escribe tu comentario..."
          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 resize-none"
          rows={3}
          autoFocus
        />
        <div className="flex items-center space-x-2">
          <button
            onClick={onSubmit}
            disabled={!newCommentText.trim()}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white text-sm rounded transition-colors"
          >
            Comentar
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 text-sm rounded transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

