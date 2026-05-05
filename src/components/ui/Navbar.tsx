import { motion } from 'framer-motion';
import { Activity, Cpu, Zap } from 'lucide-react';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 lg:px-6
                 bg-navy-900/80 backdrop-blur-md border-b border-neon-blue/20
                 shadow-[0_1px_24px_rgba(14,165,233,0.12)]"
    >
      {/* Logo + Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center
                          shadow-glow-blue">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-neon-green animate-pulse-slow" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xs sm:text-sm font-bold text-white truncate leading-tight">
            Delhi–Dehradun Expressway
          </h1>
          <p className="text-[10px] text-neon-blue/70 font-mono tracking-widest hidden sm:block">
            INTELLIGENCE & ALGORITHM PLATFORM
          </p>
        </div>
      </div>

      {/* Center status */}
      <div className="hidden md:flex items-center gap-6">
        <StatusPill label="Nodes" value="5" color="blue" />
        <StatusPill label="Edges" value="7" color="purple" />
        <StatusPill label="Algorithms" value="6" color="cyan" />
      </div>

      {/* Right: status indicator */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full
                        bg-neon-green/10 border border-neon-green/30">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
          <span className="text-neon-green text-xs font-mono">SYSTEM ONLINE</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Activity className="w-4 h-4 text-neon-blue animate-pulse-slow" />
          <Cpu className="w-4 h-4 text-neon-purple" />
        </div>
      </div>
    </motion.nav>
  );
}

function StatusPill({ label, value, color }: { label: string; value: string; color: 'blue' | 'purple' | 'cyan' }) {
  const colors = {
    blue:   'text-neon-blue border-neon-blue/30 bg-neon-blue/10',
    purple: 'text-neon-purple border-neon-purple/30 bg-neon-purple/10',
    cyan:   'text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10',
  };
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono ${colors[color]}`}>
      <span className="text-slate-400">{label}:</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
