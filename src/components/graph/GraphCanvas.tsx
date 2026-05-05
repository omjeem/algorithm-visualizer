import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { GraphData, GraphNode, AlgorithmStep } from '../../types';
import { NODE_COLORS, NODE_STROKE_COLORS, EDGE_COLORS } from '../../utils/colors';

interface GraphCanvasProps {
  graphData: GraphData;
  currentStep: AlgorithmStep | null;
  algorithmType: string;
}

interface MutableNode extends GraphNode {
  _x: number;
  _y: number;
}

const SCALE = 1.2;
const W = 780 * SCALE;
const H = 540 * SCALE;

function getNodeColor(nodeId: string, step: AlgorithmStep | null, algoType: string): string {
  if (!step) {
    return nodeId === 'delhi' ? NODE_COLORS.source : nodeId === 'dehradun' ? NODE_COLORS.destination : NODE_COLORS.default;
  }
  if (step.finalPathNodes.includes(nodeId)) return NODE_COLORS.finalPath;
  if (step.activeNodes.includes(nodeId)) return NODE_COLORS.active;
  if (step.visitedNodes.includes(nodeId)) {
    return algoType === 'kruskal' ? NODE_COLORS.mst : NODE_COLORS.visited;
  }
  if (nodeId === 'delhi') return NODE_COLORS.source;
  if (nodeId === 'dehradun') return NODE_COLORS.destination;
  return NODE_COLORS.default;
}

function getNodeStroke(nodeId: string, step: AlgorithmStep | null, algoType: string): string {
  if (!step) {
    return nodeId === 'delhi' ? NODE_STROKE_COLORS.source : nodeId === 'dehradun' ? NODE_STROKE_COLORS.destination : NODE_STROKE_COLORS.default;
  }
  if (step.finalPathNodes.includes(nodeId)) return NODE_STROKE_COLORS.finalPath;
  if (step.activeNodes.includes(nodeId)) return NODE_STROKE_COLORS.active;
  if (step.visitedNodes.includes(nodeId)) return algoType === 'kruskal' ? NODE_STROKE_COLORS.mst : NODE_STROKE_COLORS.visited;
  if (nodeId === 'delhi') return NODE_STROKE_COLORS.source;
  if (nodeId === 'dehradun') return NODE_STROKE_COLORS.destination;
  return NODE_STROKE_COLORS.default;
}

function getEdgeColor(edgeId: string, step: AlgorithmStep | null, algoType: string): string {
  if (!step) return EDGE_COLORS.default;
  if (step.finalPathEdges.includes(edgeId)) return algoType === 'kruskal' ? EDGE_COLORS.mst : EDGE_COLORS.finalPath;
  if (step.activeEdges.includes(edgeId)) return EDGE_COLORS.active;
  if (step.rejectedEdges.includes(edgeId)) return EDGE_COLORS.rejected;
  return EDGE_COLORS.default;
}

function getEdgeWidth(edgeId: string, step: AlgorithmStep | null): number {
  if (!step) return 2;
  if (step.finalPathEdges.includes(edgeId)) return 4;
  if (step.activeEdges.includes(edgeId)) return 3;
  if (step.rejectedEdges.includes(edgeId)) return 1;
  return 2;
}

function getNodeGlow(nodeId: string, step: AlgorithmStep | null): string {
  if (!step) return 'none';
  if (step.finalPathNodes.includes(nodeId)) return 'url(#glow-amber)';
  if (step.activeNodes.includes(nodeId)) return 'url(#glow-blue)';
  if (step.visitedNodes.includes(nodeId)) return 'url(#glow-purple)';
  return 'none';
}

