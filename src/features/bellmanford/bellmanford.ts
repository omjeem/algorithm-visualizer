import { GraphData, AlgorithmStep } from '../../types';

const INF = Infinity;

export function generateBellmanFordSteps(
  graph: GraphData,
  source: string,
  target: string,
  metric: 'distance' | 'toll' | 'fuel'
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const V = graph.nodes.length;
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};

  graph.nodes.forEach(n => {
    dist[n.id] = n.id === source ? 0 : INF;
    prev[n.id] = null;
  });

  const label = (d: number) => (d === INF ? '∞' : d.toString());
  const distSnap = () => {
    const r: Record<string, number> = {};
    graph.nodes.forEach(n => { r[n.id] = dist[n.id]; });
    return r;
  };

  steps.push({
    step: 0,
    activeNodes: [source],
    visitedNodes: [],
    activeEdges: [],
    rejectedEdges: [],
    finalPathNodes: [],
    finalPathEdges: [],
    distances: distSnap(),
    explanation: `Initialize Bellman-Ford: dist[${source}] = 0, all others = ∞. Will relax all edges V-1 = ${V - 1} times.`,
    pseudoCodeLine: 0,
    data: { iteration: 0 },
  });

  // Directed edges (bidirectional)
  const directedEdges: { source: string; target: string; weight: number; id: string }[] = [];
  graph.edges.forEach(e => {
    directedEdges.push({ source: e.source, target: e.target, weight: e[metric], id: e.id });
    directedEdges.push({ source: e.target, target: e.source, weight: e[metric], id: e.id });
  });

  for (let iter = 1; iter <= V - 1; iter++) {
    let updatedAny = false;

    steps.push({
      step: steps.length,
      activeNodes: [],
      visitedNodes: [],
      activeEdges: [],
      rejectedEdges: [],
      finalPathNodes: [],
      finalPathEdges: [],
      distances: distSnap(),
      explanation: `=== Iteration ${iter} of ${V - 1} === Relaxing all edges…`,
      pseudoCodeLine: 2,
      data: { iteration: iter },
    });

    for (const edge of directedEdges) {
      if (dist[edge.source] === INF) continue;
      const newDist = dist[edge.source] + edge.weight;

      if (newDist < dist[edge.target]) {
        const oldDist = dist[edge.target];
        dist[edge.target] = newDist;
        prev[edge.target] = edge.source;
        updatedAny = true;

        steps.push({
          step: steps.length,
          activeNodes: [edge.source, edge.target],
          visitedNodes: [],
          activeEdges: [edge.id],
          rejectedEdges: [],
          finalPathNodes: [],
          finalPathEdges: [],
          distances: distSnap(),
          explanation: `Iter ${iter}: Relax (${edge.source}→${edge.target}): ${label(oldDist)} > ${label(dist[edge.source])} + ${edge.weight} = ${newDist}. Update dist[${edge.target}] = ${newDist}.`,
          pseudoCodeLine: 4,
          data: { iteration: iter, updated: edge.target },
        });
      }
    }

    if (!updatedAny) {
      steps.push({
        step: steps.length,
        activeNodes: [],
        visitedNodes: graph.nodes.map(n => n.id),
        activeEdges: [],
        rejectedEdges: [],
        finalPathNodes: [],
        finalPathEdges: [],
        distances: distSnap(),
        explanation: `Early termination at iteration ${iter}: No updates in this pass. Algorithm converged!`,
        pseudoCodeLine: 5,
        data: { iteration: iter, earlyTermination: true },
      });
      break;
    }
  }

  // Check for negative cycles
  let negativeCycleEdge: string | null = null;
  for (const edge of directedEdges) {
    if (dist[edge.source] !== INF && dist[edge.source] + edge.weight < dist[edge.target]) {
      negativeCycleEdge = edge.id;
      break;
    }
  }

  if (negativeCycleEdge) {
    steps.push({
      step: steps.length,
      activeNodes: [],
      visitedNodes: [],
      activeEdges: [negativeCycleEdge],
      rejectedEdges: [],
      finalPathNodes: [],
      finalPathEdges: [],
      distances: distSnap(),
      explanation: `⚠️ Negative cycle detected! Edge still relaxes on iteration V. This means infinite cost reduction — a traffic subsidy loop exists!`,
      pseudoCodeLine: 7,
      data: { negativeCycle: true, cycleEdge: negativeCycleEdge },
    });
    return steps;
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

  steps.push({
    step: steps.length,
    activeNodes: [],
    visitedNodes: graph.nodes.map(n => n.id),
    activeEdges: [],
    rejectedEdges: [],
    finalPathNodes: pathNodes,
    finalPathEdges: pathEdges,
    distances: distSnap(),
    explanation: `Bellman-Ford complete! No negative cycles. Shortest path: ${pathNodes.join(' → ')}. Total ${metric} = ${dist[target]}.`,
    pseudoCodeLine: 8,
    data: { pathNodes, totalDist: dist[target] },
  });

  return steps;
}

export const BELLMAN_FORD_PSEUDOCODE = [
  'dist[source] ← 0;  dist[v] ← ∞ for all v ≠ source',
  'prev[v] ← null for all v',
  'for i = 1 to V-1:',
  '  for each edge (u, v, w):',
  '    if dist[u] + w < dist[v]:',
  '      dist[v] ← dist[u] + w',
  '      prev[v] ← u',
  'for each edge (u, v, w):',
  '  if dist[u] + w < dist[v]: negative cycle!',
];
