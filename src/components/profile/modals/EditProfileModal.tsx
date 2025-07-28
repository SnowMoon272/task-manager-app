"use client";

import ModalBase from "./ModalBase";
import TextInput from "./TextInput";
import StatusMessage from "./StatusMessage";
import ModalActions from "./ModalActions";
import { useProfileValidation } from "./useProfileValidation";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSave: (newName: string) => Promise<void>;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  currentName,
  onSave,
}: EditProfileModalProps) {
  const { name, setName, error, isLoading, clearMessages, resetForm, handleSubmit } =
    useProfileValidation({ currentName, onSave, onClose });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <ModalBase isOpen={isOpen} onClose={handleClose} title="Editar Perfil">
      <form onSubmit={handleSubmit}>
        <TextInput
          id="name"
          label="Nombre"
          placeholder="Ingresa tu nombre"
          value={name}
          onChange={(value) => {
            setName(value);
            clearMessages();
          }}
          disabled={isLoading}
          required
          minLength={2}
        />

        <StatusMessage error={error} />

        <ModalActions
          onCancel={handleClose}
          onSubmit={() => {}} // El submit se maneja en el form onSubmit
          isLoading={isLoading}
          submitText="Guardar"
          loadingText="Guardando..."
        />
      </form>
    </ModalBase>
  );
}

