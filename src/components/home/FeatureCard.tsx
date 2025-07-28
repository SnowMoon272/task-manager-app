import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  borderColor: string;
  iconGradient: string;
  hoverShadow: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  borderColor,
  iconGradient,
  hoverShadow,
}: FeatureCardProps) {
  return (
    <div
      className={`bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-xl border ${borderColor} hover:border-opacity-60 transition-all duration-300 hover:shadow-lg ${hoverShadow} h-full`}
    >
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 ${iconGradient} rounded-lg flex items-center justify-center mb-3 sm:mb-4 mx-auto sm:mx-0`}
      >
        <div className="text-white">{icon}</div>
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white text-center sm:text-left">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-gray-400 leading-relaxed text-center sm:text-left">
        {description}
      </p>
    </div>
  );
}

