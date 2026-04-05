const USE_CASES = [
  {
    tag: "ad copy testing",
    headline: "catch weak copy before you spend.",
    body: "show an ad to 50 synthetic consumers across your target demographics. get back purchase intent scores, emotional reactions, and specific objections — broken down by segment.",
  },
  {
    tag: "a/b headlines",
    headline: "pick the winning variant, not a coin flip.",
    body: "run variation A against group 1 and variation B against group 2. statistical comparison of response distributions. no media spend required to find the winner.",
  },
  {
    tag: "brand messaging",
    headline: "measure positioning clarity.",
    body: "read your brand statement to a diverse audience. check whether different segments perceived the same intended message. find where it gets lost.",
  },
  {
    tag: "product launch sim",
    headline: "simulate launch week reactions.",
    body: "show your campaign to 100 diverse consumers, let them discuss it with each other. extract initial reactions, trust signals, virality indicators, and emerging concerns.",
  },
];

export default function UseCases() {
  return (
    <section className="relative px-6 py-32 border-t border-ink-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 max-w-2xl">
          <div className="text-xs uppercase tracking-wider text-ink-500 mb-3">use cases</div>
          <h2 className="font-mono text-3xl md:text-4xl text-white leading-tight">
            built for marketing teams that need signal before launch.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-ink-800/50 rounded-xl overflow-hidden border border-ink-800">
          {USE_CASES.map((uc) => (
            <div
              key={uc.tag}
              className="bg-ink-900/50 p-8 hover:bg-ink-850/70 transition-colors"
            >
              <div className="text-[10px] uppercase tracking-wider text-ink-500 mb-4 font-mono">
                {uc.tag}
              </div>
              <h3 className="font-mono text-xl text-white mb-3 leading-snug">{uc.headline}</h3>
              <p className="text-sm text-ink-400 leading-relaxed">{uc.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
