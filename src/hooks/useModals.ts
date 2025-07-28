import { useState, useCallback, useRef } from "react";

interface UseModalReturn {
  isOpen: boolean;
  message: string;
  open: (message: string) => void;
  close: () => void;
}

export function useErrorModal(): UseModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const stateRef = useRef({ isOpen: false, message: "" });

  const open = useCallback(
    (message: string) => {
      console.log("useErrorModal.open llamado con ======>>>>:", message);

      // Actualizar tanto el estado como la referencia
      stateRef.current = { isOpen: true, message };
      setMessage(message);
      setIsOpen(true);

      console.log("Estado después de setear ======>>>>:", { isOpen: true, message });

      // Forzar actualización después de un breve delay si es necesario
      setTimeout(() => {
        if (!isOpen && stateRef.current.isOpen) {
          setIsOpen(true);
          setMessage(stateRef.current.message);
        }
      }, 50);
    },
    [isOpen],
  );

  const close = useCallback(() => {
    stateRef.current = { isOpen: false, message: "" };
    setIsOpen(false);
    setMessage("");
  }, []);

  return {
    isOpen,
    message,
    open,
    close,
  };
}

export function useSuccessModal(): UseModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const open = useCallback((message: string) => {
    setMessage(message);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setMessage("");
  }, []);

  return {
    isOpen,
    message,
    open,
    close,
  };
}

