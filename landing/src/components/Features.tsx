import RevealOnScroll from "./RevealOnScroll";

const FEATURES = [
  { icon: "▣", title: "3d studio workspace", desc: "visualize your audience as a live force-directed graph. consumers colored by emotional reaction. click any node to inspect their full response." },
  { icon: "∿", title: "a/b testing built in", desc: "run control vs variant against randomized audience segments. derandomize results automatically. measure statistical significance." },
  { icon: "◈", title: "demographic generator", desc: "feed in census-style demographic data. generate 50-200 personas matching the distribution. ideal customer discovery at scale." },
  { icon: "∷", title: "structured extraction", desc: "pull purchase intent, objections, trust scores, emotional reactions from free-form responses. export to JSON or CSV." },
  { icon: "⟲", title: "autonomous optimization", desc: "autoresearch agent runs overnight, tuning your persona panel to maximize insight quality. ~160 experiments while you sleep." },
  { icon: "⊡", title: "empirical validation", desc: "compare simulation results against real survey data. 8 statistical tests. know when your simulation matches reality." },
];

export default function Features() {
  return (
    <section className="relative px-6 py-32 border-t border-slate-200/70 bg-white">
      <div className="max-w-6xl mx-auto">
        <RevealOnScroll>
          <div className="mb-16 max-w-2xl">
            <div className="text-xs uppercase tracking-wider text-slate-500 mb-3">capabilities</div>
            <h2 className="font-mono text-3xl md:text-4xl text-slate-900 leading-tight">
              everything you need to test marketing content against synthetic audiences.
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <RevealOnScroll key={f.title} delay={(i % 3) * 80}>
              <div className="card-light p-6 h-full">
                <div className="text-xl mb-4 text-orange-500">{f.icon}</div>
                <h3 className="text-base font-mono text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
