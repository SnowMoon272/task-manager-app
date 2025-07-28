interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  itemName?: string;
  icon?: string;
  warningMessage?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  onCancel?: () => void; // Hacer opcional para modales de alerta
  showCancelButton?: boolean; // Control explícito para mostrar el botón cancelar
  alertMode?: boolean; // Modo alerta (solo un botón)
  customContent?: React.ReactNode; // Contenido personalizado adicional
}

export default function ConfirmationModal({
  isOpen,
  title,
  description,
  itemName,
  icon = "🗑️",
  warningMessage,
  confirmButtonText = "Eliminar",
  cancelButtonText = "Cancelar",
  onConfirm,
  onCancel,
  showCancelButton = true,
  alertMode = false,
  customContent,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  // En modo alerta, solo mostrar el botón de confirmación
  const shouldShowCancelButton = !alertMode && showCancelButton && onCancel;
  const buttonText = alertMode
    ? confirmButtonText === "Eliminar"
      ? "Entendido"
      : confirmButtonText
    : confirmButtonText;

  return (
    <div className="fixed inset-0 z-80 overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-all duration-300" />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-md mx-auto bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-2xl border border-red-500/50"
          style={{
            animation: "borderPulse 2s ease-in-out infinite",
          }}
        >
          <style jsx>{`
            @keyframes borderPulse {
              0%,
              100% {
                border-color: rgba(239, 68, 68, 0.5);
              }
              50% {
                border-color: rgba(239, 68, 68, 0.8);
              }
            }
          `}</style>
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-red-400 text-xl">{icon}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="text-red-400 text-sm">Esta acción no se puede deshacer</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 leading-relaxed">
                {description}
                {itemName && (
                  <span className="text-purple-400 font-medium">&quot;{itemName}&quot;</span>
                )}
                {!alertMode && "?"}
              </p>

              {warningMessage && (
                <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                  <p className="text-sm text-gray-400 mb-1">⚠️ Advertencia:</p>
                  <p className="text-sm text-yellow-400">{warningMessage}</p>
                </div>
              )}

              {customContent && <div className="mt-4">{customContent}</div>}
            </div>

            <div className="flex items-center justify-end space-x-3">
              {shouldShowCancelButton && (
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700/50 border border-gray-600/50 hover:border-gray-500/50 rounded-lg transition-all duration-200"
                >
                  {cancelButtonText}
                </button>
              )}
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium"
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

