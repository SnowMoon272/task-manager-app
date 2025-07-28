import SpaceButton from "../ui/SpaceButton";

export default function CTASection() {
  return (
    <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-2xl">
          <div className="mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full px-4 py-2 mb-4">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-cyan-300 font-medium">
                PRUEBA TÉCNICA T1
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Proyecto Demostración
            </h2>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto">
            Sistema de gestión de tareas desarrollado como prueba técnica para{" "}
            <span className="text-cyan-400 font-semibold">T1</span>.
            <br className="hidden sm:block" />
            Elaborado por{" "}
            <span className="text-purple-400 font-semibold">Manuel Roberto Serrano Torres</span>.
            <br className="hidden md:block" />
            <span className="text-sm sm:text-base text-gray-400 block mt-2">
              Demostración de habilidades en Next.js, TypeScript, MongoDB.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
            <SpaceButton
              href="/register"
              variant="primary"
              className="transform hover:scale-105 w-full sm:w-auto"
            >
              Explorar Demo
            </SpaceButton>
            <SpaceButton href="/login" variant="secondary" className="w-full sm:w-auto">
              Iniciar Sesión
            </SpaceButton>
          </div>

          {/* Footer técnico */}
          <div className="mt-8 pt-6 border-t border-purple-500/20">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Next.js 15</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>TypeScript</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>MongoDB</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Express.js</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

