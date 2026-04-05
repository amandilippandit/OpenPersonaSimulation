import InstallBox from "./InstallBox";

const STUDIO_URL = process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3000";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 pt-20 pb-32 bg-grid">
      <div className="aurora-bg" />

      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center">
        {/* Eyebrow */}
        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-ink-800 bg-ink-900/50 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-ink-400">
            test content. not markets.
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.1] tracking-tight text-ink-200">
          test any content.
          <br />
          <span className="text-white">know any audience.</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-8 max-w-xl text-sm md:text-base text-ink-400 leading-relaxed">
          Build synthetic consumer panels from any demographic. Test ads, brand
          messaging, and product concepts before you spend on media. Structured
          reactions from realistic personas — in minutes, not weeks.
        </p>

        {/* Install box */}
        <div className="mt-12 flex justify-center w-full">
          <InstallBox />
        </div>

        {/* CTA row */}
        <div className="mt-8 flex items-center gap-3">
          <a
            href={STUDIO_URL}
            className="btn-primary px-5 py-2.5 rounded-md text-sm font-medium"
          >
            launch studio
          </a>
          <a
            href="https://github.com/amandilippandit/OpenPersonaSimulation#readme"
            className="btn-ghost px-5 py-2.5 rounded-md text-sm font-medium"
          >
            read the docs
          </a>
        </div>

        {/* Supporting proof line */}
        <div className="mt-14 flex items-center gap-6 text-xs text-ink-500">
          <div className="flex items-center gap-2">
            <span className="text-ink-300">python 3.10+</span>
          </div>
          <span className="text-ink-700">·</span>
          <div className="flex items-center gap-2">
            <span className="text-ink-300">openai · azure · ollama</span>
          </div>
          <span className="text-ink-700">·</span>
          <div className="flex items-center gap-2">
            <span className="text-ink-300">mit licensed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
