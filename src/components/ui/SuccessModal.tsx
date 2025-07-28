import React from "react";

interface SuccessModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  autoCloseDelay?: number; // Auto close after X milliseconds
}

export default function SuccessModal({
  isOpen,
  title = "¡Éxito!",
  message,
  onClose,
  autoCloseDelay = 2000,
}: SuccessModalProps) {
  // Auto close effect
  React.useEffect(() => {
    if (isOpen && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-md mx-auto bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-2xl border border-green-500/50"
          style={{
            animation: "slideIn 0.3s ease-out, borderPulse 2s ease-in-out infinite",
          }}
        >
          <style jsx>{`
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }

            @keyframes borderPulse {
              0%,
              100% {
                border-color: rgba(34, 197, 94, 0.5);
              }
              50% {
                border-color: rgba(34, 197, 94, 0.8);
              }
            }

            @keyframes checkmark {
              0% {
                transform: scale(0) rotate(45deg);
              }
              50% {
                transform: scale(1.2) rotate(45deg);
              }
              100% {
                transform: scale(1) rotate(45deg);
              }
            }

            @keyframes shrink {
              from {
                width: 100%;
              }
              to {
                width: 0%;
              }
            }

            .checkmark {
              animation: checkmark 0.6s ease-in-out 0.2s both;
            }
          `}</style>

          <div className="p-6">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <div className="checkmark w-6 h-6 border-r-2 border-b-2 border-green-400 transform rotate-45 origin-bottom-left"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="text-green-400 text-sm">Operación completada exitosamente</p>
              </div>
            </div>

            {/* Message */}
            <div className="mb-6">
              <div className="p-4 bg-green-900/20 rounded-lg border border-green-500/30">
                <p className="text-gray-300 leading-relaxed text-center">{message}</p>
              </div>
            </div>

            {/* Progress bar for auto-close */}
            {autoCloseDelay > 0 && (
              <div className="mb-4">
                <div className="w-full bg-gray-700/50 rounded-full h-1">
                  <div
                    className="bg-green-500 h-1 rounded-full transition-all ease-linear"
                    style={{
                      animation: `shrink ${autoCloseDelay}ms linear`,
                      width: "100%",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

