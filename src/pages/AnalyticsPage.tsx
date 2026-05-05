import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  Title, Tooltip, Legend as ChartLegend, Filler, RadialLinearScale,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import StatsCard from '../components/analytics/StatsCard';
import { Route, TrendingUp, Zap, Clock, BarChart2, Activity } from 'lucide-react';
import { GRAPH_EDGES, ROAD_SEGMENTS, GRAPH_NODES } from '../utils/graphData';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  Title, Tooltip, ChartLegend, Filler, RadialLinearScale, ArcElement
);

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#94a3b8',
        font: { family: 'monospace', size: 11 },
        boxWidth: 12,
        padding: 12,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(10,22,40,0.95)',
      borderColor: 'rgba(14,165,233,0.3)',
      borderWidth: 1,
      titleColor: '#38bdf8',
      bodyColor: '#94a3b8',
      titleFont: { family: 'monospace', size: 12 },
      bodyFont: { family: 'monospace', size: 11 },
      padding: 10,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(30,58,95,0.5)', drawBorder: false },
      ticks: { color: '#64748b', font: { family: 'monospace', size: 10 } },
    },
    y: {
      grid: { color: 'rgba(30,58,95,0.5)', drawBorder: false },
      ticks: { color: '#64748b', font: { family: 'monospace', size: 10 } },
    },
  },
} as const;

function generateTrafficData() {
  const base = ROAD_SEGMENTS.map(r => r.traffic);
  return base.map(v => Math.min(100, Math.max(20, v + (Math.random() - 0.5) * 15)));
}

