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
      <p className="text-gray-500 text-sm md:text-base italic text-center py-4 px-2">
        No hay comentarios aún. Haz clic en &quot;Agregar&quot; para escribir el primero.
      </p>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4 mb-4">
      {comments.map((comment, index) => (
        <div
          key={comment._id || `comment-${index}`}
          className="bg-gray-700/30 rounded-lg p-3 md:p-4 border border-gray-600/30 hover:border-gray-600/50 transition-colors"
        >
          {/* Header del comentario - Responsivo */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-3">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs sm:text-sm font-medium">
                  {typeof comment.author === "object"
                    ? comment.author.name?.charAt(0)?.toUpperCase() || "U"
                    : comment.author?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 min-w-0">
                <span className="text-gray-300 text-sm sm:text-base font-medium truncate">
                  {typeof comment.author === "object"
                    ? comment.author.name || comment.author.email
                    : comment.author}
                </span>
                <span className="text-gray-500 text-xs sm:text-sm">
                  {formatDate(comment.createdAt)}
                  {comment.updatedAt !== comment.createdAt && (
                    <span className="hidden sm:inline"> (editado)</span>
                  )}
                </span>
              </div>
            </div>

            {/* Botones de acción - Responsivos */}
            <div className="flex items-center space-x-1 sm:space-x-2 self-end sm:self-start">
              <button
                onClick={() => comment._id && onEditComment(comment._id)}
                disabled={!comment._id}
                className="text-blue-400 hover:text-blue-300 p-1.5 sm:p-2 rounded hover:bg-blue-500/10 transition-all disabled:opacity-50"
                title="Editar comentario"
              >
                <span className="text-sm sm:text-base">✏️</span>
              </button>
              <button
                onClick={() => comment._id && onDeleteComment(comment._id)}
                disabled={!comment._id}
                className="text-red-400 hover:text-red-300 p-1.5 sm:p-2 rounded hover:bg-red-500/10 transition-all disabled:opacity-50"
                title="Eliminar comentario"
              >
                <span className="text-sm sm:text-base">🗑️</span>
              </button>
            </div>
          </div>

          {/* Contenido del comentario - Responsivo */}
          {editingCommentId === comment._id ? (
            <div className="space-y-3">
              <textarea
                value={editedCommentText}
                onChange={(e) => onEditCommentTextChange(e.target.value)}
                onKeyPress={onEditCommentKeyPress}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none text-sm sm:text-base min-h-[80px] sm:min-h-[100px]"
                placeholder="Escribe tu comentario..."
                rows={3}
              />
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
                <button
                  onClick={onCancelCommentEdit}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base text-gray-400 hover:text-white bg-gray-600 hover:bg-gray-500 rounded-md transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={onSaveCommentEdit}
                  disabled={!editedCommentText.trim()}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Guardar
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-200 whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed">
              {comment.text}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

