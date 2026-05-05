import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, ChevronDown, ChevronUp } from 'lucide-react';
import GraphCanvas from '../components/graph/GraphCanvas';
import ControlPanel from '../components/algorithm/ControlPanel';
import PseudoCodePanel from '../components/algorithm/PseudoCodePanel';
import ExplanationPanel from '../components/algorithm/ExplanationPanel';
import Legend from '../components/algorithm/Legend';
import DijkstraVisualizer from '../features/dijkstra/DijkstraVisualizer';
import KruskalVisualizer from '../features/kruskal/KruskalVisualizer';
import BellmanFordVisualizer from '../features/bellmanford/BellmanFordVisualizer';
import FenwickVisualizer from '../features/fenwick/FenwickVisualizer';
import BloomFilterVisualizer from '../features/bloomfilter/BloomFilterVisualizer';
import TopKVisualizer from '../features/topk/TopKVisualizer';
import { useAlgorithm } from '../hooks/useAlgorithm';
import { useAnimation } from '../hooks/useAnimation';
import { ALGORITHM_CONFIGS, INITIAL_GRAPH, GRAPH_NODES } from '../utils/graphData';
import { AlgorithmType } from '../types';
import { DIJKSTRA_PSEUDOCODE } from '../features/dijkstra/dijkstra';
import { KRUSKAL_PSEUDOCODE } from '../features/kruskal/kruskal';
import { BELLMAN_FORD_PSEUDOCODE } from '../features/bellmanford/bellmanford';
import { FENWICK_PSEUDOCODE } from '../features/fenwick/fenwick';
import { BLOOM_FILTER_PSEUDOCODE } from '../features/bloomfilter/bloomfilter';
import { TOPK_PSEUDOCODE } from '../features/topk/topk';

const PSEUDOCODE_MAP: Record<AlgorithmType, string[]> = {
  dijkstra: DIJKSTRA_PSEUDOCODE,
  kruskal: KRUSKAL_PSEUDOCODE,
  bellmanford: BELLMAN_FORD_PSEUDOCODE,
  fenwick: FENWICK_PSEUDOCODE,
  bloomfilter: BLOOM_FILTER_PSEUDOCODE,
  topk: TOPK_PSEUDOCODE,
};

const GRAPH_ALGORITHMS: AlgorithmType[] = ['dijkstra', 'kruskal', 'bellmanford'];

function AlgorithmSpecificVisualizer({
  algorithmType,
  currentStep,
  metric,
}: {
  algorithmType: AlgorithmType;
  currentStep: ReturnType<typeof useAlgorithm>['steps'][0] | null;
  metric: 'distance' | 'toll' | 'fuel';
}) {
  switch (algorithmType) {
    case 'dijkstra':    return <DijkstraVisualizer currentStep={currentStep} />;
    case 'kruskal':     return <KruskalVisualizer currentStep={currentStep} metric={metric} />;
    case 'bellmanford': return <BellmanFordVisualizer currentStep={currentStep} />;
    case 'fenwick':     return <FenwickVisualizer currentStep={currentStep} />;
    case 'bloomfilter': return <BloomFilterVisualizer currentStep={currentStep} />;
    case 'topk':        return <TopKVisualizer currentStep={currentStep} />;
    default:            return null;
  }
}

