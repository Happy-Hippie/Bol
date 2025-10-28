import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient';
  children: ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-bol-pink text-white hover:bg-bol-pink/90 active:scale-95',
    secondary: 'bg-bol-blue text-white hover:bg-bol-blue/90 active:scale-95',
    outline: 'border-2 border-bol-pink text-bol-pink hover:bg-bol-pink hover:text-white active:scale-95',
    gradient: 'bg-gradient-pink-orange text-white hover:opacity-90 active:scale-95',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
