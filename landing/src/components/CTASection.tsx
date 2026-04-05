const STUDIO_URL = process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3000";

export default function CTASection() {
  return (
    <section className="relative px-6 py-32 border-t border-ink-800/50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-mono text-3xl md:text-5xl text-white leading-tight">
          stop guessing.
          <br />
          <span className="text-ink-400">start testing.</span>
        </h2>
        <p className="mt-6 text-sm md:text-base text-ink-400 max-w-lg mx-auto">
          Open-source, self-hosted, bring your own LLM key. No signup, no vendor lock-in.
        </p>

        <div className="mt-10 flex items-center justify-center gap-3">
          <a
            href={STUDIO_URL}
            className="btn-primary px-6 py-3 rounded-md text-sm font-medium"
          >
            launch studio →
          </a>
          <a
            href="https://github.com/amandilippandit/OpenPersonaSimulation"
            className="btn-ghost px-6 py-3 rounded-md text-sm font-medium"
          >
            view on github
          </a>
        </div>

        <div className="mt-8 text-xs text-ink-600 font-mono">
          $ pip install openpersona
        </div>
      </div>
    </section>
  );
}
