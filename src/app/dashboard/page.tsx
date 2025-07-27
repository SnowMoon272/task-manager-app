"use client";

import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import QuickStats from "@/components/dashboard/QuickStats";
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
          <QuickStats
            todoTasks={todoTasks}
            inProgressTasks={inProgressTasks}
            doneTasks={doneTasks}
          />

          {/* Tablero de tareas */}
          <div className="border-2 border-purple-500/30 bg-gray-800/30 backdrop-blur-sm rounded-lg p-6">
            <TaskBoard />
          </div>
        </div>
      </main>
    </div>
  );
}

