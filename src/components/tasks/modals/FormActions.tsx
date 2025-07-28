interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  submitText: string;
  loadingText: string;
  cancelText?: string;
}

export default function FormActions({
  onCancel,
  isSubmitting,
  submitText,
  loadingText,
  cancelText = "Cancelar",
}: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-3 pt-4">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cancelText}
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-md hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? loadingText : submitText}
      </button>
    </div>
  );
}

