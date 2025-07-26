"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* Stars background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      <nav className="bg-gray-800/30 backdrop-blur-sm border-b border-purple-500/30 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Task Manager
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Hola, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-red-500/25"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 relative z-10">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-2 border-purple-500/30 bg-gray-800/30 backdrop-blur-sm rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                ¡Bienvenido al Dashboard Espacial!
              </h2>
              <p className="text-gray-300 mb-8">
                Aquí podrás gestionar todas tus tareas y proyectos desde el espacio.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
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
                          <dd className="text-lg font-medium text-white">0</dd>
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
                          <dt className="text-sm font-medium text-gray-400 truncate">
                            En progreso
                          </dt>
                          <dd className="text-lg font-medium text-white">0</dd>
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
                          <dt className="text-sm font-medium text-gray-400 truncate">
                            Completadas
                          </dt>
                          <dd className="text-lg font-medium text-white">0</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                  Crear primera tarea
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

