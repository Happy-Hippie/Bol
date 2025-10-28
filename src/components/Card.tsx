import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  borderColor?: 'pink' | 'blue' | 'orange' | 'purple' | 'none';
  gradient?: boolean;
}

export function Card({ children, className = '', borderColor = 'none', gradient = false }: CardProps) {
  const borderColors = {
    pink: 'border-l-4 border-bol-pink',
    blue: 'border-l-4 border-bol-blue',
    orange: 'border-l-4 border-bol-orange',
    purple: 'border-l-4 border-bol-purple',
    none: '',
  };

  const gradientClass = gradient ? 'bg-gradient-pink-orange text-white' : 'bg-white';

  return (
    <div className={`rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg ${gradientClass} ${borderColors[borderColor]} ${className}`}>
      {children}
    </div>
  );
}
