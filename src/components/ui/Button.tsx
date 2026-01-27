import type { ReactNode, ButtonHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  loading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-mono font-bold transition-all rounded-lg flex items-center justify-center gap-2';

  const variantClasses = {
    primary: 'bg-cyan-500 hover:bg-cyan-600 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95',
    secondary: 'bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-300',
    danger: 'bg-red-900/20 hover:bg-red-900/40 border border-red-500/50 text-red-300',
    ghost: 'bg-transparent hover:bg-slate-800 border border-slate-700 text-gray-400 hover:text-cyan-400'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
}
