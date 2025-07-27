// API configuration and utilities
import { CreateTaskData, UpdateTaskData, LoginCredentials, RegisterData } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;

  // Obtener del store de auth en localStorage
  try {
    const stored = localStorage.getItem("auth-storage");
    if (stored) {
      const { state } = JSON.parse(stored);
      return state.token;
    }
  } catch (error) {
    console.error("Error getting token from localStorage:", error);
  }

  return null;
};

// Function to clear all auth tokens
const clearAuthTokens = () => {
  if (typeof window !== "undefined") {
    // Limpiar localStorage
    try {
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Error clearing token from localStorage:", error);
    }
  }
};

// Base request function with auto token refresh
const request = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false,
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}/api${endpoint}`;
  const token = getAuthToken();

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    // Si el token es inválido y no es un reintento, intentar renovar el token
    if (
      (response.status === 401 || response.status === 403) &&
      !isRetry &&
      endpoint !== "/auth/refresh" &&
      endpoint !== "/auth/login" &&
      token
    ) {
      try {
        console.log("Token expired/invalid, attempting refresh...");
        const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const newToken = refreshData.data?.token;

          if (newToken) {
            console.log("Token refreshed successfully, retrying request...");
            // Reintentar la petición original con el nuevo token
            return request<T>(endpoint, options, true);
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Limpiar tokens inválidos
        clearAuthTokens();
        // TEMPORALMENTE DESHABILITADO: Si falla la renovación, redirigir al login
        // if (typeof window !== "undefined") {
        //   window.location.href = "/login";
        // }
        return data;
      }
    }

    // Si la respuesta no es exitosa y llegamos aquí, significa que no se pudo renovar el token
    if (!response.ok) {
      // Si es un error de autenticación, limpiar tokens y redirigir
      if (response.status === 401 || response.status === 403) {
        clearAuthTokens();
        // TEMPORALMENTE DESHABILITADO: redireccionar
        // if (typeof window !== "undefined") {
        //   window.location.href = "/login";
        // }
      }
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Auth methods
export const register = async (userData: RegisterData) => {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const login = async (credentials: LoginCredentials) => {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const getCurrentUser = async () => {
  return request("/auth/me");
};

export const refreshToken = async () => {
  return request("/auth/refresh", {
    method: "POST",
  });
};

// Task methods
export const getTasks = async (filters?: {
  status?: string;
  priority?: string;
  assignee?: string;
}) => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  const query = params.toString() ? `?${params.toString()}` : "";
  return request(`/tasks${query}`);
};

export const getTask = async (id: string) => {
  return request(`/tasks/${id}`);
};

export const createTask = async (taskData: CreateTaskData) => {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify(taskData),
  });
};

export const updateTask = async (id: string, updates: UpdateTaskData) => {
  return request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
};

export const deleteTask = async (id: string) => {
  return request(`/tasks/${id}`, {
    method: "DELETE",
  });
};

// User methods
export const getUsers = async () => {
  return request("/users");
};

// Health check
export const healthCheck = async () => {
  return request("/health");
};

// Auth utility functions
export const logout = () => {
  clearAuthTokens();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

export { clearAuthTokens };

