import { AlgorithmType } from '../../types';

interface LegendProps {
  algorithmType: AlgorithmType;
}

interface LegendItem {
  color: string;
  stroke?: string;
  label: string;
  shape: 'circle' | 'line' | 'dashed';
}

const LEGENDS: Record<AlgorithmType, LegendItem[]> = {
  dijkstra: [
    { color: '#10b981', label: 'Source (Delhi)',      shape: 'circle' },
    { color: '#ef4444', label: 'Destination',         shape: 'circle' },
    { color: '#0ea5e9', label: 'Active / Dequeued',   shape: 'circle' },
    { color: '#7c3aed', label: 'Visited',             shape: 'circle' },
    { color: '#f59e0b', label: 'Shortest Path',       shape: 'circle' },
    { color: '#f59e0b', label: 'Final Route',         shape: 'dashed' },
    { color: '#0ea5e9', label: 'Relaxing Edge',       shape: 'line'   },
  ],
  kruskal: [
    { color: '#10b981', label: 'Source (Delhi)',      shape: 'circle' },
    { color: '#ef4444', label: 'Destination',         shape: 'circle' },
    { color: '#0ea5e9', label: 'Examining Edge',      shape: 'line'   },
    { color: '#a855f7', label: 'MST Edge (Accepted)', shape: 'line'   },
    { color: '#374151', label: 'Rejected (Cycle)',    shape: 'line'   },
    { color: '#7c3aed', label: 'MST Node',            shape: 'circle' },
  ],
  bellmanford: [
    { color: '#10b981', label: 'Source (Delhi)',      shape: 'circle' },
    { color: '#ef4444', label: 'Destination',         shape: 'circle' },
    { color: '#0ea5e9', label: 'Active Nodes',        shape: 'circle' },
    { color: '#0ea5e9', label: 'Relaxing Edge',       shape: 'line'   },
    { color: '#f59e0b', label: 'Final Path',          shape: 'dashed' },
    { color: '#ef4444', label: 'Negative Cycle',      shape: 'line'   },
  ],
  fenwick: [
    { color: '#10b981', label: 'Active Index',        shape: 'circle' },
    { color: '#0ea5e9', label: 'Update Path',         shape: 'line'   },
    { color: '#a855f7', label: 'Query Path',          shape: 'line'   },
    { color: '#f59e0b', label: 'Result',              shape: 'circle' },
  ],
  bloomfilter: [
    { color: '#0ea5e9', label: 'Set Bit (1)',         shape: 'circle' },
    { color: '#374151', label: 'Unset Bit (0)',       shape: 'circle' },
    { color: '#10b981', label: 'True Positive',       shape: 'circle' },
    { color: '#ef4444', label: 'False Positive',      shape: 'circle' },
    { color: '#f59e0b', label: 'Definitely Not',      shape: 'circle' },
  ],
  topk: [
    { color: '#0ea5e9', label: 'Heap Min',            shape: 'circle' },
    { color: '#10b981', label: 'New Element',         shape: 'circle' },
    { color: '#ef4444', label: 'Removed (too small)', shape: 'circle' },
    { color: '#f59e0b', label: 'Top-K Result',        shape: 'circle' },
  ],
};

export default function Legend({ algorithmType }: LegendProps) {
  const items = LEGENDS[algorithmType] ?? [];

  return (
    <div className="rounded-xl bg-navy-900/60 backdrop-blur-sm border border-white/10 p-3">
      <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2">Legend</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            {item.shape === 'circle' && (
              <div
                className="w-3.5 h-3.5 rounded-full flex-shrink-0 border"
                style={{ background: item.color, borderColor: `${item.color}80` }}
              />
            )}
            {item.shape === 'line' && (
              <div className="w-5 h-0.5 flex-shrink-0 rounded" style={{ background: item.color }} />
            )}
            {item.shape === 'dashed' && (
              <div
                className="w-5 h-0.5 flex-shrink-0 rounded"
                style={{ background: `repeating-linear-gradient(90deg, ${item.color} 0, ${item.color} 4px, transparent 4px, transparent 8px)` }}
              />
            )}
            <span className="text-[10px] text-slate-400 font-mono leading-tight">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
