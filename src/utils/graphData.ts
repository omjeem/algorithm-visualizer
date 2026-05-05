import { GraphData, GraphNode, GraphEdge, AlgorithmConfig } from '../types';

export const GRAPH_NODES: GraphNode[] = [
  { id: 'delhi',        label: 'Delhi',        x: 140, y: 430, population: 32941000, type: 'source' },
  { id: 'meerut',      label: 'Meerut',       x: 330, y: 355, population: 1424826,  type: 'intermediate' },
  { id: 'muzaffarnagar', label: 'Muzaffarnagar', x: 430, y: 255, population: 392768, type: 'intermediate' },
  { id: 'roorkee',     label: 'Roorkee',      x: 510, y: 175, population: 118354,  type: 'intermediate' },
  { id: 'dehradun',    label: 'Dehradun',     x: 620, y: 95,  population: 803983,  type: 'destination' },
];

export const GRAPH_EDGES: GraphEdge[] = [
  { id: 'e1', source: 'delhi',        target: 'meerut',        distance: 70,  toll: 85,  fuel: 105, weight: 70,  trafficMultiplier: 1.2 },
  { id: 'e2', source: 'meerut',       target: 'muzaffarnagar', distance: 60,  toll: 75,  fuel: 90,  weight: 60,  trafficMultiplier: 1.0 },
  { id: 'e3', source: 'muzaffarnagar',target: 'roorkee',       distance: 65,  toll: 80,  fuel: 98,  weight: 65,  trafficMultiplier: 1.1 },
  { id: 'e4', source: 'roorkee',      target: 'dehradun',      distance: 55,  toll: 70,  fuel: 83,  weight: 55,  trafficMultiplier: 0.9 },
  { id: 'e5', source: 'delhi',        target: 'muzaffarnagar', distance: 140, toll: 150, fuel: 210, weight: 140, trafficMultiplier: 1.3 },
  { id: 'e6', source: 'meerut',       target: 'roorkee',       distance: 120, toll: 130, fuel: 180, weight: 120, trafficMultiplier: 1.1 },
  { id: 'e7', source: 'muzaffarnagar',target: 'dehradun',      distance: 185, toll: 200, fuel: 278, weight: 185, trafficMultiplier: 1.4 },
];

export const INITIAL_GRAPH: GraphData = {
  nodes: GRAPH_NODES,
  edges: GRAPH_EDGES,
};

export const ALGORITHM_CONFIGS: AlgorithmConfig[] = [
  {
    id: 'dijkstra',
    name: "Dijkstra's Shortest Path",
    shortName: 'Dijkstra',
    description: "Find the shortest route from Delhi to Dehradun using greedy priority queue selection.",
    complexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    category: 'Graph',
    color: '#0ea5e9',
    icon: '🗺️',
  },
  {
    id: 'kruskal',
    name: "Kruskal's MST",
    shortName: 'Kruskal',
    description: "Build the Minimum Spanning Tree connecting all cities with minimum total road cost.",
    complexity: 'O(E log E)',
    spaceComplexity: 'O(V)',
    category: 'Graph',
    color: '#a855f7',
    icon: '🌲',
  },
  {
    id: 'bellmanford',
    name: 'Bellman-Ford',
    shortName: 'Bellman-Ford',
    description: "Detect optimal paths and negative weight cycles (traffic subsidies) in the road network.",
    complexity: 'O(V × E)',
    spaceComplexity: 'O(V)',
    category: 'Graph',
    color: '#f59e0b',
    icon: '⚡',
  },
  {
    id: 'fenwick',
    name: 'Fenwick Tree (BIT)',
    shortName: 'Fenwick',
    description: "Binary Indexed Tree for efficient prefix-sum toll queries across expressway segments.",
    complexity: 'O(log N)',
    spaceComplexity: 'O(N)',
    category: 'Data Structure',
    color: '#10b981',
    icon: '🌳',
  },
  {
    id: 'bloomfilter',
    name: 'Bloom Filter',
    shortName: 'Bloom Filter',
    description: "Probabilistic data structure for fast road membership queries with tunable false-positive rates.",
    complexity: 'O(k)',
    spaceComplexity: 'O(m)',
    category: 'Data Structure',
    color: '#06b6d4',
    icon: '🔮',
  },
  {
    id: 'topk',
    name: 'Top-K Roads (Heap)',
    shortName: 'Top-K',
    description: "Min-heap to efficiently rank and retrieve the K highest-traffic expressway segments.",
    complexity: 'O(N log K)',
    spaceComplexity: 'O(K)',
    category: 'Algorithm',
    color: '#ef4444',
    icon: '🏆',
  },
];

export function getEdgeId(source: string, target: string): string {
  return [source, target].sort().join('-');
}

export function getNodeById(nodes: GraphNode[], id: string): GraphNode | undefined {
  return nodes.find(n => n.id === id);
}

export function getEdgeWeight(edge: GraphEdge, metric: 'distance' | 'toll' | 'fuel'): number {
  return edge[metric];
}

export const ROAD_SEGMENTS = [
  { id: 'r1', name: 'Delhi–Meerut Expressway',        traffic: 87, toll: 85,  length: 70 },
  { id: 'r2', name: 'Meerut–Muzaffarnagar Highway',  traffic: 72, toll: 75,  length: 60 },
  { id: 'r3', name: 'Muzaffarnagar–Roorkee Bypass',  traffic: 65, toll: 80,  length: 65 },
  { id: 'r4', name: 'Roorkee–Dehradun Hill Road',    traffic: 54, toll: 70,  length: 55 },
  { id: 'r5', name: 'Delhi–Muzaffarnagar Expressway', traffic: 91, toll: 150, length: 140 },
  { id: 'r6', name: 'Meerut–Roorkee State Highway',  traffic: 48, toll: 130, length: 120 },
  { id: 'r7', name: 'Muzaffarnagar–Dehradun NH-58',  traffic: 39, toll: 200, length: 185 },
];
