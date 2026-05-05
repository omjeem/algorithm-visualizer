import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ChevronRight } from 'lucide-react';

interface ExplanationPanelProps {
  explanation: string;
  stepIndex: number;
  totalSteps: number;
  color?: string;
  data?: Record<string, unknown>;
}

export default function ExplanationPanel({
  explanation,
  stepIndex,
  totalSteps,
  color = '#0ea5e9',
  data,
}: ExplanationPanelProps) {
  const lines = explanation.split('\n').filter(Boolean);

  return (
    <div className="rounded-xl bg-navy-900/70 backdrop-blur-sm border border-white/10 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
        <MessageSquare className="w-3.5 h-3.5" style={{ color }} />
        <span className="text-xs font-mono font-semibold" style={{ color }}>Step Explanation</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalSteps, 12) }).map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i === stepIndex ? '12px' : '4px',
                  background: i <= stepIndex ? color : '#1e3a5f',
                  opacity: i <= stepIndex ? 1 : 0.4,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="px-3 py-2.5">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-1.5"
          >
            {lines.map((line, i) => (
              <div key={i} className="flex gap-2 items-start">
                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color }} />
                <p className="text-xs text-slate-300 leading-relaxed font-mono">{line}</p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Extra data display */}
        {data && Object.keys(data).length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 pt-2 border-t border-white/5"
          >
            {data.currentNode !== undefined && (
              <DataTag label="Processing" value={String(data.currentNode)} color={color} />
            )}
            {data.updated !== undefined && (
              <DataTag label="Updated" value={`dist[${data.updated}] = ${data.newDist}`} color="#10b981" />
            )}
            {data.mstCost !== undefined && (
              <DataTag label="MST Cost" value={String(data.mstCost)} color="#a855f7" />
            )}
            {data.totalDist !== undefined && (
              <DataTag label="Total Cost" value={String(data.totalDist)} color="#f59e0b" />
            )}
            {data.iteration !== undefined && (
              <DataTag label="Iteration" value={String(data.iteration)} color="#06b6d4" />
            )}
            {data.prefixSum !== undefined && (
              <DataTag label="Prefix Sum" value={`₹${String(data.prefixSum)}`} color="#10b981" />
            )}
            {data.negativeCycle === true && (
              <DataTag label="⚠️ Alert" value="Negative Cycle Detected!" color="#ef4444" />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function DataTag({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2 py-0.5">
      <span className="text-[10px] text-slate-600 font-mono w-20 flex-shrink-0">{label}:</span>
      <span
        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
        style={{ color, background: `${color}15` }}
      >
        {value}
      </span>
    </div>
  );
}
