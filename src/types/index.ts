export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  population?: number;
  type: 'source' | 'destination' | 'intermediate';
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  distance: number;
  toll: number;
  fuel: number;
  weight: number;
  trafficMultiplier?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface AlgorithmStep {
  step: number;
  activeNodes: string[];
  visitedNodes: string[];
  activeEdges: string[];
  rejectedEdges: string[];
  finalPathNodes: string[];
  finalPathEdges: string[];
  distances: Record<string, number>;
  explanation: string;
  pseudoCodeLine: number;
  data?: Record<string, unknown>;
}

export type AlgorithmType =
  | 'dijkstra'
  | 'kruskal'
  | 'bellmanford'
  | 'fenwick'
  | 'bloomfilter'
  | 'topk';

export type AnimationSpeed = 0.25 | 0.5 | 1 | 2;

export interface AlgorithmConfig {
  id: AlgorithmType;
  name: string;
  shortName: string;
  description: string;
  complexity: string;
  spaceComplexity: string;
  category: string;
  color: string;
  icon: string;
}

export interface FenwickStep extends AlgorithmStep {
  tree: number[];
  queryIndex?: number;
  updateIndex?: number;
  prefixSum?: number;
  highlightedIndices: number[];
  operation: 'update' | 'query' | 'init';
}

export interface BloomFilterStep extends AlgorithmStep {
  bitArray: boolean[];
  hashResults: number[][];
  queryWord?: string;
  result?: 'possible' | 'definitely_not' | 'false_positive';
  currentHash?: number;
}

export interface TopKStep extends AlgorithmStep {
  heap: { road: string; score: number }[];
  rankings: { road: string; score: number }[];
  comparing?: number[];
  swapping?: number[];
}

export interface PseudoCodeDef {
  lines: string[];
  highlights?: Record<number, string[]>;
}
