import type { ReactNode } from 'react';

interface GradientBackgroundProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'dark';
  className?: string;
}

export default function GradientBackground({ children, variant = 'primary', className = '' }: GradientBackgroundProps) {
  const variantClasses = {
    primary: 'bg-linear-to-br from-[#0f172a] via-[#020617] to-black',
    secondary: 'bg-linear-to-b from-gray-900 via-gray-900 to-black',
    dark: 'bg-linear-to-r from-slate-900 via-slate-950 to-slate-950'
  };

  return (
    <div className={`min-h-screen ${variantClasses[variant]} text-white ${className}`}>
      {children}
    </div>
  );
}
