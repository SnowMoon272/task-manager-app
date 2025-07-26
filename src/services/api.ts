// API configuration and utilities
import { CreateTaskData, UpdateTaskData, LoginCredentials, RegisterData } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// Base request function
const request = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {},
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

    if (!response.ok) {
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

