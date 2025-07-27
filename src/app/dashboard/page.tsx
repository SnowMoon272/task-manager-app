"use client";

import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { useAuthStore } from "@/store/auth";

export default function DashboardPage() {
  const { isLoading } = useAuthStore();

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

