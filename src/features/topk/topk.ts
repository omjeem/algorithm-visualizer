import { AlgorithmStep } from '../../types';
import { ROAD_SEGMENTS } from '../../utils/graphData';

interface HeapItem { road: string; score: number; }

class MinHeap {
  private data: HeapItem[] = [];

  get size() { return this.data.length; }
  peek(): HeapItem | undefined { return this.data[0]; }
  getAll(): HeapItem[] { return [...this.data]; }

  push(item: HeapItem) {
    this.data.push(item);
    this._bubbleUp(this.data.length - 1);
  }

  pop(): HeapItem | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this._sinkDown(0);
    }
    return top;
  }

  _bubbleUp(i: number) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.data[parent].score > this.data[i].score) {
        [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
        i = parent;
      } else break;
    }
  }

  _sinkDown(i: number) {
    const n = this.data.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.data[l].score < this.data[smallest].score) smallest = l;
      if (r < n && this.data[r].score < this.data[smallest].score) smallest = r;
      if (smallest !== i) {
        [this.data[smallest], this.data[i]] = [this.data[i], this.data[smallest]];
        i = smallest;
      } else break;
    }
  }
}

const K = 4; // top-K roads

export function generateTopKSteps(): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const heap = new MinHeap();
  const sortedRankings: HeapItem[] = [];

  steps.push({
    step: 0,
    activeNodes: [],
    visitedNodes: [],
    activeEdges: [],
    rejectedEdges: [],
    finalPathNodes: [],
    finalPathEdges: [],
    distances: {},
    explanation: `Top-K Expressway Segments using Min-Heap. K=${K}. Processing ${ROAD_SEGMENTS.length} road segments by traffic score. Min-heap ensures O(N log K) time.`,
    pseudoCodeLine: 0,
    data: { heap: [], rankings: [], k: K },
  });

  for (const road of ROAD_SEGMENTS) {
    const item: HeapItem = { road: road.name, score: road.traffic };

    if (heap.size < K) {
      heap.push(item);
      steps.push({
        step: steps.length,
        activeNodes: [],
        visitedNodes: [],
        activeEdges: [],
        rejectedEdges: [],
        finalPathNodes: [],
        finalPathEdges: [],
        distances: {},
        explanation: `Heap size (${heap.size-1}) < K=${K}: Push "${road.name}" (traffic=${road.traffic}) directly. Min-heap: [${heap.getAll().map(h => h.score).join(', ')}].`,
        pseudoCodeLine: 2,
        data: { heap: heap.getAll(), rankings: [], comparing: [heap.size - 1] },
      });
    } else if (road.traffic > heap.peek()!.score) {
      const removed = heap.peek()!;
      heap.pop();
      heap.push(item);
      steps.push({
        step: steps.length,
        activeNodes: [],
        visitedNodes: [],
        activeEdges: [],
        rejectedEdges: [],
        finalPathNodes: [],
        finalPathEdges: [],
        distances: {},
        explanation: `"${road.name}" (score=${road.traffic}) > heap min (${removed.score}). Replace min with new road. Updated heap: [${heap.getAll().map(h => h.score).join(', ')}].`,
        pseudoCodeLine: 4,
        data: { heap: heap.getAll(), rankings: [], swapping: [0], removed: removed.road },
      });
    } else {
      steps.push({
        step: steps.length,
        activeNodes: [],
        visitedNodes: [],
        activeEdges: [],
        rejectedEdges: [],
        finalPathNodes: [],
        finalPathEdges: [],
        distances: {},
        explanation: `"${road.name}" (score=${road.traffic}) ≤ heap min (${heap.peek()!.score}). Skip — not in top-${K}. Heap unchanged.`,
        pseudoCodeLine: 6,
        data: { heap: heap.getAll(), rankings: [], comparing: [] },
      });
    }
  }

  // Extract all from heap to get sorted rankings
  const tempItems: HeapItem[] = heap.getAll();
  tempItems.sort((a, b) => b.score - a.score);
  sortedRankings.push(...tempItems);

  steps.push({
    step: steps.length,
    activeNodes: [],
    visitedNodes: [],
    activeEdges: [],
    rejectedEdges: [],
    finalPathNodes: [],
    finalPathEdges: [],
    distances: {},
    explanation: `Top-${K} highest-traffic roads extracted! Rankings: ${sortedRankings.map((r, i) => `#${i + 1} ${r.road} (${r.score}%)`).join(', ')}. Min-heap gives O(N log K) = O(${ROAD_SEGMENTS.length} × log ${K}) efficiency.`,
    pseudoCodeLine: 8,
    data: { heap: heap.getAll(), rankings: sortedRankings },
  });

  return steps;
}

export const TOPK_PSEUDOCODE = [
  'heap ← MinHeap of size K',
  'for each road r in roads:',
  '  if heap.size < K:',
  '    heap.push(r)  // fill heap first',
  '  else if r.score > heap.peek().score:',
  '    heap.pop()    // remove minimum',
  '    heap.push(r)  // insert larger element',
  '  else:',
  '    skip  // too small for top-K',
  'return heap  // contains top-K roads',
];
