import SpaceButton from "../ui/SpaceButton";

export default function HeroSection() {
  return (
    <section className="container mx-auto px-4 pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent leading-tight">
          Gestiona tus tareas
          <br />
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
            en el espacio
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto">
          Organiza tu trabajo con un sistema de gestión de tareas intuitivo y poderoso.
          <br className="hidden sm:block" />
          Tu productividad navegará entre las estrellas.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
          <SpaceButton href="/register" variant="primary" className="w-full sm:w-auto">
            Comenzar Viaje
          </SpaceButton>
          <SpaceButton href="/login" variant="secondary" className="w-full sm:w-auto">
            Iniciar Sesión
          </SpaceButton>
        </div>
      </div>
    </section>
  );
}

