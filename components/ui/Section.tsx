import React from "react";
import { cn } from "../../lib/utils";

interface SectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  darker?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  id,
  children,
  className,
  darker = false,
}) => {
  return (
    <section
      id={id}
      className={cn(
        // Mobile-first: menos padding no mobile, mantém “grande” no desktop
        "w-full relative overflow-hidden py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-24",
        darker ? "bg-[#0a192f]" : "bg-[#0e223b]",
        className
      )}
    >
      <div className="max-w-7xl mx-auto relative z-10">{children}</div>
    </section>
  );
};

export const SectionTitle: React.FC<{
  children: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
}> = ({ children, subtitle, align = "left" }) => (
  <div className={cn("mb-10 sm:mb-12", align === "center" ? "text-center" : "text-left")}>
    <h2 className="font-bold text-white tracking-tight text-[clamp(1.75rem,4.5vw,2.25rem)]">
      {children}
    </h2>

    <span
      className={cn(
        "block h-1 w-20 bg-auftek-blue mt-4 rounded-full",
        align === "center" ? "mx-auto" : "ml-0"
      )}
    />

    {subtitle && (
      <p className="text-auftek-green font-medium max-w-3xl mx-auto mt-4 text-[clamp(1rem,2.5vw,1.25rem)]">
        {subtitle}
      </p>
    )}
  </div>
);
