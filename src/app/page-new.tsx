"use client";

import { useState } from "react";
import apiService from "@/services/api";
import { Task } from "@/types";

export default function Home() {
  const [apiStatus, setApiStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  const testApiConnection = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.healthCheck();
      if (response.success) {
        setApiStatus("✅ API conectada correctamente");
      } else {
        setApiStatus("❌ Error en la API");
      }
    } catch (error) {
      setApiStatus("❌ Error de conexión: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const testGetTasks = async () => {
    setIsLoadingTasks(true);
    try {
      // Simular token (en una app real vendría del contexto de auth)
      localStorage.setItem(
        "token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODg1MTA2MGJhNzBkY2M2MjZkYzdjYmUiLCJlbWFpbCI6InBydWViYUBlamVtcGxvLmNvbSIsImlhdCI6MTc1MzU1MjY3MCwiZXhwIjoxNzU0MTU3NDcwfQ.s73LvGgpPDZP7bJ0piWiK1iarerqclJKzLihRvU5keM",
      );

      const response = await apiService.getTasks();
      if (response.success && response.data) {
        const tasksData = response.data as { tasks: Task[] };
        setTasks(tasksData.tasks || []);
      }
    } catch (error) {
      console.error("Error obteniendo tareas:", error);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">Task Manager App</h1>
        <p className="text-center text-gray-600 mb-8">
          Bienvenido a tu aplicación de gestión de tareas
        </p>

        {/* Test API Connection */}
        <div className="mb-8 text-center">
          <div className="flex gap-4 justify-center">
            <button
              onClick={testApiConnection}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {isLoading ? "Probando..." : "Probar Conexión API"}
            </button>

            <button
              onClick={testGetTasks}
              disabled={isLoadingTasks}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {isLoadingTasks ? "Cargando..." : "Obtener Tareas"}
            </button>
          </div>

          {apiStatus && <p className="mt-2 text-sm">{apiStatus}</p>}

          {/* Tasks Display */}
          {tasks.length > 0 && (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-bold mb-4">Tareas encontradas:</h3>
              {tasks.map((task: Task) => (
                <div key={task._id} className="mb-2 p-3 bg-white rounded border">
                  <h4 className="font-semibold">{task.title}</h4>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        task.status === "todo"
                          ? "bg-yellow-200"
                          : task.status === "in-progress"
                          ? "bg-blue-200"
                          : "bg-green-200"
                      }`}
                    >
                      {task.status}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        task.priority === "high"
                          ? "bg-red-200"
                          : task.priority === "medium"
                          ? "bg-yellow-200"
                          : "bg-gray-200"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">📝 Gestionar Tareas</h2>
            <p className="text-gray-600">Organiza tus tareas con tableros Kanban</p>
          </div>
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">👤 Autenticación</h2>
            <p className="text-gray-600">Inicia sesión para acceder a tus tareas</p>
          </div>
        </div>
      </div>
    </main>
  );
}

