import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Route, Layers, Zap, TrendingUp, Map, Database,
  ArrowRight, Activity, Shield, Clock,
} from 'lucide-react';
import StatsCard from '../components/analytics/StatsCard';
import { ALGORITHM_CONFIGS, GRAPH_EDGES, ROAD_SEGMENTS } from '../utils/graphData';

const STATS = [
  { title: 'Total Road Segments',   value: 7,       subtitle: 'NH-58 Expressway',       icon: Route,     color: 'blue'   as const, trend: { value: 12, label: 'vs last month' }, index: 0 },
  { title: 'Avg Toll',              value: '₹113',  subtitle: 'Per segment',             icon: Layers,    color: 'purple' as const, trend: { value: -5, label: 'toll reduction' }, index: 1 },
  { title: 'Shortest Route',        value: '250km', subtitle: 'Delhi → Dehradun',        icon: Zap,       color: 'cyan'   as const, trend: { value: 8,  label: 'faster via Expwy' }, index: 2 },
  { title: 'Algorithms',            value: 6,       subtitle: 'Visualized',              icon: TrendingUp, color: 'green' as const, index: 3 },
  { title: 'Total Toll (MST)',       value: '₹430', subtitle: 'Min spanning tree cost',  icon: Map,       color: 'amber'  as const, index: 4 },
  { title: 'Data Structures',       value: 3,       subtitle: 'Fenwick, Bloom, Heap',    icon: Database,  color: 'red'    as const, index: 5 },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto pb-8">
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-6 lg:p-8
                   bg-gradient-to-br from-navy-800 to-navy-900
                   border border-neon-blue/25
                   shadow-[0_0_60px_rgba(14,165,233,0.08)]"
      >
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(#0ea5e920 1px, transparent 1px), linear-gradient(90deg, #0ea5e920 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
             style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)' }} />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full blur-3xl opacity-15"
             style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 mb-3"
              >
                <div className="px-2 py-1 rounded-full bg-neon-blue/15 border border-neon-blue/30">
                  <span className="text-[10px] font-mono text-neon-blue tracking-widest">INTELLIGENT TRANSPORTATION SYSTEM</span>
                </div>
              </motion.div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight">
                Delhi–Dehradun Expressway
                <br />
                <span className="text-neon-blue">Algorithm Visualization</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                An interactive platform demonstrating 6 core DSA algorithms applied to real-world
                expressway routing — from Dijkstra's shortest path to Bloom Filters for O(1) road lookups.
              </p>
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/algorithms')}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                           bg-neon-blue text-white font-medium text-sm
                           shadow-glow-blue hover:shadow-[0_0_30px_rgba(14,165,233,0.6)]
                           transition-all duration-200"
              >
                Explore Algorithms
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:min-w-[200px]">
              {[
                { icon: Activity, label: 'Live Traffic Sim', value: 'Active', color: '#10b981' },
                { icon: Shield,   label: 'System Status',   value: 'Online',  color: '#0ea5e9' },
                { icon: Clock,    label: 'Expressway Age',  value: '2024',    color: '#a855f7' },
              ].map(item => (
                <div key={item.label}
                     className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
                  <item.icon className="w-4 h-4 flex-shrink-0" style={{ color: item.color }} />
                  <div>
                    <p className="text-[10px] font-mono text-slate-500">{item.label}</p>
                    <p className="text-xs font-mono font-bold text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {STATS.map(s => (
          <StatsCard key={s.title} {...s} />
        ))}
      </div>

      {/* Algorithm cards grid */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3 font-mono">Algorithm Modules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ALGORITHM_CONFIGS.map((algo, i) => (
            <motion.div
              key={algo.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => navigate(`/algorithms?algo=${algo.id}`)}
              className="group relative overflow-hidden rounded-xl p-4 cursor-pointer
                         bg-navy-900/70 backdrop-blur-sm border border-white/10
                         hover:border-opacity-50 transition-all duration-300"
              style={{ '--hover-color': algo.color } as React.CSSProperties}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                   style={{ background: `radial-gradient(circle at top right, ${algo.color}12, transparent 60%)` }} />
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{algo.icon}</span>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                          style={{ background: `${algo.color}20`, color: algo.color, border: `1px solid ${algo.color}40` }}>
                      {algo.category}
                    </span>
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1 leading-tight">{algo.name}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-3">{algo.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-mono text-slate-600">TIME</p>
                    <p className="text-[10px] font-mono" style={{ color: algo.color }}>{algo.complexity}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Road network summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl bg-navy-900/60 border border-white/10 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <h3 className="text-sm font-semibold text-white font-mono">Road Network</h3>
          </div>
          <div className="divide-y divide-white/5">
            {GRAPH_EDGES.map(edge => (
              <div key={edge.id} className="flex items-center gap-3 px-4 py-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-blue flex-shrink-0" />
                <span className="flex-1 text-xs font-mono text-slate-400">{edge.source} ↔ {edge.target}</span>
                <div className="flex gap-3 text-[10px] font-mono">
                  <span className="text-neon-blue">{edge.distance}km</span>
                  <span className="text-neon-purple">₹{edge.toll}</span>
                  <span className="text-neon-amber">₹{edge.fuel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-navy-900/60 border border-white/10 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <h3 className="text-sm font-semibold text-white font-mono">Traffic Heatmap</h3>
          </div>
          <div className="p-4 space-y-2.5">
            {ROAD_SEGMENTS.map(road => (
              <div key={road.id} className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-500 truncate max-w-[200px]">{road.name}</span>
                  <span style={{ color: road.traffic > 80 ? '#ef4444' : road.traffic > 60 ? '#f59e0b' : '#10b981' }}>
                    {road.traffic}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-navy-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${road.traffic}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="h-full rounded-full"
                    style={{
                      background: road.traffic > 80 ? '#ef4444' : road.traffic > 60 ? '#f59e0b' : '#10b981',
                      boxShadow: road.traffic > 80 ? '0 0 6px #ef444480' : 'none',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
