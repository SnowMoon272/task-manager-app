import Link from "next/link";
import { ReactNode } from "react";

interface SpaceButtonProps {
  href?: string;
  variant: "primary" | "secondary" | "purpleToBlue" | "danger";
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function SpaceButton({
  href,
  variant,
  children,
  className = "",
  onClick,
}: SpaceButtonProps) {
  const baseClasses = "font-medium px-4 py-2 rounded-lg transition-all duration-300 text-sm";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/25",
    secondary:
      "bg-transparent border-2 border-purple-400 hover:bg-purple-400/10 text-purple-400 backdrop-blur-sm",
    purpleToBlue:
      "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-purple-500/25",
    danger:
      "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-red-500/25",
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (onClick) {
    return (
      <button onClick={onClick} className={buttonClasses}>
        {children}
      </button>
    );
  }

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    );
  }

  return null;
}

