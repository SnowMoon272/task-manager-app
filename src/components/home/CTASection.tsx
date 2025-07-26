import SpaceButton from "../ui/SpaceButton";

export default function CTASection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-12 shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ¿Listo para la aventura?
          </h2>

          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Únete a miles de usuarios que ya han transformado su productividad.
            <br />
            Tu misión te espera entre las estrellas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SpaceButton href="/register" variant="primary" className="transform hover:scale-105">
              Iniciar Misión
            </SpaceButton>
            <SpaceButton href="/login" variant="secondary">
              Ya tengo cuenta
            </SpaceButton>
          </div>
        </div>
      </div>
    </section>
  );
}

