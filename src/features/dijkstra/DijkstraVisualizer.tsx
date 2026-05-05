import { motion, AnimatePresence } from 'framer-motion';
import { AlgorithmStep } from '../../types';
import { GRAPH_NODES } from '../../utils/graphData';

interface Props {
  currentStep: AlgorithmStep | null;
}

export default function DijkstraVisualizer({ currentStep }: Props) {
  if (!currentStep) return null;

  const { distances, data } = currentStep;
  const pq = (data?.pq as { node: string; dist: number }[] | undefined) ?? [];

  return (
    <div className="space-y-3">
      {/* Distance table */}
      <div className="rounded-xl bg-navy-900/60 border border-neon-blue/20 overflow-hidden">
        <div className="px-3 py-2 border-b border-white/10 text-[10px] font-mono text-neon-blue tracking-widest uppercase">
          Distance Table
        </div>
        <div className="divide-y divide-white/5">
          {GRAPH_NODES.map(node => {
            const dist = distances[node.id];
            const isActive = currentStep.activeNodes.includes(node.id);
            const isVisited = currentStep.visitedNodes.includes(node.id);
            const isFinal = currentStep.finalPathNodes.includes(node.id);

            return (
              <motion.div
                key={node.id}
                animate={{
                  backgroundColor: isFinal ? 'rgba(245,158,11,0.12)' :
                    isActive ? 'rgba(14,165,233,0.12)' :
                    isVisited ? 'rgba(124,58,237,0.08)' : 'transparent',
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 px-3 py-2"
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
                  background: isFinal ? '#f59e0b' : isActive ? '#0ea5e9' : isVisited ? '#7c3aed' : '#1e3a5f',
                  boxShadow: isFinal ? '0 0 6px #f59e0b' : isActive ? '0 0 6px #0ea5e9' : 'none',
                }} />
                <span className="flex-1 text-xs font-mono text-slate-300">{node.label}</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={dist}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono font-bold text-sm"
                    style={{ color: dist === Infinity ? '#374151' : isFinal ? '#f59e0b' : isActive ? '#0ea5e9' : '#94a3b8' }}
                  >
                    {dist === Infinity ? '∞' : dist}
                  </motion.span>
                </AnimatePresence>
                {isVisited && <span className="text-[9px] font-mono text-neon-purple">DONE</span>}
                {isActive && <span className="text-[9px] font-mono text-neon-blue animate-pulse">↵</span>}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Priority Queue */}
      {pq.length > 0 && (
        <div className="rounded-xl bg-navy-900/60 border border-neon-blue/20 overflow-hidden">
          <div className="px-3 py-2 border-b border-white/10 text-[10px] font-mono text-neon-blue tracking-widest uppercase">
            Priority Queue
          </div>
          <div className="px-3 py-2 flex flex-wrap gap-2">
            {pq.map((item, i) => (
              <motion.div
                key={`${item.node}-${i}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg
                           bg-neon-blue/10 border border-neon-blue/30 text-[10px] font-mono"
              >
                {i === 0 && <span className="text-neon-amber">★</span>}
                <span className="text-slate-300">{item.node}</span>
                <span className="text-neon-blue font-bold">{item.dist === Infinity ? '∞' : item.dist}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