export default function AnalyticsPage() {
  const [traffic, setTraffic] = useState(generateTrafficData);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [lineHistory, setLineHistory] = useState<number[][]>(() =>
    Array.from({ length: 8 }, () => [Math.floor(Math.random() * 40 + 50)])
  );
  const [timeLabels, setTimeLabels] = useState(['Now']);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTraffic(generateTrafficData());
      setLineHistory(prev =>
        prev.map(series => [...series.slice(-11), Math.floor(Math.random() * 40 + 40)])
      );
      setTimeLabels(prev => {
        const next = [...prev, `+${prev.length * 5}s`];
        return next.slice(-12);
      });
    }, 3000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const avgToll = Math.round(GRAPH_EDGES.reduce((s, e) => s + e.toll, 0) / GRAPH_EDGES.length);
  const totalDist = GRAPH_EDGES.reduce((s, e) => s + e.distance, 0);
  const avgTraffic = Math.round(traffic.reduce((a, b) => a + b, 0) / traffic.length);

  const STATS = [
    { title: 'Avg Traffic Load',    value: `${avgTraffic}%`, subtitle: 'Live simulation',      icon: Activity,  color: 'blue'   as const, index: 0 },
    { title: 'Total Network Dist',  value: `${totalDist}km`, subtitle: 'All road segments',    icon: Route,     color: 'purple' as const, index: 1 },
    { title: 'Avg Toll/Segment',    value: `₹${avgToll}`,   subtitle: 'Per road segment',     icon: Zap,       color: 'cyan'   as const, index: 2 },
    { title: 'Peak Congestion',     value: `${Math.round(Math.max(...traffic))}%`, subtitle: 'Delhi–Muzaffarnagar', icon: TrendingUp, color: 'red' as const, index: 3 },
    { title: 'Off-Peak Segment',    value: `${Math.round(Math.min(...traffic))}%`, subtitle: 'Muzaffarnagar–Dehradun', icon: Clock, color: 'green' as const, index: 4 },
    { title: 'Network Nodes',       value: GRAPH_NODES.length, subtitle: 'Cities connected',  icon: BarChart2, color: 'amber'  as const, index: 5 },
  ];

  // Bar chart: toll comparison
  const tollData = {
    labels: GRAPH_EDGES.map(e => `${e.source[0].toUpperCase()}–${e.target[0].toUpperCase()}`),
    datasets: [
      {
        label: 'Toll (₹)',
        data: GRAPH_EDGES.map(e => e.toll),
        backgroundColor: 'rgba(168,85,247,0.7)',
        borderColor: 'rgba(168,85,247,1)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Fuel (₹)',
        data: GRAPH_EDGES.map(e => e.fuel),
        backgroundColor: 'rgba(14,165,233,0.7)',
        borderColor: 'rgba(14,165,233,1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Traffic bar chart (live)
  const trafficData = {
    labels: ROAD_SEGMENTS.map(r => r.name.split('–')[0]),
    datasets: [{
      label: 'Traffic (%)',
      data: traffic,
      backgroundColor: traffic.map(v =>
        v > 80 ? 'rgba(239,68,68,0.8)' : v > 60 ? 'rgba(245,158,11,0.8)' : 'rgba(16,185,129,0.8)'
      ),
      borderColor: traffic.map(v =>
        v > 80 ? 'rgba(239,68,68,1)' : v > 60 ? 'rgba(245,158,11,1)' : 'rgba(16,185,129,1)'
      ),
      borderWidth: 1,
      borderRadius: 4,
    }],
  };

  // Line chart: historical traffic
  const lineData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Delhi–Meerut',
        data: lineHistory[0],
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14,165,233,0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        borderWidth: 2,
      },
      {
        label: 'Del–Muzaffarnagar',
        data: lineHistory[4],
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168,85,247,0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        borderWidth: 2,
      },
      {
        label: 'Roorkee–Dehradun',
        data: lineHistory[3],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        borderWidth: 2,
      },
    ],
  };

  // Donut: distance distribution
  const donutData = {
    labels: GRAPH_EDGES.map(e => `${e.source}↔${e.target}`),
    datasets: [{
      data: GRAPH_EDGES.map(e => e.distance),
      backgroundColor: [
        'rgba(14,165,233,0.8)', 'rgba(168,85,247,0.8)', 'rgba(6,182,212,0.8)',
        'rgba(16,185,129,0.8)', 'rgba(245,158,11,0.8)', 'rgba(239,68,68,0.8)',
        'rgba(99,102,241,0.8)',
      ],
      borderColor: 'rgba(10,22,40,0.8)',
      borderWidth: 2,
      hoverBorderWidth: 3,
    }],
  };

  const CARD_CLASS = 'rounded-xl bg-navy-900/60 backdrop-blur-sm border border-white/10 overflow-hidden';

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto overflow-y-auto h-full">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-lg font-bold text-white font-mono mb-1">Analytics Dashboard</h2>
        <p className="text-xs text-slate-500 font-mono">Real-time expressway metrics with live traffic simulation</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {STATS.map(s => <StatsCard key={s.title} {...s} />)}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={CARD_CLASS}>
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white font-mono">Toll vs Fuel Cost by Segment</h3>
            <span className="text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded bg-white/5">Static</span>
          </div>
          <div className="p-4" style={{ height: 240 }}>
            <Bar data={tollData} options={{
              ...chartDefaults,
              plugins: { ...chartDefaults.plugins, legend: { ...chartDefaults.plugins.legend } },
            }} />
          </div>
        </div>

        <div className={CARD_CLASS}>
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white font-mono">Live Traffic Load</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
              <span className="text-[10px] font-mono text-neon-green">LIVE</span>
            </div>
          </div>
          <div className="p-4" style={{ height: 240 }}>
            <Bar data={trafficData} options={{
              ...chartDefaults,
              animation: { duration: 800 },
              scales: {
                ...chartDefaults.scales,
                y: { ...chartDefaults.scales.y, min: 0, max: 100 },
              },
            }} />
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`${CARD_CLASS} lg:col-span-2`}>
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white font-mono">Historical Traffic Trends</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
              <span className="text-[10px] font-mono text-neon-blue">3s updates</span>
            </div>
          </div>
          <div className="p-4" style={{ height: 240 }}>
            <Line data={lineData} options={{
              ...chartDefaults,
              animation: { duration: 600 },
            }} />
          </div>
        </div>

        <div className={CARD_CLASS}>
          <div className="px-4 py-3 border-b border-white/10">
            <h3 className="text-sm font-semibold text-white font-mono">Distance Share</h3>
          </div>
          <div className="p-4" style={{ height: 240 }}>
            <Doughnut data={donutData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right' as const,
                  labels: {
                    color: '#64748b',
                    font: { family: 'monospace', size: 9 },
                    boxWidth: 10,
                    padding: 8,
                  },
                },
                tooltip: chartDefaults.plugins.tooltip,
              },
              cutout: '60%',
            }} />
          </div>
        </div>
      </div>

      {/* Algorithm complexity table */}
      <div className={CARD_CLASS}>
        <div className="px-4 py-3 border-b border-white/10">
          <h3 className="text-sm font-semibold text-white font-mono">Algorithm Complexity Reference</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10">
                {['Algorithm', 'Category', 'Use Case', 'Time', 'Space', 'Optimal?'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] text-slate-500 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: "Dijkstra's",    cat: 'Graph',     use: 'Shortest Path',   time: 'O((V+E)logV)', space: 'O(V)',  opt: true  },
                { name: "Kruskal's",     cat: 'Graph',     use: 'Min Span Tree',   time: 'O(E log E)',   space: 'O(V)',  opt: true  },
                { name: 'Bellman-Ford',  cat: 'Graph',     use: 'Negative Cycles', time: 'O(V × E)',     space: 'O(V)',  opt: false },
                { name: 'Fenwick Tree',  cat: 'Data Str.', use: 'Prefix Sums',     time: 'O(log N)',     space: 'O(N)',  opt: true  },
                { name: 'Bloom Filter',  cat: 'Data Str.', use: 'Membership',      time: 'O(k)',         space: 'O(m)',  opt: true  },
                { name: 'Top-K (Heap)',  cat: 'Algorithm', use: 'K Largest',       time: 'O(N log K)',   space: 'O(K)',  opt: true  },
              ].map((row, i) => (
                <motion.tr
                  key={row.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-white/3 transition-colors"
                >
                  <td className="px-4 py-2.5 text-white font-semibold">{row.name}</td>
                  <td className="px-4 py-2.5 text-neon-blue">{row.cat}</td>
                  <td className="px-4 py-2.5 text-slate-400">{row.use}</td>
                  <td className="px-4 py-2.5 text-neon-purple font-bold">{row.time}</td>
                  <td className="px-4 py-2.5 text-neon-cyan">{row.space}</td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${row.opt ? 'bg-neon-green/15 text-neon-green border border-neon-green/30' : 'bg-neon-amber/15 text-neon-amber border border-neon-amber/30'}`}>
                      {row.opt ? 'Optimal' : 'Approx.'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
