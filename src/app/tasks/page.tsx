"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TasksPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Task Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hola, {user?.name || user?.email}</span>
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Tareas</h2>

          <div className="text-center py-12">
            <svg
              className="w-24 h-24 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Página de Tareas Protegida</h3>
            <p className="text-gray-600 mb-4">
              Esta es una página protegida que solo pueden ver usuarios autenticados.
            </p>
            <p className="text-sm text-gray-500">
              Si puedes ver esta página, significa que las rutas protegidas funcionan correctamente.
            </p>
          </div>

          <div className="mt-8 border-t pt-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Navegación:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors"
              >
                <div className="font-semibold">Dashboard</div>
                <div className="text-sm opacity-90">Página principal</div>
              </Link>
              <Link
                href="/profile"
                className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors"
              >
                <div className="font-semibold">Perfil</div>
                <div className="text-sm opacity-90">Configuración de usuario</div>
              </Link>
              <Link
                href="/board"
                className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-colors"
              >
                <div className="font-semibold">Tablero</div>
                <div className="text-sm opacity-90">Vista Kanban</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

