"use client";

import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import TaskBoard from "@/components/tasks/TaskBoard";
import { useAuthStore } from "@/store/auth";
import { useTasksStore } from "@/store/tasks";

export default function DashboardPage() {
  const { isLoading } = useAuthStore();
  const { tasks } = useTasksStore();

  // Calcular estadísticas de tareas
  const todoTasks = tasks.filter((task) => task.status === "todo").length;
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length;
  const doneTasks = tasks.filter((task) => task.status === "done").length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 relative z-10">
        <div className="px-4 py-6 sm:px-0">
          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 overflow-hidden shadow-lg rounded-lg hover:border-purple-500/40 transition-all duration-300">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">📝</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        Tareas pendientes
                      </dt>
                      <dd className="text-lg font-medium text-white">{todoTasks}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/20 overflow-hidden shadow-lg rounded-lg hover:border-cyan-500/40 transition-all duration-300">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">⏳</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">En progreso</dt>
                      <dd className="text-lg font-medium text-white">{inProgressTasks}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-pink-500/20 overflow-hidden shadow-lg rounded-lg hover:border-pink-500/40 transition-all duration-300">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">✅</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">Completadas</dt>
                      <dd className="text-lg font-medium text-white">{doneTasks}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tablero de tareas */}
          <div className="border-2 border-purple-500/30 bg-gray-800/30 backdrop-blur-sm rounded-lg p-6">
            <TaskBoard />
          </div>
        </div>
      </main>
    </div>
  );
}

