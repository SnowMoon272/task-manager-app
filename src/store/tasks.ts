import { create } from "zustand";
import { Task, CreateTaskData, UpdateTaskData } from "@/types";
import {
  getTasks as apiGetTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
} from "@/services/api";

interface TasksState {
  // Estado
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  // Acciones
  setTasks: (tasks: Task[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearTasks: () => void; // Nueva función para limpiar tareas
  fetchTasks: () => Promise<void>;
  createTask: (taskData: CreateTaskData) => Promise<void>;
  updateTask: (taskId: string, taskData: UpdateTaskData) => Promise<void>;
  moveTask: (taskId: string, newStatus: "todo" | "in-progress" | "done") => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  // Estado inicial
  tasks: [],
  isLoading: false,
  error: null,

  // Acciones
  setTasks: (tasks) => set({ tasks }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearTasks: () => set({ tasks: [], error: null }), // Limpiar todas las tareas

  fetchTasks: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiGetTasks();

      console.log("fetchTasks response:", response);

      if (response.success && response.data) {
        const tasksData = response.data as { tasks: Task[] };
        // Un array vacío es válido, no es un error
        const tasks = Array.isArray(tasksData.tasks) ? tasksData.tasks : [];
        console.log(`Tareas cargadas: ${tasks.length} tareas encontradas`);
        set({ tasks });
      } else {
        console.error("Respuesta inválida del servidor:", response);
        throw new Error(response.message || "Error al obtener las tareas");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      const errorMessage = error instanceof Error ? error.message : "Error al obtener las tareas";
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  createTask: async (taskData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiCreateTask(taskData);
      if (response.success && response.data) {
        const taskData = response.data as { task: Task };
        const currentTasks = get().tasks;
        set({ tasks: [...currentTasks, taskData.task] });
      } else {
        throw new Error("Error al crear la tarea");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      set({ error: "Error al crear la tarea" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTask: async (taskId, taskData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiUpdateTask(taskId, taskData);
      if (response.success && response.data) {
        const taskData = response.data as { task: Task };
        const currentTasks = get().tasks;
        const updatedTasks = currentTasks.map((task) =>
          task._id === taskId ? taskData.task : task,
        );
        set({ tasks: updatedTasks });
      } else {
        throw new Error("Error al actualizar la tarea");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      set({ error: "Error al actualizar la tarea" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  moveTask: async (taskId, newStatus) => {
    try {
      // Actualización optimista
      const currentTasks = get().tasks;
      const updatedTasks = currentTasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task,
      );
      set({ tasks: updatedTasks });

      // Llamada a la API
      const response = await apiUpdateTask(taskId, { status: newStatus });
      if (!response.success) {
        // Revertir si falla
        set({ tasks: currentTasks });
        throw new Error("Error al mover la tarea");
      }
    } catch (error) {
      console.error("Error moving task:", error);
      set({ error: "Error al mover la tarea" });
      // Refrescar las tareas desde el servidor
      get().fetchTasks();
    }
  },

  deleteTask: async (taskId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiDeleteTask(taskId);
      if (response.success) {
        const currentTasks = get().tasks;
        const filteredTasks = currentTasks.filter((task) => task._id !== taskId);
        set({ tasks: filteredTasks });
      } else {
        throw new Error("Error al eliminar la tarea");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      set({ error: "Error al eliminar la tarea" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

