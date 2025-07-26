import FeatureCard from "./FeatureCard";
import { CheckCircleIcon, UserGroupIcon, ChartBarIcon } from "@heroicons/react/24/outline";

export default function FeaturesSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Características Estelares
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Descubre las herramientas que te ayudarán a conquistar tus objetivos
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <FeatureCard
          icon={<CheckCircleIcon className="w-12 h-12" />}
          title="Gestión Eficiente"
          description="Organiza tus tareas con un sistema intuitivo de estados y prioridades."
          borderColor="border-purple-500/30"
          iconGradient="from-purple-400 to-pink-500"
          hoverShadow="hover:shadow-purple-500/20"
        />

        <FeatureCard
          icon={<UserGroupIcon className="w-12 h-12" />}
          title="Colaboración en Equipo"
          description="Trabaja en equipo asignando tareas y manteniendo a todos sincronizados."
          borderColor="border-pink-500/30"
          iconGradient="from-pink-400 to-cyan-500"
          hoverShadow="hover:shadow-pink-500/20"
        />

        <FeatureCard
          icon={<ChartBarIcon className="w-12 h-12" />}
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

