import InstallBox from "./InstallBox";

const STUDIO_URL = process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3000";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-20 pb-32 bg-grid overflow-hidden">
      <div className="aurora-bg" />

      {/* Decorative corner accents */}
      <div className="absolute top-20 left-6 w-12 h-12 border-l border-t border-ink-800/60 animate-fade-in delay-300" />
      <div className="absolute top-20 right-6 w-12 h-12 border-r border-t border-ink-800/60 animate-fade-in delay-400" />

      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center">
        {/* Eyebrow badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-ink-800 bg-ink-900/60 backdrop-blur-sm animate-fade-up delay-100">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs text-ink-400">
            test content. not markets.
          </span>
        </div>

        {/* Animated headline — each word reveals sequentially */}
        <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.1] tracking-tight text-ink-200">
          <span className="inline-block animate-reveal-word delay-100">test</span>{" "}
          <span className="inline-block animate-reveal-word delay-200">any</span>{" "}
          <span className="inline-block animate-reveal-word delay-300">content.</span>
          <br />
          <span className="inline-block animate-reveal-word delay-500 text-white">know</span>{" "}
          <span className="inline-block animate-reveal-word delay-600 text-white">any</span>{" "}
          <span className="inline-block animate-reveal-word delay-700 text-white">audience.</span>
          <span className="inline-block animate-blink delay-800 text-indigo-400">_</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-8 max-w-xl text-sm md:text-base text-ink-400 leading-relaxed animate-fade-up" style={{ animationDelay: "900ms" }}>
          Build synthetic consumer panels from any demographic. Test ads, brand
          messaging, and product concepts before you spend on media. Structured
          reactions from realistic personas — in minutes, not weeks.
        </p>

        {/* Install box */}
        <div className="mt-12 flex justify-center w-full animate-fade-up" style={{ animationDelay: "1100ms" }}>
          <InstallBox />
        </div>

        {/* CTA row */}
        <div className="mt-8 flex items-center gap-3 animate-fade-up" style={{ animationDelay: "1300ms" }}>
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
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink-500 animate-fade-up" style={{ animationDelay: "1500ms" }}>
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

        {/* Scroll indicator */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: "2000ms" }}>
          <div className="flex flex-col items-center gap-2 text-ink-600">
            <span className="text-[10px] font-mono uppercase tracking-widest">scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-ink-600 to-transparent animate-float" />
          </div>
        </div>
      </div>
    </section>
  );
}
