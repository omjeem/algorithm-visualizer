import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'blue' | 'purple' | 'cyan' | 'green' | 'amber' | 'red';
  trend?: { value: number; label: string };
  index?: number;
}

const COLOR_MAP = {
  blue:   { text: 'text-neon-blue',   bg: 'bg-neon-blue/10',   border: 'border-neon-blue/25',   glow: 'shadow-[0_0_24px_rgba(14,165,233,0.15)]',  grad: 'from-neon-blue/20 to-transparent' },
  purple: { text: 'text-neon-purple', bg: 'bg-neon-purple/10', border: 'border-neon-purple/25', glow: 'shadow-[0_0_24px_rgba(168,85,247,0.15)]', grad: 'from-neon-purple/20 to-transparent' },
  cyan:   { text: 'text-neon-cyan',   bg: 'bg-neon-cyan/10',   border: 'border-neon-cyan/25',   glow: 'shadow-[0_0_24px_rgba(6,182,212,0.15)]',  grad: 'from-neon-cyan/20 to-transparent' },
  green:  { text: 'text-neon-green',  bg: 'bg-neon-green/10',  border: 'border-neon-green/25',  glow: 'shadow-[0_0_24px_rgba(16,185,129,0.15)]', grad: 'from-neon-green/20 to-transparent' },
  amber:  { text: 'text-neon-amber',  bg: 'bg-neon-amber/10',  border: 'border-neon-amber/25',  glow: 'shadow-[0_0_24px_rgba(245,158,11,0.15)]', grad: 'from-neon-amber/20 to-transparent' },
  red:    { text: 'text-neon-red',    bg: 'bg-neon-red/10',    border: 'border-neon-red/25',    glow: 'shadow-[0_0_24px_rgba(239,68,68,0.15)]',  grad: 'from-neon-red/20 to-transparent' },
};

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  index = 0,
}: StatsCardProps) {
  const c = COLOR_MAP[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`relative overflow-hidden rounded-xl p-4
                  bg-navy-900/70 backdrop-blur-sm
                  border ${c.border} ${c.glow}
                  transition-all duration-300 cursor-default`}
    >
      {/* Background gradient accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-40 bg-gradient-radial ${c.grad}`} />

      <div className="relative flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2">{title}</p>
          <motion.p
            className={`text-2xl font-bold ${c.text} font-mono leading-none`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.08 + 0.2, type: 'spring', stiffness: 200 }}
          >
            {value}
          </motion.p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 font-mono">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-[11px] font-mono ${trend.value >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>
              <span>{trend.value >= 0 ? '▲' : '▼'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-slate-600">{trend.label}</span>
            </div>
          )}
        </div>

        <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${c.text}`} />
        </div>
      </div>

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${c.grad}`} />
    </motion.div>
  );
}
