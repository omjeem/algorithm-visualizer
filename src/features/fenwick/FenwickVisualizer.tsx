import { motion, AnimatePresence } from 'framer-motion';
import { AlgorithmStep } from '../../types';

const SEGMENT_NAMES = ['', 'Del–Mrt', 'Mrt–Muz', 'Muz–Rke', 'Rke–Deh', 'Del–Muz', 'Mrt–Rke', 'Muz–Deh'];
const TOLLS = [0, 85, 75, 80, 70, 150, 130, 200];

interface Props {
  currentStep: AlgorithmStep | null;
}

export default function FenwickVisualizer({ currentStep }: Props) {
  if (!currentStep) return null;

  const data = currentStep.data ?? {};
  const tree = (data.tree as number[]) ?? new Array(8).fill(0);
  const highlighted = (data.highlightedIndices as number[]) ?? [];
  const operation = (data.operation as string) ?? 'init';
  const prefixSum = data.prefixSum as number | undefined;
  const queryIndex = data.queryIndex as number | undefined;

  const MAX_TREE = Math.max(...tree.slice(1), 1);

  return (
    <div className="space-y-3">
      {/* Operation badge */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-neon-green/10 border border-neon-green/25">
        <div className="flex-1">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Operation</p>
          <p className="text-sm font-mono font-bold text-neon-green mt-0.5 capitalize">{operation}</p>
        </div>
        {prefixSum !== undefined && (
          <div className="text-right">
            <p className="text-[10px] font-mono text-slate-500">Result</p>
            <p className="text-xl font-mono font-bold text-neon-amber">₹{prefixSum}</p>
          </div>
        )}
      </div>

      {/* Toll array */}
      <div className="rounded-xl bg-navy-900/60 border border-neon-green/20 p-3">
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Original Toll Array</p>
        <div className="flex gap-1.5 flex-wrap">
          {TOLLS.slice(1).map((toll, i) => {
            const idx = i + 1;
            const isHL = highlighted.includes(idx);
            return (
              <motion.div
                key={idx}
                animate={{
                  scale: isHL ? 1.1 : 1,
                  borderColor: isHL ? '#10b981' : '#1e3a5f',
                }}
                className="flex flex-col items-center gap-1 p-2 rounded-lg border bg-navy-900/80 min-w-[50px]"
              >
                <span className="text-[9px] font-mono text-slate-600">[{idx}]</span>
                <span className={`text-sm font-mono font-bold ${isHL ? 'text-neon-green' : 'text-slate-400'}`}>₹{toll}</span>
                <span className="text-[9px] font-mono text-slate-700 truncate max-w-[50px] text-center">{SEGMENT_NAMES[idx]}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Tree visualization */}
      <div className="rounded-xl bg-navy-900/60 border border-neon-green/20 p-3">
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Fenwick Tree (BIT)</p>
        <div className="flex items-end gap-2 h-28">
          {tree.slice(1).map((val, i) => {
            const idx = i + 1;
            const isHL = highlighted.includes(idx);
            const heightPct = MAX_TREE > 0 ? (val / MAX_TREE) * 100 : 0;

            return (
              <div key={idx} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                <span className={`text-[9px] font-mono font-bold ${isHL ? 'text-neon-green' : 'text-slate-600'}`}>
                  {val > 0 ? val : '0'}
                </span>
                <motion.div
                  className="w-full rounded-t-sm"
                  animate={{
                    height: `${heightPct}%`,
                    background: isHL
                      ? 'linear-gradient(to top, #10b981, #34d399)'
                      : operation === 'query' && highlighted.includes(idx)
                        ? 'linear-gradient(to top, #a855f7, #c084fc)'
                        : 'linear-gradient(to top, #1e3a5f, #2d5a8a)',
                    boxShadow: isHL ? '0 0 12px rgba(16,185,129,0.6)' : 'none',
                  }}
                  transition={{ duration: 0.4 }}
                  style={{ minHeight: '4px' }}
                />
                <span className="text-[9px] font-mono text-slate-700">[{idx}]</span>
                <span className="text-[8px] font-mono text-slate-800 truncate w-full text-center">
                  {idx}&{idx.toString(2).replace(/0*$/, m => '0'.repeat(m.length))}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-[9px] font-mono text-slate-700 mt-2 text-center">
          Each index i covers lowbit(i) = {queryIndex ? `i & -i` : 'i & -i'} positions
        </p>
      </div>

      {/* Query path visualization */}
      <AnimatePresence>
        {highlighted.length > 1 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl bg-neon-green/5 border border-neon-green/20 p-3"
          >
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">
              {operation === 'update' ? 'Update Path' : 'Query Path'}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {highlighted.map((idx, i) => (
                <div key={idx} className="flex items-center gap-1">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="px-2 py-1 rounded-lg bg-neon-green/20 border border-neon-green/40 text-[10px] font-mono text-neon-green font-bold"
                  >
                    tree[{idx}] += {TOLLS[idx] ?? '…'}
                  </motion.div>
                  {i < highlighted.length - 1 && <span className="text-neon-green text-xs">→</span>}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
