import { motion, AnimatePresence } from 'framer-motion';
import { Code2 } from 'lucide-react';

interface PseudoCodePanelProps {
  lines: string[];
  activeLine: number;
  title: string;
  color?: string;
}

export default function PseudoCodePanel({ lines, activeLine, title, color = '#0ea5e9' }: PseudoCodePanelProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl
                    bg-navy-900/70 backdrop-blur-sm border border-white/10">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 flex-shrink-0">
        <Code2 className="w-3.5 h-3.5" style={{ color }} />
        <span className="text-xs font-mono font-semibold" style={{ color }}>Pseudo-Code</span>
        <span className="ml-auto text-[10px] font-mono text-slate-600">{title}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-1 py-2 space-y-0.5 font-mono text-[11px]">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            animate={{
              backgroundColor: i === activeLine ? `${color}18` : 'transparent',
              borderLeftColor: i === activeLine ? color : 'transparent',
            }}
            transition={{ duration: 0.25 }}
            className="relative flex items-start gap-2 px-2 py-1 rounded-r border-l-2"
          >
            <span className="flex-shrink-0 w-5 text-right text-slate-700 select-none text-[10px] mt-0.5">
              {i + 1}
            </span>
            <span
              className={`leading-relaxed whitespace-pre-wrap break-words
                ${i === activeLine ? 'text-white font-semibold' : 'text-slate-500'}`}
            >
              {line}
            </span>
            <AnimatePresence>
              {i === activeLine && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
