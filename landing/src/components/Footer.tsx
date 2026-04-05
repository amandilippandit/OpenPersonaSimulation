const COLS = [
  {
    heading: "product",
    links: [
      { label: "studio", href: "http://localhost:3000" },
      { label: "autoresearch", href: "https://github.com/amandilippandit/OpenPersonaSimulation/tree/auto/autoresearch" },
      { label: "python library", href: "https://github.com/amandilippandit/OpenPersonaSimulation#quickstart" },
    ],
  },
  {
    heading: "developers",
    links: [
      { label: "github", href: "https://github.com/amandilippandit/OpenPersonaSimulation" },
      { label: "docs", href: "https://github.com/amandilippandit/OpenPersonaSimulation#readme" },
      { label: "examples", href: "https://github.com/amandilippandit/OpenPersonaSimulation/tree/main/examples" },
    ],
  },
  {
    heading: "resources",
    links: [
      { label: "cookbook", href: "https://github.com/amandilippandit/OpenPersonaSimulation#cookbook" },
      { label: "workflows", href: "https://github.com/amandilippandit/OpenPersonaSimulation#workflows" },
      { label: "api reference", href: "https://github.com/amandilippandit/OpenPersonaSimulation#api" },
    ],
  },
  {
    heading: "company",
    links: [
      { label: "about", href: "#" },
      { label: "contact", href: "#" },
      { label: "license", href: "https://github.com/amandilippandit/OpenPersonaSimulation/blob/main/LICENSE" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-200/70 px-6 py-16 bg-[#fafafa]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-orange-400 to-orange-600" />
              <span className="text-sm font-semibold text-slate-900">openpersona</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              synthetic consumer panels for marketing content testing.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.heading}>
              <div className="text-xs uppercase tracking-wider text-slate-500 mb-4">
                {col.heading}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8 border-t border-slate-200/70">
          <div className="text-xs text-slate-400 font-mono">
            © {new Date().getFullYear()} openpersona · mit license
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>v0.7.0</span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              system operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
