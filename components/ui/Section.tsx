import React from 'react';
import { cn } from '../../lib/utils';

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
                "py-20 px-6 md:px-12 lg:px-24 w-full relative overflow-hidden",
                darker ? 'bg-[#0a192f]' : 'bg-[#0e223b]',
                className
            )}
        >
            <div className="max-w-7xl mx-auto relative z-10">{children}</div>
        </section>
    );
};

// SectionTitle mantém-se igual, apenas limpando as classes se quiser
export const SectionTitle: React.FC<{
    children: React.ReactNode;
    subtitle?: string;
    align?: 'left' | 'center';
}> = ({ children, subtitle, align = 'left' }) => (
    <div className={cn("mb-12", align === 'center' ? 'text-center' : 'text-left')}>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            {children}
            <span
                className="block h-1 w-20 bg-auftek-blue mt-4 rounded-full"
                style={{
                    marginLeft: align === 'center' ? 'auto' : 0,
                    marginRight: align === 'center' ? 'auto' : 0,
                }}
            ></span>
        </h2>
        {subtitle && (
            <p className="text-auftek-green text-lg md:text-xl font-medium max-w-3xl mx-auto">
                {subtitle}
            </p>
        )}
    </div>
);