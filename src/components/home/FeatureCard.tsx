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
      className={`bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border ${borderColor} hover:border-opacity-60 transition-all duration-300 hover:shadow-lg ${hoverShadow}`}
    >
      <div className={`w-12 h-12 ${iconGradient} rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

