import SpaceButton from "../ui/SpaceButton";

export default function HeroSection() {
  return (
    <section className="container mx-auto px-4 pt-20 pb-16 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
          Gestiona tus tareas
          <br />
          <span className="text-4xl md:text-6xl">en el espacio</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
          Organiza tu trabajo con un sistema de gestión de tareas intuitivo y poderoso.
          <br />
          Tu productividad navegará entre las estrellas.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <SpaceButton href="/register" variant="primary">
            Comenzar Viaje
          </SpaceButton>
          <SpaceButton href="/login" variant="secondary">
            Iniciar Sesión
          </SpaceButton>
        </div>
      </div>
    </section>
  );
}

