"use client";

interface SimulationControlsProps {
  stepCount: number;
  agentCount: number;
  running: boolean;
  onAddAgent: () => void;
  onStep: () => void;
  onRun: (steps: number) => void;
}

export default function SimulationControls({
  stepCount,
  agentCount,
  running,
  onAddAgent,
  onStep,
  onRun,
}: SimulationControlsProps) {
  return (
    <div className="flex items-center gap-3 px-5 h-11 bg-white/60 backdrop-blur-xl border-b border-slate-200/70 flex-shrink-0">
      {/* Status indicators */}
      <div className="flex items-center gap-3 mr-auto">
        <div className="flex items-center gap-1.5">
          {running ? (
            <>
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex w-full h-full rounded-full bg-orange-500 opacity-75 animate-ping" />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-orange-500" />
              </span>
              <span className="text-[10px] font-mono text-orange-600 uppercase tracking-wider font-semibold">
                running
              </span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-mono text-emerald-700 uppercase tracking-wider font-semibold">
                ready
              </span>
            </>
          )}
        </div>
        <span className="text-slate-300">·</span>
        <div className="text-[10px] font-mono text-slate-500">
          step <span className="text-slate-900 font-semibold">{stepCount}</span>
        </div>
        <span className="text-slate-300">·</span>
        <div className="text-[10px] font-mono text-slate-500">
          <span className="text-slate-900 font-semibold">{agentCount}</span> agents
        </div>
      </div>

      {/* Action buttons */}
      <button
        onClick={onAddAgent}
        className="btn-ghost px-2.5 py-1 text-[11px] font-mono rounded-md"
      >
        + add agent
      </button>
      <div className="w-px h-5 bg-slate-200" />
      <button
        onClick={onStep}
        disabled={running}
        className="btn-primary px-2.5 py-1 text-[11px] font-mono rounded-md disabled:opacity-40 disabled:hover:transform-none"
      >
        step
      </button>
      <button
        onClick={() => onRun(5)}
        disabled={running}
        className="btn-accent px-2.5 py-1 text-[11px] font-mono rounded-md disabled:opacity-40 disabled:hover:transform-none"
      >
        run 5
      </button>
      <button
        onClick={() => onRun(10)}
        disabled={running}
        className="btn-accent px-2.5 py-1 text-[11px] font-mono rounded-md disabled:opacity-40 disabled:hover:transform-none"
      >
        run 10
      </button>
    </div>
  );
}




