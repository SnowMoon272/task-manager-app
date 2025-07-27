import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types";
import {
  login as apiLogin,
  register as apiRegister,
  getCurrentUser,
  clearAuthTokens,
} from "@/services/api";

interface AuthState {
  // Estado
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Acciones
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  initialize: () => void;
  updateProfile: (name: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      // Acciones
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setToken: (token) => set({ token }),

      setLoading: (isLoading) => set({ isLoading }),

      login: async (email, password) => {
        try {
          set({ isLoading: true });

          const response = await apiLogin({ email, password });

          if (response.success && response.data) {
            const authData = response.data as { token: string; user: User };
            const normalizedUser = {
              ...authData.user,
              _id: authData.user._id || authData.user.id || "",
            };

            set({
              user: normalizedUser,
              token: authData.token,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error(response.message || "Error al iniciar sesión");
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (name, email, password) => {
        try {
          set({ isLoading: true });

          const response = await apiRegister({ name, email, password });

          if (response.success && response.data) {
            const authData = response.data as { token: string; user: User };
            const normalizedUser = {
              ...authData.user,
              _id: authData.user._id || authData.user.id || "",
            };

            set({
              user: normalizedUser,
              token: authData.token,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error(response.message || "Error al crear cuenta");
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });

        // Limpiar todos los tokens usando la función de API
        clearAuthTokens();
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) {
          set({ isAuthenticated: false });
          return;
        }

        try {
          set({ isLoading: true });
          const response = await getCurrentUser();

          if (response.success && response.data) {
            const userData = response.data as { user: User };
            const normalizedUser = {
              ...userData.user,
              _id: userData.user._id || userData.user.id || "",
            };

            set({
              user: normalizedUser,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Token inválido
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
            clearAuthTokens();
          }
        } catch (error) {
          console.error("Error checking auth:", error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          clearAuthTokens();
        }
      },

      initialize: () => {
        // Hidratar manualmente el store desde localStorage
        if (typeof window !== "undefined") {
          try {
            const stored = localStorage.getItem("auth-storage");
            if (stored) {
              const { state } = JSON.parse(stored);
              if (state.token && state.user) {
                set({
                  token: state.token,
                  user: state.user,
                  isAuthenticated: true,
                });
                // Verificar si el token sigue siendo válido
                get().checkAuth();
              }
            }
          } catch (error) {
            console.error("Error initializing auth store:", error);
          }
        }
      },

      updateProfile: async (name: string) => {
        try {
          const { token } = get();
          if (!token) {
            throw new Error("No hay sesión activa");
          }

          const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";
          const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name }),
          });

          let data;
          try {
            data = await response.json();
          } catch (parseError) {
            console.error("Error parsing response:", parseError);
            throw new Error("Error de comunicación con el servidor");
          }

          console.log("Response status:", response.status);
          console.log("Response data:", data);

          if (!response.ok) {
            throw new Error(data.message || `Error del servidor: ${response.status}`);
          }

          if (data.success && data.data?.user) {
            const updatedUser = { ...get().user, ...data.data.user };
            set({ user: updatedUser });
          }
        } catch (error) {
          console.error("Update profile error:", error);
          throw error;
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        try {
          const { token } = get();
          if (!token) {
            throw new Error("No hay sesión activa");
          }

          const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";
          const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ currentPassword, newPassword }),
          });

          let data;
          try {
            data = await response.json();
          } catch (parseError) {
            console.error("Error parsing response:", parseError);
            throw new Error("Error de comunicación con el servidor");
          }

          console.log("Change password response status:", response.status);
          console.log("Change password response data:", data);

          if (!response.ok) {
            throw new Error(data.message || `Error del servidor: ${response.status}`);
          }

          // Si el cambio fue exitoso, no necesitamos actualizar el estado del usuario
          // solo mostrar un mensaje de éxito
        } catch (error) {
          console.error("Change password error:", error);
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      skipHydration: true, // Evita hidratación automática para prevenir errores SSR
    },
  ),
);

