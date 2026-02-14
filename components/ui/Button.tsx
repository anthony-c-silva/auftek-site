import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  icon?: LucideIcon;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  icon: Icon,
  className,
  fullWidth = false,
  ...props
}) => {
  const variants = {
    primary:
      "bg-auftek-blue text-white hover:bg-blue-600 shadow-lg shadow-blue-500/25",
    outline: "bg-transparent border border-gray-600 text-white hover:bg-white/5",
    ghost: "bg-transparent text-auftek-blue hover:text-white",
  };

  return (
    <button
      className={cn(
        // base: mobile-first
        "inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all",
        "px-5 py-3 text-sm sm:px-8 sm:py-4 sm:text-base",
        // acessibilidade/UX
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auftek-blue/60 focus-visible:ring-offset-2 focus-visible:ring-offset-auftek-dark",
        // width
        fullWidth ? "w-full" : "w-auto",
        // variant
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
      {Icon && <Icon size={20} />}
    </button>
  );
};
