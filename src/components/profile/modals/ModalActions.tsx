import SpaceButton from "@/components/ui/SpaceButton";

interface ModalActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  submitText: string;
  loadingText: string;
  cancelText?: string;
}

export default function ModalActions({
  onCancel,
  onSubmit,
  isLoading,
  submitText,
  loadingText,
  cancelText = "Cancelar",
}: ModalActionsProps) {
  return (
    <div className="flex justify-end space-x-3">
      <SpaceButton
        onClick={onCancel}
        variant="secondary"
        className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
      >
        {cancelText}
      </SpaceButton>
      <button
        type="submit"
        onClick={onSubmit}
        disabled={isLoading}
        className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? loadingText : submitText}
      </button>
    </div>
  );
}

