"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import QuickStats from "@/components/dashboard/QuickStats";
import TaskBoardContainer from "@/components/tasks/TaskBoardContainer";
import TaskBoardModalsGlobal from "@/components/tasks/TaskBoardModalsGlobal";
import { useAuthStore } from "@/store/auth";
import { useTasksStore } from "@/store/tasks";
import { Task, CreateTaskData } from "@/types";

export default function DashboardPage() {
  const { isLoading } = useAuthStore();
  const { tasks } = useTasksStore();

  // Estados de modales globales
  const [modalStates, setModalStates] = useState<{
    isCreateModalOpen: boolean;
    selectedTask: Task | null;
    taskToDelete: Task | null;
    errorMessage: string | null;
    showIncompleteSubtasksAlert: boolean;
    alertTask: Task | null;
    onCloseCreateModal: () => void;
    onCreateTask: (taskData: CreateTaskData) => Promise<void>;
    onCloseDetailModal: () => void;
    onEditTask: (task: Task) => Promise<void>;
    onDeleteTask: (taskId: string) => void;
    onUpdateSubtasks: (taskId: string, subtasks: Task["subtasks"]) => Promise<void>;
    onCloseDeleteModal: () => void;
    onConfirmDelete: () => Promise<void>;
    onCloseErrorModal: () => void;
    onCloseIncompleteSubtasksAlert: () => void;
  } | null>(null);

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
          <div className="border-2 border-purple-500/30 bg-gray-800/30 backdrop-blur-sm rounded-lg">
            <TaskBoardContainer onModalStatesChange={setModalStates} />
          </div>
        </div>
      </main>

      {/* Modales globales que aparecen por encima de todo */}
      {modalStates && (
        <TaskBoardModalsGlobal
          isCreateModalOpen={modalStates.isCreateModalOpen}
          selectedTask={modalStates.selectedTask}
          taskToDelete={modalStates.taskToDelete}
          errorMessage={modalStates.errorMessage}
          showIncompleteSubtasksAlert={modalStates.showIncompleteSubtasksAlert}
          alertTask={modalStates.alertTask}
          onCloseCreateModal={modalStates.onCloseCreateModal}
          onCreateTask={modalStates.onCreateTask}
          onCloseDetailModal={modalStates.onCloseDetailModal}
          onEditTask={modalStates.onEditTask}
          onDeleteTask={modalStates.onDeleteTask}
          onUpdateSubtasks={modalStates.onUpdateSubtasks}
          onCloseDeleteModal={modalStates.onCloseDeleteModal}
          onConfirmDelete={modalStates.onConfirmDelete}
          onCloseErrorModal={modalStates.onCloseErrorModal}
          onCloseIncompleteSubtasksAlert={modalStates.onCloseIncompleteSubtasksAlert}
        />
      )}
    </div>
  );
}

