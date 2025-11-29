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
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Dispara quando 10% do elemento está visível
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Anima apenas uma vez
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  // Mapeamento dos delays baseados nas classes do seu CSS global
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
          : 'opacity-0 translate-y-20' // Começa invisível e 20px para baixo
      } ${className}`}
    >
      {children}
    </div>
  );
};