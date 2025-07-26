import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types";
import apiService from "@/services/api";

// Helper functions for cookies
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof window !== "undefined") {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }
};

const deleteCookie = (name: string) => {
  if (typeof window !== "undefined") {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
};

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

          // Mock para desarrollo
          if (email === "demo@taskmanager.com" && password === "demo123") {
            const mockUser: User = {
              _id: "demo",
              id: "demo",
              email: "demo@taskmanager.com",
              name: "Usuario Demo",
              role: "user",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            set({
              user: mockUser,
              token: "demo-token",
              isAuthenticated: true,
              isLoading: false,
            });

            // Guardar token en cookies
            setCookie("auth-token", "demo-token");
            return;
          }

          const response = await apiService.login({ email, password });

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

            // Guardar token en cookies
            setCookie("auth-token", authData.token);
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

          const response = await apiService.register({ name, email, password });

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

            // Guardar token en cookies
            setCookie("auth-token", authData.token);
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

        // Eliminar token de cookies
        deleteCookie("auth-token");
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) {
          set({ isAuthenticated: false });
          return;
        }

        try {
          set({ isLoading: true });
          const response = await apiService.getCurrentUser();

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
          }
        } catch (error) {
          console.error("Error checking auth:", error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
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

