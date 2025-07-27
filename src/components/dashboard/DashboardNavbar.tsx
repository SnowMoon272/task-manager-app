import SpaceButton from "@/components/ui/SpaceButton";
import { useAuthStore } from "@/store/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardNavbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Determinar qué botón mostrar basado en la ruta actual
  const getNavigationButton = () => {
    if (pathname === "/profile") {
      return (
        <SpaceButton href="/dashboard" variant="purpleToBlue">
          Dashboard
        </SpaceButton>
      );
    } else if (pathname === "/tasks") {
      return (
        <SpaceButton href="/dashboard" variant="purpleToBlue">
          Dashboard
        </SpaceButton>
      );
    } else {
      // En dashboard y otras páginas, mostrar enlace al perfil
      return (
        <SpaceButton href="/profile" variant="purpleToBlue">
          Mi Perfil
        </SpaceButton>
      );
    }
  };

  return (
    <nav className="bg-gray-800/30 backdrop-blur-sm border-b border-purple-500/30 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="cursor-pointer">
              <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-cyan-300 transition-all duration-300">
                Task Manager
              </h1>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Hola, {user?.name}</span>
            {getNavigationButton()}
            <SpaceButton onClick={handleLogout} variant="danger">
              Cerrar sesión
            </SpaceButton>
          </div>
        </div>
      </div>
    </nav>
  );
}

