"use client";

import { useState, useEffect, createContext, useContext } from "react";
import apiService from "@/services/api";
import { User, LoginCredentials, RegisterData } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for stored token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCurrentUser();
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getCurrentUser();
      if (response.success && response.data) {
        const userData = response.data as { user: User };
        setUser(userData.user);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // Mock authentication for demo - usar estas credenciales para probar
      if (email === "demo@taskmanager.com" && password === "demo123") {
        const mockUser: User = {
          _id: "1",
          email: "demo@taskmanager.com",
          name: "Usuario Demo",
          role: "user",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        localStorage.setItem("token", "demo-token");
        setUser(mockUser);
        return;
      }

      const credentials: LoginCredentials = { email, password };
      const response = await apiService.login(credentials);

      if (response.success && response.data) {
        const authData = response.data as { token: string; user: User };
        // Asegurar que el usuario tenga _id (normalizar la respuesta del backend)
        const normalizedUser = {
          ...authData.user,
          _id: authData.user._id || authData.user.id || "",
        };
        localStorage.setItem("token", authData.token);
        setUser(normalizedUser);
      } else {
        throw new Error(response.message || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const userData: RegisterData = { name, email, password };
      const response = await apiService.register(userData);

      if (response.success && response.data) {
        const authData = response.data as { token: string; user: User };
        // Asegurar que el usuario tenga _id (normalizar la respuesta del backend)
        const normalizedUser = {
          ...authData.user,
          _id: authData.user._id || authData.user.id || "",
        };
        localStorage.setItem("token", authData.token);
        setUser(normalizedUser);
      } else {
        throw new Error(response.message || "Error al crear cuenta");
      }
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

