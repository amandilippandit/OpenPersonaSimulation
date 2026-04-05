import RevealOnScroll from "./RevealOnScroll";

const STEPS = [
  {
    num: "01",
    title: "build your audience",
    desc: "define consumers with demographics, personality traits, beliefs, and behaviors. load from JSON or generate from demographic data.",
    code: `Persona("Diane")
  .define("age", 44)
  .define("traits", [
    "skeptical of ads",
    "values reviews",
  ])`,
  },
  {
    num: "02",
    title: "show them content",
    desc: "deliver an ad, brand message, product concept, or landing copy. consumers react based on who they are.",
    code: `for agent in audience:
  agent.listen(
    "Read this ad: " + ad_copy
  )
world.run(steps=3)`,
  },
  {
    num: "03",
    title: "extract insights",
    desc: "pull structured feedback: purchase intent, concerns, emotional reactions. broken down by segment.",
    code: `extractor.extract_results(
  agents=audience,
  fields=["intent",
          "concern",
          "would_share"]
)`,
  },
];

export default function HowItWorks() {
  return (
    <section className="relative px-6 py-32 border-t border-ink-800/50">
      <div className="max-w-6xl mx-auto">
        <RevealOnScroll>
          <div className="mb-16 max-w-2xl">
            <div className="text-xs uppercase tracking-wider text-ink-500 mb-3">how it works</div>
            <h2 className="font-mono text-3xl md:text-4xl text-white leading-tight">
              three steps from ad copy to actionable insight.
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-4">
          {STEPS.map((step, i) => (
            <RevealOnScroll key={step.num} delay={i * 120}>
              <div className="feature-card p-6 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-xs font-mono text-ink-500">{step.num}</div>
                  <div className="w-8 h-px bg-ink-700 mt-2" />
                </div>
                <h3 className="text-lg font-mono text-white mb-3">{step.title}</h3>
                <p className="text-sm text-ink-400 leading-relaxed mb-5">{step.desc}</p>
                <pre className="text-[11px] font-mono text-ink-300 bg-ink-950/80 border border-ink-800 rounded-md p-3 overflow-x-auto">
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
