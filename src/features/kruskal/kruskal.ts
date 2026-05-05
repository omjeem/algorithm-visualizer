import { GraphData, AlgorithmStep } from '../../types';

class UnionFind {
  parent: Record<string, string>;
  rank: Record<string, number>;

  constructor(nodes: string[]) {
    this.parent = {};
    this.rank = {};
    nodes.forEach(n => { this.parent[n] = n; this.rank[n] = 0; });
  }

  find(x: string): string {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }

  union(x: string, y: string): boolean {
    const rx = this.find(x), ry = this.find(y);
    if (rx === ry) return false;
    if (this.rank[rx] < this.rank[ry]) { this.parent[rx] = ry; }
    else if (this.rank[rx] > this.rank[ry]) { this.parent[ry] = rx; }
    else { this.parent[ry] = rx; this.rank[rx]++; }
    return true;
  }

  getComponents(): Record<string, string[]> {
    const comps: Record<string, string[]> = {};
    Object.keys(this.parent).forEach(n => {
      const root = this.find(n);
      if (!comps[root]) comps[root] = [];
      comps[root].push(n);
    });
    return comps;
  }
}

export function generateKruskalSteps(
  graph: GraphData,
  metric: 'distance' | 'toll' | 'fuel'
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const uf = new UnionFind(graph.nodes.map(n => n.id));

  const sortedEdges = [...graph.edges].sort((a, b) => a[metric] - b[metric]);

  const mstEdges: string[] = [];
  const rejectedEdges: string[] = [];
  let mstCost = 0;

  steps.push({
    step: 0,
    activeNodes: [],
    visitedNodes: [],
    activeEdges: [],
    rejectedEdges: [],
    finalPathNodes: [],
    finalPathEdges: [],
    distances: {},
    explanation: `Sort all ${graph.edges.length} edges by ${metric} in ascending order. Union-Find initialized with ${graph.nodes.length} components.`,
    pseudoCodeLine: 0,
    data: { sortedEdges: sortedEdges.map(e => ({ id: e.id, weight: e[metric], source: e.source, target: e.target })), mstCost: 0 },
  });

  for (const edge of sortedEdges) {
    const w = edge[metric];
    const srcRoot = uf.find(edge.source);
    const tgtRoot = uf.find(edge.target);

    steps.push({
      step: steps.length,
      activeNodes: [edge.source, edge.target],
      visitedNodes: [],
      activeEdges: [edge.id],
      rejectedEdges: [...rejectedEdges],
      finalPathNodes: [],
      finalPathEdges: [...mstEdges],
      distances: {},
      explanation: `Examining edge (${edge.source} ↔ ${edge.target}) with ${metric} = ${w}. find(${edge.source}) = ${srcRoot}, find(${edge.target}) = ${tgtRoot}.`,
      pseudoCodeLine: 2,
      data: { edge, mstCost, components: uf.getComponents() },
    });

    const accepted = uf.union(edge.source, edge.target);

    if (accepted) {
      mstEdges.push(edge.id);
      mstCost += w;

      steps.push({
        step: steps.length,
        activeNodes: [edge.source, edge.target],
        visitedNodes: [],
        activeEdges: [],
        rejectedEdges: [...rejectedEdges],
        finalPathNodes: [],
        finalPathEdges: [...mstEdges],
        distances: {},
        explanation: `✓ Accepted! No cycle formed. Union(${edge.source}, ${edge.target}). MST cost so far: ${mstCost}. MST edges: ${mstEdges.length}.`,
        pseudoCodeLine: 4,
        data: { mstCost, mstEdgeCount: mstEdges.length, components: uf.getComponents() },
      });
    } else {
      rejectedEdges.push(edge.id);

      steps.push({
        step: steps.length,
        activeNodes: [],
        visitedNodes: [],
        activeEdges: [],
        rejectedEdges: [...rejectedEdges],
        finalPathNodes: [],
        finalPathEdges: [...mstEdges],
        distances: {},
        explanation: `✗ Rejected! Edge (${edge.source} ↔ ${edge.target}) would form a cycle (both in same component: ${srcRoot}). Skip.`,
        pseudoCodeLine: 6,
        data: { mstCost, rejectedEdge: edge.id },
      });
    }

    if (mstEdges.length === graph.nodes.length - 1) break;
  }

  const mstNodeSet = new Set<string>();
  graph.edges.forEach(e => {
    if (mstEdges.includes(e.id)) { mstNodeSet.add(e.source); mstNodeSet.add(e.target); }
  });

  steps.push({
    step: steps.length,
    activeNodes: [],
    visitedNodes: [...mstNodeSet],
    activeEdges: [],
    rejectedEdges: [...rejectedEdges],
    finalPathNodes: [...mstNodeSet],
    finalPathEdges: [...mstEdges],
    distances: {},
    explanation: `MST Complete! Total ${metric} cost = ${mstCost}. Used ${mstEdges.length} edges to connect all ${graph.nodes.length} cities. Minimum spanning tree highlighted in purple!`,
    pseudoCodeLine: 8,
    data: { mstCost, mstEdges },
  });

  return steps;
}

export const KRUSKAL_PSEUDOCODE = [
  'Sort edges by weight ascending',
  'Initialize Union-Find with N components',
  'for each edge (u, v, w) in sorted order:',
  '  if find(u) ≠ find(v):',
  '    MST.add(u, v, w);  union(u, v)',
  '    mstCost += w',
  '  else:',
  '    skip — would form a cycle',
  'return MST with total cost mstCost',
];
