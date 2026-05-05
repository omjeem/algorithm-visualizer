import { motion, AnimatePresence } from 'framer-motion';
import { AlgorithmStep } from '../../types';

interface Props {
  currentStep: AlgorithmStep | null;
}

const RESULT_CONFIG = {
  possible:       { color: '#10b981', label: '✓ POSSIBLY IN SET',         bg: 'bg-neon-green/10',  border: 'border-neon-green/30' },
  definitely_not: { color: '#f59e0b', label: '✗ DEFINITELY NOT IN SET',   bg: 'bg-neon-amber/10',  border: 'border-neon-amber/30' },
  false_positive: { color: '#ef4444', label: '⚠️ FALSE POSITIVE DETECTED', bg: 'bg-neon-red/10',    border: 'border-neon-red/30'   },
};

export default function BloomFilterVisualizer({ currentStep }: Props) {
  if (!currentStep) return null;

  const data = currentStep.data ?? {};
  const bits = (data.bits as boolean[]) ?? new Array(20).fill(false);
  const highlighted = (data.highlightedIndices as number[]) ?? [];
  const hashes = ((data.hashResults as number[][]) ?? [])[0] ?? [];
  const queryWord = data.queryWord as string | undefined;
  const result = data.result as keyof typeof RESULT_CONFIG | undefined;
  const operation = (data.operation as string) ?? 'init';

  const setCount = bits.filter(Boolean).length;
  const density = Math.round((setCount / bits.length) * 100);

  return (
    <div className="space-y-3">
      {/* Bit array */}
      <div className="rounded-xl bg-navy-900/60 border border-neon-cyan/20 p-3">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Bit Array (m={bits.length})</p>
          <span className="text-[10px] font-mono text-neon-cyan">{setCount}/{bits.length} set ({density}%)</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {bits.map((bit, i) => {
            const isHL = highlighted.includes(i);
            const isHash1 = hashes[0] === i;
            const isHash2 = hashes[1] === i;
            const isHash3 = hashes[2] === i;

            let dotColor = bit ? '#0ea5e9' : '#1e3a5f';
            let glowColor = '';
            if (isHL) {
              dotColor = operation === 'insert' ? '#10b981' : result === 'false_positive' ? '#ef4444' : result === 'possible' ? '#10b981' : '#a855f7';
              glowColor = `0 0 10px ${dotColor}`;
            }

            return (
              <motion.div
                key={i}
                animate={{
                  scale: isHL ? 1.3 : 1,
                  boxShadow: isHL ? glowColor : 'none',
                }}
                transition={{ duration: 0.3 }}
                className="relative flex flex-col items-center gap-0.5 cursor-default"
              >
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono font-bold border transition-all duration-300"
                  style={{
                    background: isHL ? `${dotColor}25` : bit ? '#0ea5e917' : '#0a162880',
                    borderColor: isHL ? dotColor : bit ? '#0ea5e940' : '#1e3a5f',
                    color: isHL ? dotColor : bit ? '#0ea5e9' : '#374151',
                  }}
                >
                  {bit ? '1' : '0'}
                </div>
                <span className="text-[8px] font-mono text-slate-700">{i}</span>
                {isHash1 && <span className="absolute -top-2 text-[7px] text-neon-green font-mono">h1</span>}
                {isHash2 && !isHash1 && <span className="absolute -top-2 text-[7px] text-neon-blue font-mono">h2</span>}
                {isHash3 && !isHash2 && !isHash1 && <span className="absolute -top-2 text-[7px] text-neon-purple font-mono">h3</span>}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Current operation */}
      {queryWord && (
        <div className="rounded-xl bg-navy-900/60 border border-white/10 p-3">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">
            {operation === 'insert' ? 'Inserting' : 'Querying'}
          </p>
          <p className="text-sm font-mono text-white mb-2">"{queryWord}"</p>
          {hashes.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {hashes.map((h, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono">
                  <span className="text-slate-500">h{i + 1}:</span>
                  <span className="text-neon-cyan font-bold">{h}</span>
                  <span className="text-slate-500">→</span>
                  <span style={{ color: bits[h] ? '#0ea5e9' : '#374151' }}>{bits[h] ? '1' : '0'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`p-3 rounded-xl border text-center ${RESULT_CONFIG[result].bg} ${RESULT_CONFIG[result].border}`}
          >
            <p className="font-mono font-bold text-sm" style={{ color: RESULT_CONFIG[result].color }}>
              {RESULT_CONFIG[result].label}
            </p>
            {result === 'false_positive' && (
              <p className="text-[10px] text-slate-500 font-mono mt-1">
                All hash positions are 1 but road was never inserted
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FPR meter */}
      <div className="rounded-xl bg-navy-900/60 border border-white/10 p-3">
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Filter Density</p>
        <div className="w-full h-2 rounded-full bg-navy-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: density > 70 ? '#ef4444' : density > 40 ? '#f59e0b' : '#10b981' }}
            animate={{ width: `${density}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-[10px] font-mono text-slate-600 mt-1">
          {density}% full — {density > 70 ? 'High FP rate' : density > 40 ? 'Moderate FP rate' : 'Low FP rate'}
        </p>
      </div>
    </div>
  );
}
