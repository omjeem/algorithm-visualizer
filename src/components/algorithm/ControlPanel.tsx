import { motion } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { AnimationSpeed } from '../../types';

interface ControlPanelProps {
  isPlaying: boolean;
  speed: AnimationSpeed;
  currentStep: number;
  totalSteps: number;
  progress: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onRestart: () => void;
  onJumpToStep: (i: number) => void;
  onSpeedChange: (s: AnimationSpeed) => void;
}

const SPEEDS: { label: string; value: AnimationSpeed }[] = [
  { label: '0.25×', value: 0.25 },
  { label: '0.5×', value: 0.5 },
  { label: '1×', value: 1 },
  { label: '2×', value: 2 },
];

export default function ControlPanel({
  isPlaying,
  speed,
  currentStep,
  totalSteps,
  progress,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onRestart,
  onJumpToStep,
  onSpeedChange,
}: ControlPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3 p-3 rounded-xl
                 bg-navy-900/80 backdrop-blur-sm
                 border border-neon-blue/20
                 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
    >
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
          <span>Step {currentStep + 1} / {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div
          className="w-full h-1.5 rounded-full bg-navy-800 cursor-pointer"
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            onJumpToStep(Math.round(ratio * (totalSteps - 1)));
          }}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-purple relative"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full
                            bg-white shadow-glow-blue translate-x-1/2" />
          </motion.div>
        </div>

        {/* Timeline scrubber */}
        <input
          type="range"
          min={0}
          max={totalSteps - 1}
          value={currentStep}
          onChange={e => onJumpToStep(Number(e.target.value))}
          className="w-full h-1 appearance-none bg-transparent cursor-pointer"
          style={{ marginTop: '-10px', opacity: 0 }}
        />
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-center gap-2">
        <ControlBtn onClick={onRestart} title="Restart">
          <RotateCcw className="w-3.5 h-3.5" />
        </ControlBtn>

        <ControlBtn onClick={onStepBackward} title="Step Back" disabled={currentStep === 0}>
          <ChevronLeft className="w-4 h-4" />
        </ControlBtn>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isPlaying ? onPause : onPlay}
          className="w-10 h-10 rounded-full flex items-center justify-center
                     bg-gradient-to-br from-neon-blue to-neon-purple
                     text-white shadow-glow-blue hover:shadow-[0_0_30px_rgba(14,165,233,0.6)]
                     transition-shadow"
        >
          {isPlaying
            ? <Pause className="w-4 h-4" />
            : <Play className="w-4 h-4 translate-x-0.5" />}
        </motion.button>

        <ControlBtn onClick={onStepForward} title="Step Forward" disabled={currentStep >= totalSteps - 1}>
          <ChevronRight className="w-4 h-4" />
        </ControlBtn>

        <ControlBtn onClick={() => { onRestart(); }} title="Jump to End" disabled={currentStep >= totalSteps - 1}>
          <SkipForward className="w-3.5 h-3.5" onClick={(e) => { e.stopPropagation(); onJumpToStep(totalSteps - 1); }} />
        </ControlBtn>
      </div>

      {/* Speed controls */}
      <div className="flex items-center justify-center gap-1">
        <span className="text-[10px] text-slate-500 font-mono mr-1">Speed:</span>
        {SPEEDS.map(s => (
          <button
            key={s.value}
            onClick={() => onSpeedChange(s.value)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all
              ${speed === s.value
                ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/40'
                : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function ControlBtn({
  onClick,
  title,
  disabled,
  children,
}: {
  onClick: () => void;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.1 }}
      whileTap={disabled ? {} : { scale: 0.9 }}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all
        ${disabled
          ? 'text-slate-700 cursor-not-allowed'
          : 'text-slate-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10'}`}
    >
      {children}
    </motion.button>
  );
}

// Also export SkipBack usage to suppress warning
void SkipBack;
