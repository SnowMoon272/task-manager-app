"use client";

import { ClockIcon, DocumentTextIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

interface QuickStatsProps {
  todoTasks: number;
  inProgressTasks: number;
  doneTasks: number;
}

export default function QuickStats({ todoTasks, inProgressTasks, doneTasks }: QuickStatsProps) {
  const stats = [
    {
      id: "todo",
      name: "Pendientes",
      value: todoTasks,
      icon: DocumentTextIcon,
      color: "purple",
      borderColor: "border-purple-400/20",
      hoverBorderColor: "hover:border-purple-400/40",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400",
      hoverIconBg: "group-hover:bg-purple-500/20",
    },
    {
      id: "progress",
      name: "En progreso",
      value: inProgressTasks,
      icon: ClockIcon,
      color: "cyan",
      borderColor: "border-cyan-400/20",
      hoverBorderColor: "hover:border-cyan-400/40",
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-400",
      hoverIconBg: "group-hover:bg-cyan-500/20",
    },
    {
      id: "done",
      name: "Completadas",
      value: doneTasks,
      icon: CheckCircleIcon,
      color: "green",
      borderColor: "border-green-400/20",
      hoverBorderColor: "hover:border-green-400/40",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
      hoverIconBg: "group-hover:bg-green-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={stat.id}
            className={`group relative bg-gray-800/30 backdrop-blur-sm border ${stat.borderColor} ${stat.hoverBorderColor} rounded-lg p-3 sm:p-4 transition-all duration-300 hover:shadow-lg`}
          >
            <div
              className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-${stat.color}-400/50 to-transparent`}
            ></div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`${stat.iconBg} ${stat.hoverIconBg} p-1.5 sm:p-2 rounded-lg transition-all duration-300`}
                  >
                    <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-400 mb-0.5">
                      {stat.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-300/80 select-none">
                {stat.value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

