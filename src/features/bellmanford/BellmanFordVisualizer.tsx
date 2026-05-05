import { motion, AnimatePresence } from 'framer-motion';
import { AlgorithmStep } from '../../types';
import { GRAPH_NODES } from '../../utils/graphData';

interface Props {
  currentStep: AlgorithmStep | null;
}

export default function BellmanFordVisualizer({ currentStep }: Props) {
  if (!currentStep) return null;

  const { distances, data } = currentStep;
  const iteration = (data?.iteration as number) ?? 0;
  const negativeCycle = (data?.negativeCycle as boolean) ?? false;
  const earlyTerm = (data?.earlyTermination as boolean) ?? false;

  return (
    <div className="space-y-3">
      {/* Iteration indicator */}
      <div className={`flex items-center justify-between p-3 rounded-xl border
        ${negativeCycle ? 'bg-neon-red/10 border-neon-red/30 animate-pulse' :
          earlyTerm ? 'bg-neon-green/10 border-neon-green/30' :
          'bg-neon-amber/10 border-neon-amber/25'}`}>
        <span className="text-xs font-mono text-slate-400">
          {negativeCycle ? '⚠️ Negative Cycle!' : earlyTerm ? '✓ Early Termination' : 'Iteration'}
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={iteration}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-bold font-mono"
            style={{ color: negativeCycle ? '#ef4444' : earlyTerm ? '#10b981' : '#f59e0b' }}
          >
            {negativeCycle ? 'N/A' : `${iteration} / ${GRAPH_NODES.length - 1}`}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Negative cycle warning */}
      <AnimatePresence>
        {negativeCycle && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-3 rounded-xl bg-neon-red/15 border border-neon-red/40
                       text-neon-red text-xs font-mono text-center animate-pulse"
          >
            🔴 NEGATIVE CYCLE DETECTED
            <br />
            <span className="text-[10px] text-slate-400">
              Infinite cost reduction possible — no optimal path exists
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Distance table */}
      <div className="rounded-xl bg-navy-900/60 border border-neon-amber/20 overflow-hidden">
        <div className="px-3 py-2 border-b border-white/10 text-[10px] font-mono text-neon-amber tracking-widest uppercase">
          Distance Relaxation Table
        </div>
        <div className="divide-y divide-white/5">
          {GRAPH_NODES.map(node => {
            const dist = distances[node.id];
            const isActive = currentStep.activeNodes.includes(node.id);
            const isFinal = currentStep.finalPathNodes.includes(node.id);
            const wasUpdated = (data?.updated as string) === node.id;

            return (
              <motion.div
                key={node.id}
                animate={{
                  backgroundColor: isFinal ? 'rgba(245,158,11,0.12)' :
                    wasUpdated ? 'rgba(16,185,129,0.15)' :
                    isActive ? 'rgba(14,165,233,0.10)' : 'transparent',
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 px-3 py-2"
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
                  background: isFinal ? '#f59e0b' : wasUpdated ? '#10b981' : isActive ? '#0ea5e9' : '#1e3a5f',
                }} />
                <span className="flex-1 text-xs font-mono text-slate-300">{node.label}</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={dist}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-mono font-bold text-sm"
                    style={{ color: dist === Infinity ? '#374151' : isFinal ? '#f59e0b' : wasUpdated ? '#10b981' : '#94a3b8' }}
                  >
                    {dist === Infinity ? '∞' : dist}
                  </motion.span>
                </AnimatePresence>
                {wasUpdated && <span className="text-[9px] font-mono text-neon-green">UPDATED ↓</span>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
