interface User {
  _id?: string;
  name?: string;
  email?: string;
  createdAt?: string;
}

interface ProfileContentProps {
  user: User | null;
}

export default function ProfileContent({ user }: ProfileContentProps) {
  return (
    <div className="p-6">
      <div className="flex items-center space-x-6 mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">{user?.name || "Usuario"}</h3>
          <p className="text-gray-300">{user?.email}</p>
          <p className="text-sm text-gray-400 mt-1">
            Miembro desde:{" "}
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "Fecha no disponible"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 p-4 rounded-lg">
          <h4 className="font-medium text-white mb-2">Información Personal</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-400">Nombre:</span>
              <span className="ml-2 text-white">{user?.name || "No especificado"}</span>
            </div>
            <div>
              <span className="text-gray-400">Email:</span>
              <span className="ml-2 text-white">{user?.email}</span>
            </div>
            <div>
              <span className="text-gray-400">ID de Usuario:</span>
              <span className="ml-2 text-white font-mono text-xs">{user?._id}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/20 p-4 rounded-lg">
          <h4 className="font-medium text-white mb-2">Estadísticas</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-400">Tareas creadas:</span>
              <span className="ml-2 text-white">0</span>
            </div>
            <div>
              <span className="text-gray-400">Tareas completadas:</span>
              <span className="ml-2 text-white">0</span>
            </div>
            <div>
              <span className="text-gray-400">Proyectos activos:</span>
              <span className="ml-2 text-white">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

