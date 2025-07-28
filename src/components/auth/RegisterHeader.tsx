import Link from "next/link";

export default function RegisterHeader() {
  return (
    <div>
      {/* Badge de Demo */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full px-3 py-1">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-cyan-300 font-medium">DEMO T1</span>
        </div>
      </div>

      <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
        Crea tu cuenta
      </h2>
      <p className="mt-2 text-center text-sm text-gray-300">
        O{" "}
        <Link
          href="/login"
          className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          inicia sesión si ya tienes cuenta
        </Link>
      </p>
      <p className="mt-1 text-center text-xs text-gray-500">
        Proyecto de demostración - Prueba técnica T1
      </p>
    </div>
  );
}

