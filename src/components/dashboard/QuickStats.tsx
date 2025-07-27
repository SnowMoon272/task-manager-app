"use client";

interface QuickStatsProps {
  todoTasks: number;
  inProgressTasks: number;
  doneTasks: number;
}

export default function QuickStats({ todoTasks, inProgressTasks, doneTasks }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Tareas pendientes */}
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
                <dt className="text-sm font-medium text-gray-400 truncate">Tareas pendientes</dt>
                <dd className="text-lg font-medium text-white">{todoTasks}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* En progreso */}
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

      {/* Completadas */}
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
  );
}

