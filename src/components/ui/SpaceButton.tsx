import Link from "next/link";
import { ReactNode } from "react";

interface SpaceButtonProps {
  href: string;
  variant: "primary" | "secondary";
  children: ReactNode;
  className?: string;
}

export default function SpaceButton({ href, variant, children, className = "" }: SpaceButtonProps) {
  const baseClasses = "font-semibold py-3 px-8 rounded-lg transition-all duration-300";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/25",
    secondary:
      "bg-transparent border-2 border-purple-400 hover:bg-purple-400/10 text-purple-400 backdrop-blur-sm",
  };

  return (
    <Link href={href} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </Link>
  );
}

