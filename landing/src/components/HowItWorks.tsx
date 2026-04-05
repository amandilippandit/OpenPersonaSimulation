import RevealOnScroll from "./RevealOnScroll";

const STEPS = [
  {
    num: "01",
    tag: "define",
    title: "build your audience",
    desc: "Compose consumers from demographic data, behavioral segments, and real-world profiles. Load pre-built personas or generate from scratch.",
    code: `from openpersona import Persona

maya = Persona("Maya Chen")
maya.define("age", 24)
maya.define("location", "Los Angeles")
maya.define("segment", "Gen Z Creator")
maya.define("income", "$55k")
maya.define("channels", ["TikTok", "IG"])
maya.define("price_sensitivity", "medium")`,
    preview: {
      kind: "persona",
      data: {
        initials: "MC",
        name: "Maya Chen, 24",
        segment: "Gen Z Creator",
        attrs: [
          { label: "LA", icon: "⊙" },
          { label: "$55k", icon: "◉" },
          { label: "TikTok · IG", icon: "∷" },
        ],
      },
    },
  },
  {
    num: "02",
    tag: "broadcast",
    title: "show them content",
    desc: "Deliver your ad, landing page, or campaign copy to every persona. Each consumer reacts independently based on who they are.",
    code: `from openpersona import World

ad_copy = """Sleep Better Tonight.
Meet ZenMatt — $899 · 90-night trial"""

world = World("focus_group", audience)
world.broadcast(ad_copy)
world.run(steps=3)  # 3 rounds of reactions`,
    preview: {
      kind: "broadcast",
      data: null,
    },
  },
  {
    num: "03",
    tag: "extract",
    title: "extract insights",
    desc: "Pull structured feedback: purchase intent, price perception, channel fit, concerns — broken down by segment.",
    code: `from openpersona import Extractor

results = Extractor().extract(
    audience,
    fields=[
        "intent_1_to_10",
        "top_concern",
        "would_share",
    ]
)`,
    preview: {
      kind: "results",
      data: null,
    },
  },
];

const ACCENTS: Record<string, string> = {
  "01": "bg-blue-500",
  "02": "bg-orange-500",
  "03": "bg-emerald-500",
};

function PersonaPreview({ data }: { data: any }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-7 h-7 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[10px] font-bold text-orange-600 flex-shrink-0">
          {data.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold text-slate-900 leading-tight truncate">{data.name}</div>
          <div className="text-[9px] text-slate-500 font-mono truncate">{data.segment}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {data.attrs.map((a: any) => (
          <div key={a.label} className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100">
            <span className="text-[8px] text-slate-400">{a.icon}</span>
            <span className="text-[9px] font-mono text-slate-600">{a.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BroadcastPreview() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm">
      <div className="text-[8px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">broadcasting</div>
      <div className="text-[10px] text-slate-700 italic leading-snug mb-2 border-l-2 border-orange-300 pl-2">
        Sleep Better Tonight. $899 · 90-night trial
      </div>
      <div className="flex items-center justify-between text-[9px] font-mono">
        <span className="text-slate-500">→ 24 consumers</span>
        <div className="flex gap-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse-dot" />
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse-dot" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-orange-300 animate-pulse-dot" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

function ResultsPreview() {
  const rows = [
    { name: "Maya", intent: 6.4, color: "bg-blue-400" },
    { name: "Priya", intent: 8.6, color: "bg-emerald-400" },
    { name: "Ben", intent: 3.2, color: "bg-amber-400" },
  ];
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm">
      <div className="text-[8px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">intent scores</div>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-2">
            <span className="text-[10px] text-slate-700 w-10 truncate">{r.name}</span>
            <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full ${r.color} rounded-full`} style={{ width: `${(r.intent / 10) * 100}%` }} />
            </div>
            <span className="text-[10px] font-mono font-semibold text-slate-900 tabular-nums w-6 text-right">
              {r.intent.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="relative px-6 py-32 border-t border-slate-200/70 bg-[#fafafa]">
      <div className="max-w-6xl mx-auto">
        <RevealOnScroll>
          <div className="mb-16 max-w-2xl">
            <div className="text-xs uppercase tracking-wider text-slate-500 mb-3">how it works</div>
            <h2 className="font-mono text-3xl md:text-4xl text-slate-900 leading-tight">
              three steps from ad copy to actionable insight.
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-4">
          {STEPS.map((step, i) => (
            <RevealOnScroll key={step.num} delay={i * 120}>
              <div className="card-light p-6 h-full flex flex-col">
                {/* Number + tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${ACCENTS[step.num]}`} />
                    <span className="text-xs font-mono text-slate-400">{step.num}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    {step.tag}
                  </span>
                </div>

                {/* Title + description */}
                <h3 className="text-lg font-mono text-slate-900 mb-2 leading-tight">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-grow">{step.desc}</p>

                {/* Code */}
                <pre className="text-[10px] font-mono text-slate-200 bg-slate-900 border border-slate-800 rounded-md p-3 overflow-x-auto leading-relaxed mb-3">
                  <code>{step.code}</code>
                </pre>

                {/* Arrow + preview */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-px bg-slate-200" />
                  <svg className="w-3 h-3 text-slate-400" viewBox="0 0 12 12" fill="none">
                    <path d="M6 2v8M3 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {step.preview.kind === "persona" && <PersonaPreview data={step.preview.data} />}
                {step.preview.kind === "broadcast" && <BroadcastPreview />}
                {step.preview.kind === "results" && <ResultsPreview />}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