export default function GraphCanvas({ graphData, currentStep, algorithmType }: GraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const nodesRef = useRef<MutableNode[]>([]);
  const stepRef = useRef<AlgorithmStep | null>(null);
  const algoRef = useRef<string>(algorithmType);

  stepRef.current = currentStep;
  algoRef.current = algorithmType;

  const updateVisuals = useCallback(() => {
    if (!gRef.current) return;
    const g = gRef.current;
    const step = stepRef.current;
    const algo = algoRef.current;

    g.selectAll<SVGLineElement, (typeof graphData.edges)[0]>('.edge-line')
      .transition().duration(300)
      .attr('stroke', d => getEdgeColor(d.id, step, algo))
      .attr('stroke-width', d => getEdgeWidth(d.id, step))
      .attr('stroke-opacity', d => {
        if (!step) return 0.5;
        if (step.rejectedEdges.includes(d.id)) return 0.25;
        if (step.finalPathEdges.includes(d.id) || step.activeEdges.includes(d.id)) return 1;
        return 0.4;
      });

    g.selectAll<SVGCircleElement, MutableNode>('.node-circle')
      .transition().duration(300)
      .attr('fill', d => getNodeColor(d.id, step, algo))
      .attr('stroke', d => getNodeStroke(d.id, step, algo))
      .attr('r', d => {
        if (!step) return 22;
        if (step.finalPathNodes.includes(d.id)) return 26;
        if (step.activeNodes.includes(d.id)) return 25;
        return 22;
      })
      .attr('filter', d => getNodeGlow(d.id, step));

    // Animate final path edges with dash animation
    g.selectAll<SVGLineElement, (typeof graphData.edges)[0]>('.edge-line')
      .attr('stroke-dasharray', d => step?.finalPathEdges.includes(d.id) ? '8,4' : 'none')
      .attr('stroke-dashoffset', d => step?.finalPathEdges.includes(d.id) ? '100' : '0');

    if (step) {
      g.selectAll<SVGLineElement, (typeof graphData.edges)[0]>('.edge-line')
        .filter(d => step.finalPathEdges.includes(d.id))
        .transition().duration(800).ease(d3.easeLinear)
        .attr('stroke-dashoffset', '0');
    }
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Defs: glow filters, arrowheads
    const defs = svg.append('defs');

    const addGlow = (id: string, color: string, stdDev: number) => {
      const f = defs.append('filter').attr('id', id).attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
      f.append('feGaussianBlur').attr('stdDeviation', stdDev).attr('result', 'blur');
      const merge = f.append('feMerge');
      merge.append('feMergeNode').attr('in', 'blur');
      merge.append('feMergeNode').attr('in', 'SourceGraphic');
      f.append('feFlood').attr('flood-color', color).attr('flood-opacity', '0.8').attr('result', 'color');
      const composite = f.append('feComposite').attr('in', 'color').attr('in2', 'blur').attr('operator', 'in').attr('result', 'colorBlur');
      const merge2 = f.append('feMerge');
      merge2.append('feMergeNode').attr('in', 'colorBlur');
      merge2.append('feMergeNode').attr('in', 'SourceGraphic');
      void composite;
    };
    addGlow('glow-blue', '#0ea5e9', 6);
    addGlow('glow-purple', '#a855f7', 6);
    addGlow('glow-amber', '#f59e0b', 8);
    addGlow('glow-green', '#10b981', 6);

    // Grid background
    const gridG = svg.append('g').attr('class', 'grid');
    const gridSize = 40;
    for (let x = 0; x <= W; x += gridSize) {
      gridG.append('line').attr('x1', x).attr('y1', 0).attr('x2', x).attr('y2', H)
        .attr('stroke', '#1e3a5f').attr('stroke-width', 0.5).attr('stroke-opacity', 0.4);
    }
    for (let y = 0; y <= H; y += gridSize) {
      gridG.append('line').attr('x1', 0).attr('y1', y).attr('x2', W).attr('y2', y)
        .attr('stroke', '#1e3a5f').attr('stroke-width', 0.5).attr('stroke-opacity', 0.4);
    }

    const g = svg.append('g').attr('class', 'main-group');
    gRef.current = g;

    // Init mutable nodes
    nodesRef.current = graphData.nodes.map(n => ({
      ...n,
      _x: n.x * SCALE,
      _y: n.y * SCALE,
    }));

    const edgeGroup = g.append('g').attr('class', 'edges');
    const nodeGroup = g.append('g').attr('class', 'nodes');

    // Draw edges
    edgeGroup.selectAll('.edge-group')
      .data(graphData.edges)
      .enter()
      .append('g')
      .attr('class', 'edge-group')
      .each(function(d) {
        const grp = d3.select(this);
        const src = nodesRef.current.find(n => n.id === d.source)!;
        const tgt = nodesRef.current.find(n => n.id === d.target)!;

        const x1 = src._x, y1 = src._y, x2 = tgt._x, y2 = tgt._y;
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;

        grp.append('line')
          .attr('class', 'edge-line')
          .datum(d)
          .attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2)
          .attr('stroke', EDGE_COLORS.default)
          .attr('stroke-width', 2)
          .attr('stroke-opacity', 0.5)
          .attr('stroke-linecap', 'round');

        // Edge weight label
        grp.append('rect')
          .attr('x', mx - 18).attr('y', my - 10)
          .attr('width', 36).attr('height', 18)
          .attr('rx', 4)
          .attr('fill', '#0a1628')
          .attr('fill-opacity', 0.85)
          .attr('stroke', '#1e3a5f')
          .attr('stroke-width', 1);

        grp.append('text')
          .attr('x', mx).attr('y', my + 4)
          .attr('text-anchor', 'middle')
          .attr('fill', '#94a3b8')
          .attr('font-size', '10px')
          .attr('font-family', 'monospace')
          .text(`${d.distance}km`);
      });

    // Tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'd3-tooltip')
      .style('position', 'fixed')
      .style('opacity', 0)
      .style('background', 'rgba(10,22,40,0.95)')
      .style('border', '1px solid rgba(14,165,233,0.4)')
      .style('border-radius', '8px')
      .style('padding', '10px 14px')
      .style('color', '#e2e8f0')
      .style('font-size', '12px')
      .style('font-family', 'monospace')
      .style('pointer-events', 'none')
      .style('z-index', '9999')
      .style('backdrop-filter', 'blur(8px)')
      .style('box-shadow', '0 4px 24px rgba(0,0,0,0.5)');

    // Draw nodes
    const drag = d3.drag<SVGGElement, MutableNode>()
      .on('drag', function(event, d) {
        d._x = event.x;
        d._y = event.y;

        d3.select(this)
          .select('.node-circle-wrapper')
          .attr('transform', `translate(${d._x},${d._y})`);

        // Update connected edges
        edgeGroup.selectAll<SVGLineElement, (typeof graphData.edges)[0]>('.edge-line')
          .each(function(e) {
            const s = nodesRef.current.find(n => n.id === e.source)!;
            const t = nodesRef.current.find(n => n.id === e.target)!;
            d3.select(this)
              .attr('x1', s._x).attr('y1', s._y)
              .attr('x2', t._x).attr('y2', t._y);
          });

        edgeGroup.selectAll('.edge-group').each(function(e) {
          const ed = e as typeof graphData.edges[0];
          const s = nodesRef.current.find(n => n.id === ed.source)!;
          const t = nodesRef.current.find(n => n.id === ed.target)!;
          const mx = (s._x + t._x) / 2, my = (s._y + t._y) / 2;
          d3.select(this).select('rect').attr('x', mx - 18).attr('y', my - 10);
          d3.select(this).select('text').attr('x', mx).attr('y', my + 4);
        });
      });

    const nodeGs = nodeGroup.selectAll<SVGGElement, MutableNode>('.node-group')
      .data(nodesRef.current)
      .enter()
      .append('g')
      .attr('class', 'node-group')
      .style('cursor', 'grab')
      .call(drag as d3.DragBehavior<SVGGElement, MutableNode, unknown>);

    const nodeWrap = nodeGs.append('g')
      .attr('class', 'node-circle-wrapper')
      .attr('transform', d => `translate(${d._x},${d._y})`);

    // Outer glow ring
    nodeWrap.append('circle')
      .attr('r', 30)
      .attr('fill', 'none')
      .attr('stroke', d => d.type === 'source' ? '#10b981' : d.type === 'destination' ? '#ef4444' : '#1e3a5f')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.3)
      .attr('stroke-dasharray', '4,4');

    nodeWrap.append('circle')
      .attr('class', 'node-circle')
      .attr('r', 22)
      .attr('fill', d => d.type === 'source' ? NODE_COLORS.source : d.type === 'destination' ? NODE_COLORS.destination : NODE_COLORS.default)
      .attr('stroke', d => d.type === 'source' ? NODE_STROKE_COLORS.source : d.type === 'destination' ? NODE_STROKE_COLORS.destination : NODE_STROKE_COLORS.default)
      .attr('stroke-width', 2.5)
      .attr('filter', d => d.type === 'source' ? 'url(#glow-green)' : d.type === 'destination' ? 'url(#glow-amber)' : 'none');

    // Node icon
    nodeWrap.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .attr('font-size', '14px')
      .text(d => d.type === 'source' ? '🏙️' : d.type === 'destination' ? '🏔️' : '🏘️');

    // Node label
    nodeWrap.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 40)
      .attr('fill', '#e2e8f0')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('font-family', 'monospace')
      .attr('letter-spacing', '0.05em')
      .text(d => d.label);

    // Type badge
    nodeWrap.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 54)
      .attr('fill', d => d.type === 'source' ? '#34d399' : d.type === 'destination' ? '#f87171' : '#64748b')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .text(d => d.type === 'source' ? '[SOURCE]' : d.type === 'destination' ? '[DEST]' : '');

    // Hover tooltip
    nodeGs
      .on('mouseover', function(event, d) {
        tooltip.transition().duration(150).style('opacity', 1);
        tooltip.html(`
          <div style="font-weight:700;color:#38bdf8;margin-bottom:4px">${d.label}</div>
          <div style="color:#94a3b8;font-size:11px">Pop: ${d.population?.toLocaleString()}</div>
          <div style="color:#94a3b8;font-size:11px">Role: ${d.type}</div>
        `).style('left', `${event.clientX + 12}px`).style('top', `${event.clientY - 10}px`);
      })
      .on('mousemove', function(event) {
        tooltip.style('left', `${event.clientX + 12}px`).style('top', `${event.clientY - 10}px`);
      })
      .on('mouseout', function() {
        tooltip.transition().duration(200).style('opacity', 0);
      });

    edgeGroup.selectAll('.edge-group')
      .on('mouseover', function(event, d) {
        const ed = d as typeof graphData.edges[0];
        tooltip.transition().duration(150).style('opacity', 1);
        tooltip.html(`
          <div style="font-weight:700;color:#a855f7;margin-bottom:4px">${ed.source} ↔ ${ed.target}</div>
          <div style="color:#94a3b8;font-size:11px">Distance: ${ed.distance} km</div>
          <div style="color:#94a3b8;font-size:11px">Toll: ₹${ed.toll}</div>
          <div style="color:#94a3b8;font-size:11px">Fuel: ₹${ed.fuel}</div>
        `).style('left', `${event.clientX + 12}px`).style('top', `${event.clientY - 10}px`);
      })
      .on('mousemove', function(event) {
        tooltip.style('left', `${event.clientX + 12}px`).style('top', `${event.clientY - 10}px`);
      })
      .on('mouseout', function() {
        tooltip.transition().duration(200).style('opacity', 0);
      });

    // Zoom + pan
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 4])
      .on('zoom', event => {
        g.attr('transform', event.transform.toString());
      });

    svg.call(zoom);

    // Initial centering
    const initX = (svgRef.current.clientWidth - W) / 2;
    svg.call(zoom.transform, d3.zoomIdentity.translate(Math.max(0, initX), 10).scale(0.85));

    return () => {
      d3.selectAll('.d3-tooltip').remove();
    };
  }, [graphData]);

  // Update visuals when step changes
  useEffect(() => {
    updateVisuals();
  }, [currentStep, updateVisuals]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ background: 'transparent', display: 'block' }}
    />
  );
}
