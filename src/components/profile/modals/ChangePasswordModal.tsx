"use client";

import ModalBase from "./ModalBase";
import PasswordInput from "./PasswordInput";
import StatusMessage from "./StatusMessage";
import ModalActions from "./ModalActions";
import { usePasswordValidation } from "./usePasswordValidation";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (currentPassword: string, newPassword: string) => Promise<void>;
}

export default function ChangePasswordModal({ isOpen, onClose, onSave }: ChangePasswordModalProps) {
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    success,
    isLoading,
    clearMessages,
    resetForm,
    handleSubmit,
  } = usePasswordValidation({ onSave, onClose });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <ModalBase isOpen={isOpen} onClose={handleClose} title="Cambiar Contraseña">
      <form onSubmit={handleSubmit}>
        <PasswordInput
          id="currentPassword"
          label="Contraseña Actual"
          placeholder="Ingresa tu contraseña actual"
          value={currentPassword}
          onChange={(value) => {
            setCurrentPassword(value);
            clearMessages();
          }}
          disabled={isLoading}
          required
        />

        <PasswordInput
          id="newPassword"
          label="Nueva Contraseña"
          placeholder="Ingresa tu nueva contraseña"
          value={newPassword}
          onChange={(value) => {
            setNewPassword(value);
            clearMessages();
          }}
          disabled={isLoading}
          required
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirmar Nueva Contraseña"
          placeholder="Confirma tu nueva contraseña"
          value={confirmPassword}
          onChange={(value) => {
            setConfirmPassword(value);
            clearMessages();
          }}
          disabled={isLoading}
          required
        />

        <StatusMessage error={error} success={success} />

        <ModalActions
          onCancel={handleClose}
          onSubmit={() => {}} // El submit se maneja en el form onSubmit
          isLoading={isLoading}
          submitText="Cambiar Contraseña"
          loadingText="Cambiando..."
        />
      </form>
    </ModalBase>
  );
}

