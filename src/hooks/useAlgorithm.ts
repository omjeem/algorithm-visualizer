import { useState, useMemo } from 'react';
import { AlgorithmType, AlgorithmStep } from '../types';
import { INITIAL_GRAPH } from '../utils/graphData';
import { generateDijkstraSteps } from '../features/dijkstra/dijkstra';
import { generateKruskalSteps } from '../features/kruskal/kruskal';
import { generateBellmanFordSteps } from '../features/bellmanford/bellmanford';
import { generateFenwickSteps } from '../features/fenwick/fenwick';
import { generateBloomFilterSteps } from '../features/bloomfilter/bloomfilter';
import { generateTopKSteps } from '../features/topk/topk';

interface UseAlgorithmReturn {
  steps: AlgorithmStep[];
  algorithmType: AlgorithmType;
  setAlgorithmType: (type: AlgorithmType) => void;
  source: string;
  setSource: (id: string) => void;
  target: string;
  setTarget: (id: string) => void;
  weightMetric: 'distance' | 'toll' | 'fuel';
  setWeightMetric: (m: 'distance' | 'toll' | 'fuel') => void;
}

export function useAlgorithm(): UseAlgorithmReturn {
  const [algorithmType, setAlgorithmType] = useState<AlgorithmType>('dijkstra');
  const [source, setSource] = useState<string>('delhi');
  const [target, setTarget] = useState<string>('dehradun');
  const [weightMetric, setWeightMetric] = useState<'distance' | 'toll' | 'fuel'>('distance');

  const steps = useMemo<AlgorithmStep[]>(() => {
    switch (algorithmType) {
      case 'dijkstra':
        return generateDijkstraSteps(INITIAL_GRAPH, source, target, weightMetric);
      case 'kruskal':
        return generateKruskalSteps(INITIAL_GRAPH, weightMetric);
      case 'bellmanford':
        return generateBellmanFordSteps(INITIAL_GRAPH, source, target, weightMetric);
      case 'fenwick':
        return generateFenwickSteps();
      case 'bloomfilter':
        return generateBloomFilterSteps();
      case 'topk':
        return generateTopKSteps();
      default:
        return [];
    }
  }, [algorithmType, source, target, weightMetric]);

  return {
    steps,
    algorithmType,
    setAlgorithmType,
    source,
    setSource,
    target,
    setTarget,
    weightMetric,
    setWeightMetric,
  };
}
