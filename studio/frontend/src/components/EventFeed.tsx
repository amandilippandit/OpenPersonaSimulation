"use client";

import { useEffect, useRef } from "react";
import { actionTypeStyle, emotionToColor } from "@/lib/colors";
import type { SimEvent } from "@/types";

interface EventFeedProps {
  events: SimEvent[];
}

export default function EventFeed({ events }: EventFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-600 text-sm font-mono">No events yet. Run a simulation step to see activity.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 flex-shrink-0">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Event Timeline</h3>
        <span className="text-[10px] text-gray-600 font-mono">{events.length} events</span>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto overflow-y-hidden flex items-stretch gap-2 p-3"
      >
        {events.map((event, i) => {
          const kind = (event.kind || event.type || "").toUpperCase();
          const style = actionTypeStyle(kind);
          return (
            <div
              key={i}
              className="flex-shrink-0 w-56 bg-gray-800/40 rounded-lg border border-gray-800/80 p-3 flex flex-col justify-between hover:border-gray-700/80 transition-colors animate-fade-in"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono text-gray-600">#{event.step}</span>
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold uppercase rounded ${style.bg} ${style.text}`}
                  >
                    {kind}
                  </span>
                </div>
                <p className="text-xs text-gray-300 font-mono leading-relaxed line-clamp-3">
                  {event.content || "(no content)"}
                </p>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800/60">
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: emotionToColor(null) }}
                >
                  {event.agent}
                </span>
                {event.target && (
                  <span className="text-[10px] text-gray-600">
                    -&gt; {event.target}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
