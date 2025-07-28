import Link from "next/link";
import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/24/outline";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Botón de regreso a Home */}
      <Link
        href="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors group z-20"
      >
        <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <HomeIcon className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">Volver al inicio</span>
      </Link>

      {/* Logo/Marca en la esquina superior derecha */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          TaskManager
        </h1>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">{children}</div>
    </div>
  );
}

