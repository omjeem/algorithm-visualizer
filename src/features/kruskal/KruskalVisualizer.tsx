import { motion, AnimatePresence } from 'framer-motion';
import { AlgorithmStep } from '../../types';
import { GRAPH_EDGES } from '../../utils/graphData';

interface Props {
  currentStep: AlgorithmStep | null;
  metric: 'distance' | 'toll' | 'fuel';
}

export default function KruskalVisualizer({ currentStep, metric }: Props) {
  if (!currentStep) return null;

  const { finalPathEdges, activeEdges, rejectedEdges, data } = currentStep;
  const mstCost = (data?.mstCost as number) ?? 0;
  const sortedEdges = [...GRAPH_EDGES].sort((a, b) => a[metric] - b[metric]);

  return (
    <div className="space-y-3">
      {/* MST Cost */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-neon-purple/10 border border-neon-purple/25">
        <span className="text-xs font-mono text-slate-400">MST Total {metric}</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={mstCost}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-xl font-bold font-mono text-neon-purple"
          >
            {mstCost}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Sorted edges with status */}
      <div className="rounded-xl bg-navy-900/60 border border-neon-purple/20 overflow-hidden">
        <div className="px-3 py-2 border-b border-white/10 text-[10px] font-mono text-neon-purple tracking-widest uppercase">
          Sorted Edges (by {metric})
        </div>
        <div className="divide-y divide-white/5">
          {sortedEdges.map((edge, i) => {
            const isMST = finalPathEdges.includes(edge.id);
            const isActive = activeEdges.includes(edge.id);
            const isRejected = rejectedEdges.includes(edge.id);

            return (
              <motion.div
                key={edge.id}
                animate={{
                  backgroundColor: isMST ? 'rgba(168,85,247,0.12)' :
                    isActive ? 'rgba(14,165,233,0.12)' :
                    isRejected ? 'rgba(55,65,81,0.3)' : 'transparent',
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 px-3 py-2"
              >
                <span className="text-[10px] font-mono text-slate-600 w-5 flex-shrink-0">#{i + 1}</span>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isMST ? 'bg-neon-purple' : isActive ? 'bg-neon-blue' : isRejected ? 'bg-gray-600' : 'bg-navy-700'}`}
                     style={{ boxShadow: isMST ? '0 0 6px #a855f7' : isActive ? '0 0 6px #0ea5e9' : 'none' }} />
                <span className="flex-1 text-[11px] font-mono text-slate-400">
                  {edge.source} ↔ {edge.target}
                </span>
                <span className="font-mono font-bold text-sm"
                      style={{ color: isMST ? '#a855f7' : isRejected ? '#374151' : '#94a3b8' }}>
                  {edge[metric]}
                </span>
                {isMST && <span className="text-[9px] text-neon-purple font-mono">MST ✓</span>}
                {isRejected && <span className="text-[9px] text-gray-600 font-mono">CYCLE ✗</span>}
                {isActive && <span className="text-[9px] text-neon-blue font-mono animate-pulse">CHECK</span>}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Components info */}
      {!!data?.components && (
        <div className="rounded-xl bg-navy-900/60 border border-white/10 p-3">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Union-Find Components</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(data.components as Record<string, string[]>).map(([root, members]) => (
              <div key={root} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-neon-purple/10 border border-neon-purple/20 text-[10px] font-mono">
                <span className="text-neon-purple font-bold">{root}:</span>
                <span className="text-slate-400">{Array.isArray(members) ? members.join(', ') : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
