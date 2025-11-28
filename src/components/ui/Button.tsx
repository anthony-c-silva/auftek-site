import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    icon?: LucideIcon;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    icon: Icon,
    className = '',
    fullWidth = false,
    ...props
}) => {
    const baseStyles =
        'px-8 py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2';

    const variants = {
        primary:
            'bg-auftek-blue text-white hover:bg-blue-600 shadow-lg shadow-blue-500/25',
        outline:
            'bg-transparent border border-gray-600 text-white hover:bg-white/5',
        ghost: 'bg-transparent text-auftek-blue hover:text-white',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${
                fullWidth ? 'w-full' : ''
            } ${className}`}
            {...props}
        >
            {children}
            {Icon && <Icon size={20} />}
        </button>
    );
};
