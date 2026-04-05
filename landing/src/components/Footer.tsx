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
    <footer className="relative border-t border-ink-800/50 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-400 to-purple-500" />
              <span className="text-sm font-semibold text-ink-200">openpersona</span>
            </div>
            <p className="text-xs text-ink-500 leading-relaxed">
              synthetic consumer panels for marketing content testing.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.heading}>
              <div className="text-xs uppercase tracking-wider text-ink-500 mb-4">
                {col.heading}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-ink-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8 border-t border-ink-800/50">
          <div className="text-xs text-ink-600 font-mono">
            © {new Date().getFullYear()} openpersona · mit license
          </div>
          <div className="flex items-center gap-4 text-xs text-ink-600">
            <span>v0.7.0</span>
            <span className="text-ink-800">·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              system operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
