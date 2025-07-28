"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import ErrorModal from "@/components/ui/ErrorModal";
import SuccessModal from "@/components/ui/SuccessModal";

interface ModalContextType {
  showError: (message: string, title?: string) => void;
  showSuccess: (message: string, title?: string) => void;
  closeError: () => void;
  closeSuccess: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "", title: "" });
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: "", title: "" });

  const showError = useCallback((message: string, title: string = "Error de Autenticación") => {
    console.log("ModalProvider.showError llamado con:", { message, title });
    setErrorModal({ isOpen: true, message, title });
  }, []);

  const showSuccess = useCallback((message: string, title: string = "¡Éxito!") => {
    setSuccessModal({ isOpen: true, message, title });
  }, []);

  const closeError = useCallback(() => {
    setErrorModal({ isOpen: false, message: "", title: "" });
  }, []);

  const closeSuccess = useCallback(() => {
    setSuccessModal({ isOpen: false, message: "", title: "" });
  }, []);

  return (
    <ModalContext.Provider value={{ showError, showSuccess, closeError, closeSuccess }}>
      {children}

      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        onClose={closeError}
        type="error"
      />

      <SuccessModal
        isOpen={successModal.isOpen}
        title={successModal.title}
        message={successModal.message}
        onClose={closeSuccess}
        autoCloseDelay={4000}
      />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