export default function AlgorithmsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSettings, setShowSettings] = useState(false);
  const algoParam = searchParams.get('algo') as AlgorithmType | null;

  const {
    steps,
    algorithmType,
    setAlgorithmType,
    source,
    setSource,
    target,
    setTarget,
    weightMetric,
    setWeightMetric,
  } = useAlgorithm();

  const {
    currentStepIndex,
    isPlaying,
    speed,
    currentStep,
    totalSteps,
    play,
    pause,
    stepForward,
    stepBackward,
    restart,
    jumpToStep,
    setSpeed,
    progress,
  } = useAnimation(steps);

  const isGraphAlgo = GRAPH_ALGORITHMS.includes(algorithmType);
  const algoConfig = ALGORITHM_CONFIGS.find(a => a.id === algorithmType)!;

  useEffect(() => {
    if (algoParam && ALGORITHM_CONFIGS.some(a => a.id === algoParam)) {
      setAlgorithmType(algoParam);
    }
  }, [algoParam, setAlgorithmType]);

  const handleAlgoChange = (id: AlgorithmType) => {
    setAlgorithmType(id);
    setSearchParams({ algo: id });
    restart();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Algorithm selector tabs */}
      <div className="flex-shrink-0 px-3 pt-3 pb-0">
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
          {ALGORITHM_CONFIGS.map(algo => (
            <motion.button
              key={algo.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAlgoChange(algo.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap
                          border transition-all duration-200 flex-shrink-0
                ${algorithmType === algo.id
                  ? 'text-white border-opacity-60 shadow-lg'
                  : 'text-slate-500 bg-navy-900/40 border-white/10 hover:text-white hover:bg-white/5'}`}
              style={algorithmType === algo.id ? {
                background: `${algo.color}20`,
                borderColor: `${algo.color}60`,
                boxShadow: `0 0 16px ${algo.color}25`,
                color: algo.color,
              } : {}}
            >
              <span>{algo.icon}</span>
              <span>{algo.shortName}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-3 p-3 min-h-0">
        {/* Left: graph + controls */}
        <div className="flex flex-col gap-3 min-h-0 overflow-hidden">
          {/* Graph area (for graph algorithms) or algorithm-specific header */}
          <div className="flex-shrink-0 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{algoConfig.icon}</span>
                <h2 className="text-base font-bold text-white">{algoConfig.name}</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                      style={{ background: `${algoConfig.color}20`, color: algoConfig.color, border: `1px solid ${algoConfig.color}40` }}>
                  {algoConfig.complexity}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{algoConfig.description}</p>
            </div>
            {(isGraphAlgo) && (
              <button
                onClick={() => setShowSettings(s => !s)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all flex-shrink-0
                  ${showSettings ? 'text-neon-blue bg-neon-blue/10 border-neon-blue/30' : 'text-slate-500 border-white/10 hover:text-white'}`}
              >
                <Settings2 className="w-3.5 h-3.5" />
                Config
                {showSettings ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>

          {/* Settings panel */}
          <AnimatePresence>
            {showSettings && isGraphAlgo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-3 p-3 rounded-xl bg-navy-900/60 border border-white/10">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Source</label>
                    <select
                      value={source}
                      onChange={e => setSource(e.target.value)}
                      className="bg-navy-800 border border-white/15 text-white text-xs font-mono rounded-lg px-2 py-1.5 focus:outline-none focus:border-neon-blue/50"
                    >
                      {GRAPH_NODES.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                    </select>
                  </div>
                  {algorithmType !== 'kruskal' && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Target</label>
                      <select
                        value={target}
                        onChange={e => setTarget(e.target.value)}
                        className="bg-navy-800 border border-white/15 text-white text-xs font-mono rounded-lg px-2 py-1.5 focus:outline-none focus:border-neon-blue/50"
                      >
                        {GRAPH_NODES.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                      </select>
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Metric</label>
                    <select
                      value={weightMetric}
                      onChange={e => setWeightMetric(e.target.value as 'distance' | 'toll' | 'fuel')}
                      className="bg-navy-800 border border-white/15 text-white text-xs font-mono rounded-lg px-2 py-1.5 focus:outline-none focus:border-neon-blue/50"
                    >
                      <option value="distance">Distance (km)</option>
                      <option value="toll">Toll (₹)</option>
                      <option value="fuel">Fuel Cost (₹)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Graph canvas or data-structure panel */}
          {isGraphAlgo ? (
            <div className="flex-1 min-h-0 rounded-xl overflow-hidden
                            bg-navy-900/40 backdrop-blur-sm border border-white/10
                            shadow-[0_0_40px_rgba(0,0,0,0.3)]">
              <GraphCanvas
                graphData={INITIAL_GRAPH}
                currentStep={currentStep}
                algorithmType={algorithmType}
              />
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto">
              <AlgorithmSpecificVisualizer
                algorithmType={algorithmType}
                currentStep={currentStep}
                metric={weightMetric}
              />
            </div>
          )}

          {/* Controls */}
          <div className="flex-shrink-0">
            <ControlPanel
              isPlaying={isPlaying}
              speed={speed}
              currentStep={currentStepIndex}
              totalSteps={totalSteps}
              progress={progress}
              onPlay={play}
              onPause={pause}
              onStepForward={stepForward}
              onStepBackward={stepBackward}
              onRestart={restart}
              onJumpToStep={jumpToStep}
              onSpeedChange={setSpeed}
            />
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-3 min-h-0 overflow-y-auto lg:overflow-hidden">
          {/* Explanation */}
          <div className="flex-shrink-0">
            <ExplanationPanel
              explanation={currentStep?.explanation ?? 'Select an algorithm and press Play to begin visualization.'}
              stepIndex={currentStepIndex}
              totalSteps={totalSteps}
              color={algoConfig.color}
              data={currentStep?.data}
            />
          </div>

          {/* Algorithm-specific panel (for graph algorithms show in right; DS algorithms already in left) */}
          {isGraphAlgo && (
            <div className="flex-1 min-h-0 overflow-y-auto">
              <AlgorithmSpecificVisualizer
                algorithmType={algorithmType}
                currentStep={currentStep}
                metric={weightMetric}
              />
            </div>
          )}

          {/* Pseudocode */}
          <div className="flex-shrink-0 h-52 lg:h-60">
            <PseudoCodePanel
              lines={PSEUDOCODE_MAP[algorithmType]}
              activeLine={currentStep?.pseudoCodeLine ?? -1}
              title={algoConfig.shortName}
              color={algoConfig.color}
            />
          </div>

          {/* Legend */}
          <div className="flex-shrink-0">
            <Legend algorithmType={algorithmType} />
          </div>
        </div>
      </div>
    </div>
  );
}
