import RevealOnScroll from "./RevealOnScroll";

const STEPS = [
  {
    num: "01",
    title: "build your audience",
    desc: "define consumers with demographics, segments, channels, and price bands. load from JSON or generate from demographic data.",
    code: `Persona("Maya")
  .define("age", 24)
  .define("segment",
    "Gen Z Creator")
  .define("channel",
    "TikTok")`,
  },
  {
    num: "02",
    title: "show them content",
    desc: "deliver an ad, landing page, or campaign. consumers react based on who they are and how they shop.",
    code: `for agent in audience:
  agent.listen(
    "Read this ad: " + copy
  )
world.run(steps=3)`,
  },
  {
    num: "03",
    title: "extract insights",
    desc: "pull structured feedback: purchase intent, price perception, channel fit, emotional response — by segment.",
    code: `extractor.extract(
  fields=["intent",
          "concern",
          "channel_fit"]
)`,
  },
];

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
              <div className="card-light p-6 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-xs font-mono text-slate-400">{step.num}</div>
                  <div className="w-8 h-px bg-slate-200 mt-2" />
                </div>
                <h3 className="text-lg font-mono text-slate-900 mb-3">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">{step.desc}</p>
                <pre className="text-[11px] font-mono text-slate-200 bg-slate-900 border border-slate-800 rounded-md p-3 overflow-x-auto">
                  <code>{step.code}</code>
                </pre>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
