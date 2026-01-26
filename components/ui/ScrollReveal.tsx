"use client";

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: '0' | '100' | '200' | '300' | '500';
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
                                                              children,
                                                              className = "",
                                                              delay = '0'
                                                          }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 1. Removemos o typeof window === 'undefined' pois useEffect só roda no cliente.
        // 2. Verificamos apenas se o navegador suporta a API.
        const hasSupport = 'IntersectionObserver' in window;

        if (!hasSupport) {
            // CORREÇÃO: Usamos setTimeout para evitar o erro de update síncrono
            const timer = setTimeout(() => setIsVisible(true), 0);
            return () => clearTimeout(timer);
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Para de observar assim que aparecer
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    const delayClasses = {
        '0': '',
        '100': 'delay-100',
        '200': 'delay-200',
        '300': 'delay-300',
        '500': 'delay-500',
    };

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out transform ${
                isVisible
                    ? `opacity-100 translate-y-0 ${delayClasses[delay]}`
                    : 'opacity-0 translate-y-20'
            } ${className}`}
        >
            {children}
        </div>
    );
};