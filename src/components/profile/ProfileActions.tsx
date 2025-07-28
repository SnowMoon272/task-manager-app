"use client";

import { useState } from "react";
import SpaceButton from "@/components/ui/SpaceButton";
import { EditProfileModal, ChangePasswordModal } from "./modals";
import { useAuthStore } from "@/store/auth";

interface ProfileActionsProps {
  onLogout: () => void;
}

export default function ProfileActions({ onLogout }: ProfileActionsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const { user, updateProfile, changePassword } = useAuthStore();

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handleSaveProfile = async (newName: string) => {
    await updateProfile(newName);
  };

  const handleSavePassword = async (currentPassword: string, newPassword: string) => {
    await changePassword(currentPassword, newPassword);
  };

  return (
    <>
      <div className="mt-8 pt-6 border-t border-purple-500/20">
        <h4 className="font-medium text-white mb-4">Acciones</h4>
        <div className="flex flex-wrap gap-4">
          <SpaceButton onClick={handleEditProfile} variant="purpleToBlue">
            Editar Perfil
          </SpaceButton>
          <SpaceButton onClick={handleChangePassword} variant="secondary">
            Cambiar Contraseña
          </SpaceButton>
          <SpaceButton onClick={onLogout} variant="danger">
            Cerrar Sesión
          </SpaceButton>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentName={user?.name || ""}
        onSave={handleSaveProfile}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSave={handleSavePassword}
      />
    </>
  );
}

