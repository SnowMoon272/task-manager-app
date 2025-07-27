import Link from "next/link";

export default function RegisterHeader() {
  return (
    <div>
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
    </div>
  );
}

