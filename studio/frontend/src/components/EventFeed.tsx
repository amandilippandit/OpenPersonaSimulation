"use client";

import { useEffect, useRef } from "react";
import type { SimEvent } from "@/types";

interface EventFeedProps {
  events: SimEvent[];
}

const ACTION_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  TALK: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  THINK: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  DONE: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  REACH_OUT: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  LISTEN: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  SEE: { bg: "bg-pink-50", text: "text-pink-700", dot: "bg-pink-500" },
};

const DEFAULT_STYLE = ACTION_STYLES.DONE;

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
        <p className="text-slate-400 text-xs font-mono">
          no events yet · run a step to see activity
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-x-auto overflow-y-hidden flex items-stretch gap-2 px-5 py-3"
    >
      {events.map((event, i) => {
        const kind = (event.kind || event.type || "").toUpperCase();
        const style = ACTION_STYLES[kind] || DEFAULT_STYLE;
        return (
          <div
            key={i}
            className="flex-shrink-0 w-52 card p-3 flex flex-col justify-between animate-fade-up"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-mono text-slate-400">
                  #{event.step}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase rounded ${style.bg} ${style.text}`}
                >
                  <span className={`w-1 h-1 rounded-full ${style.dot}`} />
                  {kind}
                </span>
              </div>
              <p className="text-[11px] text-slate-700 leading-snug line-clamp-3">
                {event.content || <span className="italic text-slate-400">(no content)</span>}
              </p>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-mono font-semibold text-slate-900 truncate">
                {event.agent}
              </span>
              {event.target && (
                <span className="text-[10px] text-slate-400 font-mono truncate">
                  → {event.target}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}



