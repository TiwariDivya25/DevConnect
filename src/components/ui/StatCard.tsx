import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  color?: string;
  loading?: boolean;
}

export default function StatCard({ label, value, icon: Icon, trend, color = 'text-blue-400', loading = false }: StatCardProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-cyan-500/50 transition-all duration-300">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
        <Icon className="w-12 h-12" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 bg-slate-800 rounded-lg ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          {trend && (
            <span className="text-[10px] bg-slate-800 text-gray-400 px-2 py-1 rounded">
              {trend}
            </span>
          )}
        </div>
        <div className="text-3xl font-bold text-white mb-1">
          {loading ? '...' : value}
        </div>
        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">
          {label}
        </div>
      </div>
    </div>
  );
}
