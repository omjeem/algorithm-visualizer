import { motion, AnimatePresence } from 'framer-motion';
import { AlgorithmStep } from '../../types';
import { ROAD_SEGMENTS } from '../../utils/graphData';

interface Props {
  currentStep: AlgorithmStep | null;
}

interface HeapItem { road: string; score: number; }

export default function TopKVisualizer({ currentStep }: Props) {
  if (!currentStep) return null;

  const data = currentStep.data ?? {};
  const heap = (data.heap as HeapItem[]) ?? [];
  const rankings = (data.rankings as HeapItem[]) ?? [];
  const swapping = (data.swapping as number[]) ?? [];
  const comparing = (data.comparing as number[]) ?? [];
  const removed = data.removed as string | undefined;

  const isFinished = rankings.length > 0;

  const maxScore = Math.max(...ROAD_SEGMENTS.map(r => r.traffic), 1);

  return (
    <div className="space-y-3">
      {/* Min Heap visualization */}
      <div className="rounded-xl bg-navy-900/60 border border-neon-red/20 overflow-hidden">
        <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
          <span className="text-[10px] font-mono text-neon-red tracking-widest uppercase">Min-Heap (K=4)</span>
          <span className="text-[10px] font-mono text-slate-500">{heap.length}/4 elements</span>
        </div>
        <div className="p-3">
          {heap.length === 0 ? (
            <p className="text-xs text-slate-600 font-mono text-center py-2">Empty heap</p>
          ) : (
            <div className="space-y-2">
              {/* Tree-like visual for heap */}
              <div className="flex justify-center mb-2">
                {heap[0] && (
                  <motion.div
                    animate={{ scale: swapping.includes(0) ? [1, 1.2, 1] : 1 }}
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl
                               bg-neon-red/20 border-2 border-neon-red/50 min-w-[80px] text-center"
                    style={{ boxShadow: '0 0 16px rgba(239,68,68,0.3)' }}
                  >
                    <span className="text-[9px] font-mono text-neon-red">MIN ★</span>
                    <span className="text-xs font-mono text-white font-bold">{heap[0].road.split('–')[0]}</span>
                    <span className="text-sm font-mono font-bold text-neon-red">{heap[0].score}%</span>
                  </motion.div>
                )}
              </div>
              <div className="flex justify-center gap-4">
                {heap.slice(1, 3).map((item, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: swapping.includes(i + 1) ? [1, 1.1, 1] : 1 }}
                    className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg
                               bg-neon-red/10 border border-neon-red/25 min-w-[70px] text-center"
                  >
                    <span className="text-[9px] font-mono text-slate-500">[{i + 1}]</span>
                    <span className="text-[10px] font-mono text-slate-300">{item.road.split('–')[0]}</span>
                    <span className="text-xs font-mono text-neon-amber font-bold">{item.score}%</span>
                  </motion.div>
                ))}
              </div>
              {heap.length > 3 && (
                <div className="flex justify-center gap-3">
                  {heap.slice(3).map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg
                                           bg-navy-800 border border-white/10 min-w-[60px] text-center">
                      <span className="text-[9px] font-mono text-slate-600">[{i + 3}]</span>
                      <span className="text-[10px] font-mono text-slate-400">{item.road.split('–')[0]}</span>
                      <span className="text-xs font-mono text-slate-400 font-bold">{item.score}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Removed element notification */}
      <AnimatePresence>
        {removed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 py-2 rounded-xl bg-neon-red/10 border border-neon-red/30 text-xs font-mono text-neon-red"
          >
            Evicted: "{removed}" (below threshold)
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bar chart of all roads */}
      <div className="rounded-xl bg-navy-900/60 border border-white/10 p-3">
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Road Traffic Scores</p>
        <div className="space-y-2">
          {ROAD_SEGMENTS.map((road, i) => {
            const inHeap = heap.some(h => h.road === road.name);
            const inRankings = rankings.some(r => r.road === road.name);
            const isComparing = comparing.includes(i);
            const rank = rankings.findIndex(r => r.road === road.name);

            return (
              <div key={road.id} className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-slate-600 w-16 flex-shrink-0 truncate">
                  {road.name.split('–')[0]}–{road.name.split('–')[1]?.split(' ')[0]}
                </span>
                <div className="flex-1 h-5 bg-navy-800 rounded overflow-hidden relative">
                  <motion.div
                    animate={{ width: `${(road.traffic / maxScore) * 100}%` }}
                    initial={{ width: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="h-full rounded"
                    style={{
                      background: isFinished && inRankings
                        ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                        : inHeap
                          ? 'linear-gradient(90deg, #ef4444, #f87171)'
                          : isComparing
                            ? 'linear-gradient(90deg, #0ea5e9, #38bdf8)'
                            : 'linear-gradient(90deg, #1e3a5f, #2d5a8a)',
                      boxShadow: inRankings ? '0 0 8px rgba(245,158,11,0.5)' : 'none',
                    }}
                  />
                  {inRankings && rank >= 0 && (
                    <span className="absolute right-1 top-0 bottom-0 flex items-center text-[9px] font-mono font-bold text-neon-amber">
                      #{rank + 1}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-mono font-bold w-8 text-right flex-shrink-0
                  ${inRankings ? 'text-neon-amber' : inHeap ? 'text-neon-red' : 'text-slate-600'}`}>
                  {road.traffic}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final rankings */}
      <AnimatePresence>
        {isFinished && rankings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-neon-amber/10 border border-neon-amber/25 overflow-hidden"
          >
            <div className="px-3 py-2 border-b border-neon-amber/15">
              <span className="text-[10px] font-mono text-neon-amber tracking-widest uppercase">🏆 Top-K Rankings</span>
            </div>
            <div className="divide-y divide-white/5">
              {rankings.map((r, i) => (
                <motion.div
                  key={r.road}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 px-3 py-2"
                >
                  <span className="text-lg font-bold font-mono" style={{
                    color: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7c3a' : '#4b5563',
                  }}>#{i + 1}</span>
                  <span className="flex-1 text-xs font-mono text-slate-300">{r.road}</span>
                  <span className="font-mono font-bold text-neon-amber">{r.score}%</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
