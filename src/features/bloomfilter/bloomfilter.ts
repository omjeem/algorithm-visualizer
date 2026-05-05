import { AlgorithmStep } from '../../types';

const BIT_ARRAY_SIZE = 20;
const NUM_HASHES = 3;

function hash1(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return ((h >>> 0) % BIT_ARRAY_SIZE);
}

function hash2(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % BIT_ARRAY_SIZE;
}

function hash3(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h % BIT_ARRAY_SIZE;
}

function getHashes(s: string): number[] {
  return [hash1(s), hash2(s), hash3(s)];
}

const KNOWN_ROADS = [
  'Delhi-Meerut Expressway',
  'Meerut-Muzaffarnagar Highway',
  'Muzaffarnagar-Roorkee Bypass',
  'Roorkee-Dehradun Hill Road',
];

const QUERY_ROADS = [
  { name: 'Delhi-Meerut Expressway', shouldExist: true },
  { name: 'Haridwar-Rishikesh Road', shouldExist: false },
  { name: 'Roorkee-Dehradun Hill Road', shouldExist: true },
  { name: 'Agra-Mathura Highway', shouldExist: false },
  { name: 'Meerut-Ghaziabad Bypass', shouldExist: false },
];

export function generateBloomFilterSteps(): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const bits = new Array(BIT_ARRAY_SIZE).fill(false);

  steps.push({
    step: 0,
    activeNodes: [],
    visitedNodes: [],
    activeEdges: [],
    rejectedEdges: [],
    finalPathNodes: [],
    finalPathEdges: [],
    distances: {},
    explanation: `Initialize Bloom Filter: ${BIT_ARRAY_SIZE}-bit array, all zeros. Using ${NUM_HASHES} independent hash functions. Space-efficient probabilistic membership test.`,
    pseudoCodeLine: 0,
    data: { bits: [...bits], hashResults: [], operation: 'init', highlightedIndices: [] },
  });

  // Insert known roads
  for (const road of KNOWN_ROADS) {
    const hashes = getHashes(road);

    steps.push({
      step: steps.length,
      activeNodes: [],
      visitedNodes: [],
      activeEdges: [],
      rejectedEdges: [],
      finalPathNodes: [],
      finalPathEdges: [],
      distances: {},
      explanation: `INSERT "${road}": Compute ${NUM_HASHES} hash positions: h1=${hashes[0]}, h2=${hashes[1]}, h3=${hashes[2]}. Setting bits at these positions to 1.`,
      pseudoCodeLine: 2,
      data: { bits: [...bits], hashResults: [hashes], operation: 'insert', queryWord: road, highlightedIndices: hashes, currentHash: -1 },
    });

    for (let k = 0; k < hashes.length; k++) {
      bits[hashes[k]] = true;
      steps.push({
        step: steps.length,
        activeNodes: [],
        visitedNodes: [],
        activeEdges: [],
        rejectedEdges: [],
        finalPathNodes: [],
        finalPathEdges: [],
        distances: {},
        explanation: `Set bit[${hashes[k]}] = 1 using h${k + 1}("${road}").`,
        pseudoCodeLine: 3,
        data: { bits: [...bits], hashResults: [hashes], operation: 'insert', queryWord: road, highlightedIndices: [hashes[k]], currentHash: k },
      });
    }
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
    explanation: `All ${KNOWN_ROADS.length} roads inserted. Now testing membership queries — some may produce false positives!`,
    pseudoCodeLine: 4,
    data: { bits: [...bits], hashResults: [], operation: 'init', highlightedIndices: [] },
  });

  // Query roads
  for (const qr of QUERY_ROADS) {
    const hashes = getHashes(qr.name);
    const allSet = hashes.every(h => bits[h]);
    const result: 'possible' | 'definitely_not' | 'false_positive' =
      !allSet ? 'definitely_not' : qr.shouldExist ? 'possible' : 'false_positive';

    steps.push({
      step: steps.length,
      activeNodes: [],
      visitedNodes: [],
      activeEdges: [],
      rejectedEdges: [],
      finalPathNodes: [],
      finalPathEdges: [],
      distances: {},
      explanation: `QUERY "${qr.name}": Check bits at h1=${hashes[0]}(${bits[hashes[0]] ? '1' : '0'}), h2=${hashes[1]}(${bits[hashes[1]] ? '1' : '0'}), h3=${hashes[2]}(${bits[hashes[2]] ? '1' : '0'}).
Result: ${result === 'definitely_not' ? '✗ DEFINITELY NOT in set (at least one 0)' : result === 'possible' ? '✓ POSSIBLY in set (all 1s, true positive)' : '⚠️ FALSE POSITIVE! All 1s but road not in set!'}`,
      pseudoCodeLine: 6,
      data: {
        bits: [...bits],
        hashResults: [hashes],
        operation: 'query',
        queryWord: qr.name,
        result,
        highlightedIndices: hashes,
        allSet,
        shouldExist: qr.shouldExist,
      },
    });
  }

  return steps;
}

export const BLOOM_FILTER_PSEUDOCODE = [
  'bitArray[0..m-1] ← 0  // m = bit array size',
  'k hash functions: h1, h2, h3',
  'function insert(element):',
  '  for i = 1 to k: bitArray[hi(element)] ← 1',
  'function query(element) → bool:',
  '  for i = 1 to k:',
  '    if bitArray[hi(element)] == 0: return false',
  '  return true  // possibly in set (may be false +)',
  'False positive rate: (1 - e^(-kn/m))^k',
];
