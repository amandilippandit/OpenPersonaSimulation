"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useMemo } from "react";
import { emotionToColor, nodeSize } from "@/lib/colors";
import type { GraphNode, GraphEdge } from "@/types";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-950">
      <div className="text-gray-500 text-sm font-mono">Loading 3D Graph...</div>
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

  const graphData = useMemo(() => {
    return {
      nodes: nodes.map((n) => ({
        ...n,
        color: emotionToColor(n.emotions),
        val: nodeSize(n.actions_count || 0),
      })),
      links: links.map((l) => ({
        ...l,
        color: "#475569",
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
    const age = node.age ? `, age ${node.age}` : "";
    return `<div style="background: rgba(15,23,42,0.9); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(148,163,184,0.2); font-family: monospace; font-size: 12px;">
      <div style="font-weight: bold; color: #F1F5F9; margin-bottom: 4px;">${name}${age}</div>
      <div style="color: ${emotionToColor(emotions)};">${emotions}</div>
    </div>`;
  }, []);

  const linkColor = useCallback(
    (link: Record<string, unknown>) => {
      const src = typeof link.source === "object" ? (link.source as Record<string, unknown>)?.id || (link.source as Record<string, unknown>)?.name : link.source;
      const tgt = typeof link.target === "object" ? (link.target as Record<string, unknown>)?.id || (link.target as Record<string, unknown>)?.name : link.target;
      const edgeKey = `${src}-${tgt}`;
      const reverseKey = `${tgt}-${src}`;
      if (glowingEdges.has(edgeKey) || glowingEdges.has(reverseKey)) {
        return "#22C55E";
      }
      return "#475569";
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
        return "#F1F5F9";
      }
      return emotionToColor(node.emotions as string);
    },
    [selectedAgent]
  );

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-950">
        <div className="text-center">
          <div className="text-gray-600 text-4xl mb-4">&#x25C9;</div>
          <p className="text-gray-500 text-sm font-mono">No agents yet</p>
          <p className="text-gray-600 text-xs font-mono mt-1">Add agents to see the social graph</p>
        </div>
      </div>
    );
  }

  return (
    <ForceGraph3D
      ref={fgRef}
      graphData={graphData}
      nodeLabel={nodeLabel as (node: object) => string}
      nodeColor={nodeColor as (node: object) => string}
      nodeVal={(node: object) => (node as Record<string, unknown>).val as number}
      nodeOpacity={0.9}
      linkColor={linkColor as (link: object) => string}
      linkWidth={linkWidth as (link: object) => number}
      linkOpacity={0.6}
      onNodeClick={handleNodeClick as (node: object) => void}
      backgroundColor="#030712"
      showNavInfo={false}
      enableNodeDrag={true}
      nodeRelSize={1}
      linkDirectionalParticles={2}
      linkDirectionalParticleWidth={1}
      linkDirectionalParticleSpeed={0.005}
      warmupTicks={50}
      cooldownTicks={100}
    />
  );
}
