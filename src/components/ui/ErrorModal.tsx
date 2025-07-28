import React from "react";

interface ErrorModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  type?: "error" | "warning" | "info";
}

export default function ErrorModal({
  isOpen,
  title = "Error",
  message,
  onClose,
  type = "error",
}: ErrorModalProps) {
  console.log("ErrorModal renderizado con:", { isOpen, message, type });

  if (!isOpen) return null;

  const getTypeConfig = () => {
    switch (type) {
      case "error":
        return {
          icon: "❌",
          iconBg: "bg-red-500/20",
          iconColor: "text-red-400",
          borderColor: "border-red-500/50",
          buttonColor: "bg-red-600 hover:bg-red-700",
          title: title || "Error de Autenticación",
        };
      case "warning":
        return {
          icon: "⚠️",
          iconBg: "bg-yellow-500/20",
          iconColor: "text-yellow-400",
          borderColor: "border-yellow-500/50",
          buttonColor: "bg-yellow-600 hover:bg-yellow-700",
          title: title || "Advertencia",
        };
      case "info":
        return {
          icon: "ℹ️",
          iconBg: "bg-blue-500/20",
          iconColor: "text-blue-400",
          borderColor: "border-blue-500/50",
          buttonColor: "bg-blue-600 hover:bg-blue-700",
          title: title || "Información",
        };
      default:
        return {
          icon: "❌",
          iconBg: "bg-red-500/20",
          iconColor: "text-red-400",
          borderColor: "border-red-500/50",
          buttonColor: "bg-red-600 hover:bg-red-700",
          title: title || "Error",
        };
    }
  };

  const config = getTypeConfig();

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
          className={`relative w-full max-w-md mx-auto bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-2xl border ${config.borderColor}`}
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
                border-color: ${type === "error"
                  ? "rgba(239, 68, 68, 0.5)"
                  : type === "warning"
                  ? "rgba(245, 158, 11, 0.5)"
                  : "rgba(59, 130, 246, 0.5)"};
              }
              50% {
                border-color: ${type === "error"
                  ? "rgba(239, 68, 68, 0.8)"
                  : type === "warning"
                  ? "rgba(245, 158, 11, 0.8)"
                  : "rgba(59, 130, 246, 0.8)"};
              }
            }
          `}</style>

          <div className="p-6">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div
                className={`w-12 h-12 ${config.iconBg} rounded-full flex items-center justify-center`}
              >
                <span className={`${config.iconColor} text-2xl`}>{config.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{config.title}</h3>
                <p className={`${config.iconColor} text-sm`}>
                  {type === "error"
                    ? "Verifica los datos ingresados"
                    : type === "warning"
                    ? "Revisa la información"
                    : "Información importante"}
                </p>
              </div>
            </div>

            {/* Message */}
            <div className="mb-6">
              <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600/50">
                <p className="text-gray-300 leading-relaxed text-center">{message}</p>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className={`px-6 py-2 ${config.buttonColor} text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800`}
                autoFocus
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

