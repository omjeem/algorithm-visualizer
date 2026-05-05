import { AlgorithmStep } from '../../types';

const TOLLS = [0, 85, 75, 80, 70, 150, 130, 200]; // index 0 unused

export function generateFenwickSteps(): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const n = TOLLS.length - 1; // 7 segments
  const tree = new Array(n + 1).fill(0);

  const snap = () => [...tree];

  const lowbit = (i: number) => i & -i;

  steps.push({
    step: 0,
    activeNodes: [],
    visitedNodes: [],
    activeEdges: [],
    rejectedEdges: [],
    finalPathNodes: [],
    finalPathEdges: [],
    distances: {},
    explanation: `Fenwick Tree (BIT) for toll collection. ${n} expressway segments with tolls: [${TOLLS.slice(1).join(', ')}]. Initialize tree with all zeros.`,
    pseudoCodeLine: 0,
    data: { tree: snap(), n, operation: 'init', highlightedIndices: [] },
  });

  // Build tree via updates
  for (let i = 1; i <= n; i++) {
    const val = TOLLS[i];
    const path: number[] = [];
    let j = i;

    while (j <= n) {
      path.push(j);
      j += lowbit(j);
    }

    let j2 = i;
    while (j2 <= n) {
      tree[j2] += val;
      j2 += lowbit(j2);
    }

    steps.push({
      step: steps.length,
      activeNodes: [],
      visitedNodes: [],
      activeEdges: [],
      rejectedEdges: [],
      finalPathNodes: [],
      finalPathEdges: [],
      distances: {},
      explanation: `Update segment ${i} (toll=₹${val}): propagate via lowbit path [${path.join(' → ')}]. Each index covers 2^(lsb) segments.`,
      pseudoCodeLine: 2,
      data: { tree: snap(), operation: 'update', updateIndex: i, val, highlightedIndices: path },
    });
  }

  // Prefix sum queries
  const queries = [
    { index: 4, description: 'Delhi → Roorkee prefix toll (segments 1-4)' },
    { index: 7, description: 'Delhi → Dehradun total toll (segments 1-7)' },
    { index: 2, description: 'Delhi → Muzaffarnagar prefix toll (segments 1-2)' },
  ];

  for (const q of queries) {
    let sum = 0;
    const path: number[] = [];
    let j = q.index;
    while (j > 0) {
      path.push(j);
      sum += tree[j];
      j -= lowbit(j);
    }

    steps.push({
      step: steps.length,
      activeNodes: [],
      visitedNodes: [],
      activeEdges: [],
      rejectedEdges: [],
      finalPathNodes: [],
      finalPathEdges: [],
      distances: {},
      explanation: `Query: ${q.description}. Traverse: [${path.join(' → ')}]. Prefix sum = ₹${sum}. Each step: j -= j & (-j).`,
      pseudoCodeLine: 5,
      data: { tree: snap(), operation: 'query', queryIndex: q.index, prefixSum: sum, highlightedIndices: path },
    });
  }

  // Range query (segment 3 to 5)
  const rStart = 3, rEnd = 5;
  let sumEnd = 0, sumBefore = 0;
  let je = rEnd; while (je > 0) { sumEnd += tree[je]; je -= lowbit(je); }
  let jb = rStart - 1; while (jb > 0) { sumBefore += tree[jb]; jb -= lowbit(jb); }
  const rangeSum = sumEnd - sumBefore;

  steps.push({
    step: steps.length,
    activeNodes: [],
    visitedNodes: [],
    activeEdges: [],
    rejectedEdges: [],
    finalPathNodes: [],
    finalPathEdges: [],
    distances: {},
    explanation: `Range Query segments ${rStart}–${rEnd}: prefix(${rEnd}) - prefix(${rStart-1}) = ₹${sumEnd} - ₹${sumBefore} = ₹${rangeSum}. Constant time range toll query!`,
    pseudoCodeLine: 7,
    data: { tree: snap(), operation: 'query', prefixSum: rangeSum, highlightedIndices: [rStart, rEnd], rStart, rEnd },
  });

  return steps;
}

export const FENWICK_PSEUDOCODE = [
  'tree[1..N] ← 0  // N = number of segments',
  'function update(i, delta):',
  '  while i ≤ N:',
  '    tree[i] += delta',
  '    i += i & (-i)  // next responsible index',
  'function query(i) → prefix sum [1..i]:',
  '  sum ← 0',
  '  while i > 0:',
  '    sum += tree[i]',
  '    i -= i & (-i)  // parent index',
  '  return sum',
  'rangeQuery(l, r) = query(r) - query(l-1)',
];
