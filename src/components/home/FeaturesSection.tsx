import FeatureCard from "./FeatureCard";
import { CheckCircleIcon, UserGroupIcon, ChartBarIcon } from "@heroicons/react/24/outline";

export default function FeaturesSection() {
  return (
    <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Características Estelares
        </h2>
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-4">
          Descubre las herramientas que te ayudarán a conquistar tus objetivos
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
        <FeatureCard
          icon={<CheckCircleIcon className="w-10 sm:w-12 h-10 sm:h-12" />}
          title="Gestión Eficiente"
          description="Organiza tus tareas con un sistema intuitivo de estados y prioridades."
          borderColor="border-purple-500/30"
          iconGradient="from-purple-400 to-pink-500"
          hoverShadow="hover:shadow-purple-500/20"
        />

        <FeatureCard
          icon={<UserGroupIcon className="w-10 sm:w-12 h-10 sm:h-12" />}
          title="Colaboración en Equipo"
          description="Trabaja en equipo asignando tareas y manteniendo a todos sincronizados."
          borderColor="border-pink-500/30"
          iconGradient="from-pink-400 to-cyan-500"
          hoverShadow="hover:shadow-pink-500/20"
        />

        <FeatureCard
          icon={<ChartBarIcon className="w-10 sm:w-12 h-10 sm:h-12" />}
          title="Análisis de Progreso"
          description="Visualiza tu productividad con métricas detalladas y reportes completos."
          borderColor="border-cyan-500/30"
          iconGradient="from-cyan-400 to-purple-500"
          hoverShadow="hover:shadow-cyan-500/20"
        />
      </div>
    </section>
  );
}

