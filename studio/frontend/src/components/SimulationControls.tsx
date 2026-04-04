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
    <div className="flex items-center gap-3 px-4 py-3 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      {/* Status indicators */}
      <div className="flex items-center gap-4 mr-auto">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${running ? "bg-amber-400 animate-pulse" : "bg-green-500"}`} />
          <span className="text-xs font-mono text-gray-400">
            {running ? "Running..." : "Ready"}
          </span>
        </div>
        <div className="text-xs font-mono text-gray-500">
          Step <span className="text-gray-300 font-bold">{stepCount}</span>
        </div>
        <div className="text-xs font-mono text-gray-500">
          Agents <span className="text-gray-300 font-bold">{agentCount}</span>
        </div>
      </div>

      {/* Action buttons */}
      <button
        onClick={onAddAgent}
        className="px-3 py-1.5 text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg border border-gray-700 transition-colors"
      >
        + Add Agent
      </button>
      <div className="w-px h-6 bg-gray-800" />
      <button
        onClick={onStep}
        disabled={running}
        className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors"
      >
        Step
      </button>
      <button
        onClick={() => onRun(5)}
        disabled={running}
        className="px-3 py-1.5 text-xs font-medium bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors"
      >
        Run 5
      </button>
      <button
        onClick={() => onRun(10)}
        disabled={running}
        className="px-3 py-1.5 text-xs font-medium bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors"
      >
        Run 10
      </button>
    </div>
  );
}
