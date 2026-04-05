import RevealOnScroll from "./RevealOnScroll";

const STUDIO_URL = process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3000";

export default function CTASection() {
  return (
    <section className="relative px-6 py-32 border-t border-slate-200/70 overflow-hidden bg-white">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(249,115,22,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "pulseGlow 6s ease-in-out infinite",
        }}
      />

      <RevealOnScroll>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="font-mono text-3xl md:text-5xl text-slate-900 leading-tight">
            stop guessing.
            <br />
            <span className="text-slate-500">start testing.</span>
          </h2>
          <p className="mt-6 text-sm md:text-base text-slate-600 max-w-lg mx-auto">
            Open-source, self-hosted, bring your own LLM key. No signup, no vendor lock-in.
          </p>

          <div className="mt-10 flex items-center justify-center gap-3">
            <a href={STUDIO_URL} className="btn-primary-light px-6 py-3 rounded-md text-sm font-medium">
              launch studio →
            </a>
            <a href="https://github.com/amandilippandit/OpenPersonaSimulation" className="btn-ghost-light px-6 py-3 rounded-md text-sm font-medium">
              view on github
            </a>
          </div>

          <div className="mt-8 text-xs text-slate-400 font-mono">
            $ pip install git+https://github.com/amandilippandit/OpenPersonaSimulation.git
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
