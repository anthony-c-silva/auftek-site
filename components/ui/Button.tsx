import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils'; // Importando seu utilitário de classes

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    icon?: LucideIcon;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  variant = 'primary',
                                                  icon: Icon,
                                                  className,
                                                  fullWidth = false,
                                                  ...props
                                              }) => {
    const variants = {
        primary: 'bg-auftek-blue text-white hover:bg-blue-600 shadow-lg shadow-blue-500/25',
        outline: 'bg-transparent border border-gray-600 text-white hover:bg-white/5',
        ghost: 'bg-transparent text-auftek-blue hover:text-white',
    };

    return (
        <button
            className={cn(
                'px-8 py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2',
                variants[variant],
                fullWidth && 'w-full',
                className // Permite sobrescrever estilos se necessário
            )}
            {...props}
        >
            {children}
            {Icon && <Icon size={20} />}
        </button>
    );
};