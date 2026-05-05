import { GraphData, AlgorithmStep } from '../../types';

const INF = Infinity;

interface PQItem { node: string; dist: number; }

class MinPriorityQueue {
  private heap: PQItem[] = [];

  enqueue(node: string, dist: number) {
    this.heap.push({ node, dist });
    this.heap.sort((a, b) => a.dist - b.dist);
  }

  dequeue(): PQItem | undefined { return this.heap.shift(); }
  isEmpty(): boolean { return this.heap.length === 0; }
  peek(): PQItem | undefined { return this.heap[0]; }
  getAll(): PQItem[] { return [...this.heap]; }
}

function buildAdjacency(graph: GraphData, metric: 'distance' | 'toll' | 'fuel') {
  const adj: Record<string, { neighbor: string; weight: number; edgeId: string }[]> = {};
  graph.nodes.forEach(n => { adj[n.id] = []; });
  graph.edges.forEach(e => {
    const w = e[metric];
    adj[e.source].push({ neighbor: e.target, weight: w, edgeId: e.id });
    adj[e.target].push({ neighbor: e.source, weight: w, edgeId: e.id });
  });
  return adj;
}

export function generateDijkstraSteps(
  graph: GraphData,
  source: string,
  target: string,
  metric: 'distance' | 'toll' | 'fuel'
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const adj = buildAdjacency(graph, metric);
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const visited = new Set<string>();
  const pq = new MinPriorityQueue();

  graph.nodes.forEach(n => {
    dist[n.id] = n.id === source ? 0 : INF;
    prev[n.id] = null;
    pq.enqueue(n.id, dist[n.id]);
  });

  const label = (d: number) => (d === INF ? '∞' : d.toString());
  const distSnapshot = () => {
    const r: Record<string, number> = {};
    graph.nodes.forEach(n => { r[n.id] = dist[n.id]; });
    return r;
  };

  // Init step
  steps.push({
    step: 0,
    activeNodes: [source],
    visitedNodes: [],
    activeEdges: [],
    rejectedEdges: [],
    finalPathNodes: [],
    finalPathEdges: [],
    distances: distSnapshot(),
    explanation: `Initialize: set dist[${source}] = 0, all others = ∞. Push all nodes into priority queue.`,
    pseudoCodeLine: 0,
    data: { pq: pq.getAll() },
  });

  while (!pq.isEmpty()) {
    const curr = pq.dequeue()!;
    if (curr.dist > dist[curr.node]) continue;
    if (visited.has(curr.node)) continue;

    visited.add(curr.node);

    steps.push({
      step: steps.length,
      activeNodes: [curr.node],
      visitedNodes: [...visited],
      activeEdges: [],
      rejectedEdges: [],
      finalPathNodes: [],
      finalPathEdges: [],
      distances: distSnapshot(),
      explanation: `Dequeue node "${curr.node}" with dist=${label(dist[curr.node])}. Mark as visited.`,
      pseudoCodeLine: 2,
      data: { pq: pq.getAll(), currentNode: curr.node },
    });

    if (curr.node === target) break;

    for (const { neighbor, weight, edgeId } of adj[curr.node]) {
      if (visited.has(neighbor)) continue;
      const newDist = dist[curr.node] + weight;

      steps.push({
        step: steps.length,
        activeNodes: [curr.node, neighbor],
        visitedNodes: [...visited],
        activeEdges: [edgeId],
        rejectedEdges: [],
        finalPathNodes: [],
        finalPathEdges: [],
        distances: distSnapshot(),
        explanation: `Relax edge (${curr.node} → ${neighbor}): dist[${neighbor}] = min(${label(dist[neighbor])}, ${label(dist[curr.node])} + ${weight} = ${newDist}).`,
        pseudoCodeLine: 4,
        data: { relaxing: neighbor, oldDist: dist[neighbor], newDist, pq: pq.getAll() },
      });

      if (newDist < dist[neighbor]) {
        dist[neighbor] = newDist;
        prev[neighbor] = curr.node;
        pq.enqueue(neighbor, newDist);

        steps.push({
          step: steps.length,
          activeNodes: [neighbor],
          visitedNodes: [...visited],
          activeEdges: [edgeId],
          rejectedEdges: [],
          finalPathNodes: [],
          finalPathEdges: [],
          distances: distSnapshot(),
          explanation: `Updated! dist[${neighbor}] = ${newDist}. Priority queue updated.`,
          pseudoCodeLine: 5,
          data: { updated: neighbor, newDist, pq: pq.getAll() },
        });
      }
    }
  }

  // Reconstruct path
  const pathNodes: string[] = [];
  const pathEdges: string[] = [];
  let cur: string | null = target;

  while (cur) {
    pathNodes.unshift(cur);
    const p = prev[cur];
    if (p) {
      const edge = graph.edges.find(
        e => (e.source === p && e.target === cur) || (e.target === p && e.source === cur)
      );
      if (edge) pathEdges.unshift(edge.id);
    }
    cur = prev[cur];
  }

  if (dist[target] !== INF) {
    steps.push({
      step: steps.length,
      activeNodes: [],
      visitedNodes: [...visited],
      activeEdges: [],
      rejectedEdges: [],
      finalPathNodes: pathNodes,
      finalPathEdges: pathEdges,
      distances: distSnapshot(),
      explanation: `Shortest path found: ${pathNodes.join(' → ')} with total ${metric} = ${dist[target]}. Route highlighted in gold!`,
      pseudoCodeLine: 7,
      data: { pathNodes, totalDist: dist[target] },
    });
  }

  return steps;
}

export const DIJKSTRA_PSEUDOCODE = [
  'dist[source] ← 0;  dist[v] ← ∞ for all v ≠ source',
  'PQ.enqueue(source, 0)',
  'u ← PQ.dequeue()  // lowest dist node',
  'if u === target → return dist, path',
  'for each neighbor v of u:',
  '  if dist[u] + w(u,v) < dist[v]:',
  '    dist[v] ← dist[u] + w(u,v)',
  '    prev[v] ← u;  PQ.enqueue(v, dist[v])',
  'Reconstruct path via prev[] pointers',
];
