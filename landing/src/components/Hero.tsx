import StudioPreview from "./StudioPreview";

const STUDIO_URL = process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3000";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-20 pb-32 bg-grid-light overflow-hidden">
      <div className="aurora-bg-light" />

      {/* Decorative corner accents */}
      <div className="absolute top-20 left-6 w-12 h-12 border-l border-t border-slate-200 animate-fade-in delay-300" />
      <div className="absolute top-20 right-6 w-12 h-12 border-r border-t border-slate-200 animate-fade-in delay-400" />

      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center">
        {/* Eyebrow badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm animate-fade-up delay-100">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inline-flex w-full h-full rounded-full bg-orange-500 opacity-75 animate-ping" />
            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-orange-500" />
          </span>
          <span className="text-xs text-slate-600">
            test content. not markets.
          </span>
        </div>

        {/* Animated headline */}
        <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.1] tracking-tight text-slate-600">
          <span className="inline-block animate-reveal-word delay-100">test</span>{" "}
          <span className="inline-block animate-reveal-word delay-200">any</span>{" "}
          <span className="inline-block animate-reveal-word delay-300">content.</span>
          <br />
          <span className="inline-block animate-reveal-word delay-500 text-slate-900">know</span>{" "}
          <span className="inline-block animate-reveal-word delay-600 text-slate-900">any</span>{" "}
          <span className="inline-block animate-reveal-word delay-700 text-slate-900">audience.</span>
          <span className="inline-block animate-blink delay-800 text-orange-500">_</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-8 max-w-xl text-sm md:text-base text-slate-600 leading-relaxed animate-fade-up" style={{ animationDelay: "900ms" }}>
          Build synthetic consumer panels from any demographic. Test ads, brand
          messaging, and product concepts before you spend on media. Structured
          reactions from realistic personas — in minutes, not weeks.
        </p>

        {/* CTA row */}
        <div className="mt-10 flex items-center gap-3 animate-fade-up" style={{ animationDelay: "1100ms" }}>
          <a href={STUDIO_URL} className="btn-primary-light px-6 py-3 rounded-md text-sm font-medium">
            launch studio →
          </a>
          <a href="#how-it-works" className="btn-ghost-light px-6 py-3 rounded-md text-sm font-medium">
            see how it works
          </a>
        </div>

        {/* Supporting proof line */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-500 animate-fade-up" style={{ animationDelay: "1300ms" }}>
          <span className="text-slate-500">no signup</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500">bring your own api key</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500">open source</span>
        </div>

        {/* Studio preview mockup */}
        <div className="mt-16 flex justify-center w-full animate-fade-up" style={{ animationDelay: "1500ms" }}>
          <StudioPreview />
        </div>
      </div>
    </section>
  );
}
