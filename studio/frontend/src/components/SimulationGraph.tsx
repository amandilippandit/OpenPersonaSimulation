"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useMemo, useState, useEffect } from "react";
import { emotionToColor, nodeSize } from "@/lib/colors";
import type { GraphNode, GraphEdge } from "@/types";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-white">
      <div className="text-slate-400 text-xs font-mono">loading graph...</div>
    </div>
  ),
});

interface SimulationGraphProps {
  nodes: GraphNode[];
  links: GraphEdge[];
  glowingEdges: Set<string>;
  onNodeClick: (name: string) => void;
  selectedAgent: string | null;
}

export default function SimulationGraph({
  nodes,
  links,
  glowingEdges,
  onNodeClick,
  selectedAgent,
}: SimulationGraphProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      setDimensions({ width: el.clientWidth, height: el.clientHeight });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const graphData = useMemo(() => {
    return {
      nodes: nodes.map((n) => ({
        ...n,
        color: emotionToColor(n.emotions),
        val: nodeSize(n.actions_count || 0),
      })),
      links: links.map((l) => ({
        ...l,
        color: "#94a3b8",
      })),
    };
  }, [nodes, links]);

  const handleNodeClick = useCallback(
    (node: Record<string, unknown>) => {
      const name = (node.name as string) || (node.id as string);
      if (name) onNodeClick(name);
    },
    [onNodeClick]
  );

  const nodeLabel = useCallback((node: Record<string, unknown>) => {
    const name = (node.name as string) || (node.id as string) || "?";
    const emotions = (node.emotions as string) || "neutral";
    const age = node.age ? ` · ${node.age}` : "";
    return `<div style="background: white; padding: 8px 12px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 8px 20px -8px rgba(15,23,42,0.15); font-family: 'JetBrains Mono', monospace; font-size: 11px;">
      <div style="font-weight: 600; color: #0f172a; margin-bottom: 2px;">${name}${age}</div>
      <div style="color: ${emotionToColor(emotions)}; font-size: 10px;">${emotions}</div>
    </div>`;
  }, []);

  const linkColor = useCallback(
    (link: Record<string, unknown>) => {
      const src = typeof link.source === "object" ? (link.source as Record<string, unknown>)?.id || (link.source as Record<string, unknown>)?.name : link.source;
      const tgt = typeof link.target === "object" ? (link.target as Record<string, unknown>)?.id || (link.target as Record<string, unknown>)?.name : link.target;
      const edgeKey = `${src}-${tgt}`;
      const reverseKey = `${tgt}-${src}`;
      if (glowingEdges.has(edgeKey) || glowingEdges.has(reverseKey)) {
        return "#f97316";
      }
      return "#cbd5e1";
    },
    [glowingEdges]
  );

  const linkWidth = useCallback(
    (link: Record<string, unknown>) => {
      const src = typeof link.source === "object" ? (link.source as Record<string, unknown>)?.id || (link.source as Record<string, unknown>)?.name : link.source;
      const tgt = typeof link.target === "object" ? (link.target as Record<string, unknown>)?.id || (link.target as Record<string, unknown>)?.name : link.target;
      const edgeKey = `${src}-${tgt}`;
      const reverseKey = `${tgt}-${src}`;
      if (glowingEdges.has(edgeKey) || glowingEdges.has(reverseKey)) {
        return 3;
      }
      return 1;
    },
    [glowingEdges]
  );

  const nodeColor = useCallback(
    (node: Record<string, unknown>) => {
      const name = (node.name as string) || (node.id as string);
      if (name === selectedAgent) {
        return "#f97316";
      }
      return emotionToColor(node.emotions as string);
    },
    [selectedAgent]
  );

  if (nodes.length === 0) {
    return (
      <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center mx-auto mb-3">
            <svg className="w-4 h-4 text-slate-400" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8" cy="8" r="2" fill="currentColor" />
            </svg>
          </div>
          <p className="text-xs font-mono font-semibold text-slate-900">no personas yet</p>
          <p className="text-[10px] text-slate-400 font-mono mt-1">add personas to see the graph</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        nodeLabel={nodeLabel as (node: object) => string}
        nodeColor={nodeColor as (node: object) => string}
        nodeVal={(node: object) => (node as Record<string, unknown>).val as number}
        nodeOpacity={0.9}
        linkColor={linkColor as (link: object) => string}
        linkWidth={linkWidth as (link: object) => number}
        linkOpacity={0.4}
        onNodeClick={handleNodeClick as (node: object) => void}
        backgroundColor="#ffffff"
        showNavInfo={false}
        enableNodeDrag={true}
        nodeRelSize={4}
        linkDirectionalParticles={0}
        linkDirectionalParticleWidth={0}
        linkDirectionalParticleSpeed={0}
        warmupTicks={50}
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />
    </div>
  );
}




