import { Comment } from "@/types";

interface CommentListProps {
  comments: Comment[];
  editingCommentId: string | null;
  editedCommentText: string;
  onEditComment: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onSaveCommentEdit: () => void;
  onCancelCommentEdit: () => void;
  onEditCommentTextChange: (text: string) => void;
  onEditCommentKeyPress: (e: React.KeyboardEvent) => void;
  formatDate: (dateString: string) => string;
}

export default function CommentList({
  comments,
  editingCommentId,
  editedCommentText,
  onEditComment,
  onDeleteComment,
  onSaveCommentEdit,
  onCancelCommentEdit,
  onEditCommentTextChange,
  onEditCommentKeyPress,
  formatDate,
}: CommentListProps) {
  if (!comments || comments.length === 0) {
    return (
      <p className="text-gray-500 text-sm italic">
        No hay comentarios aún. Haz clic en &quot;Agregar&quot; para escribir el primero.
      </p>
    );
  }

  return (
    <div className="space-y-3 mb-4">
      {comments.map((comment, index) => (
        <div
          key={comment._id || `comment-${index}`}
          className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {typeof comment.author === "object"
                    ? comment.author.name?.charAt(0)?.toUpperCase() || "U"
                    : comment.author?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <span className="text-gray-300 text-sm font-medium">
                {typeof comment.author === "object"
                  ? comment.author.name || comment.author.email
                  : comment.author}
              </span>
              <span className="text-gray-500 text-xs">
                {formatDate(comment.createdAt)}
                {comment.updatedAt !== comment.createdAt && " (editado)"}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => comment._id && onEditComment(comment._id)}
                disabled={!comment._id}
                className="text-blue-400 hover:text-blue-300 p-1 rounded transition-colors disabled:opacity-50"
                title="Editar comentario"
              >
                ✏️
              </button>
              <button
                onClick={() => comment._id && onDeleteComment(comment._id)}
                disabled={!comment._id}
                className="text-red-400 hover:text-red-300 p-1 rounded transition-colors disabled:opacity-50"
                title="Eliminar comentario"
              >
                🗑️
              </button>
            </div>
          </div>

          {editingCommentId === comment._id ? (
            <div className="space-y-2">
              <textarea
                value={editedCommentText}
                onChange={(e) => onEditCommentTextChange(e.target.value)}
                onKeyDown={onEditCommentKeyPress}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 resize-none"
                rows={2}
                placeholder="Editar comentario..."
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={onSaveCommentEdit}
                  disabled={!editedCommentText.trim()}
                  className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded transition-colors"
                >
                  Guardar
                </button>
                <button
                  onClick={onCancelCommentEdit}
                  className="px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700/50 rounded transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {comment.text}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

