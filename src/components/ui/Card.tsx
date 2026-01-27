import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  variant?: 'default' | 'glass' | 'bordered';
}

export default function Card({ children, className = '', hover = false, variant = 'default' }: CardProps) {
  const baseClasses = 'rounded-xl p-6';

  const variantClasses = {
    default: 'bg-slate-900/60 border border-slate-800',
    glass: 'bg-slate-900/80 backdrop-blur-lg border border-slate-800 shadow-2xl',
    bordered: 'bg-slate-800/50 border border-slate-700'
  };

  const hoverClasses = hover ? 'hover:border-cyan-500/50 transition-all duration-300' : '';

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}
