import SpaceButton from "@/components/ui/SpaceButton";

export default function Navbar() {
  return (
    <nav className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-purple-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            TaskManager
          </h1>

          <div className="flex gap-4">
            <SpaceButton href="/login" variant="secondary">
              Iniciar Sesión
            </SpaceButton>
            <SpaceButton href="/register" variant="primary">
              Registrarse
            </SpaceButton>
          </div>
        </div>
      </div>
    </nav>
  );
}

