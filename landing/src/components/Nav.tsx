"use client";

import { useState } from "react";

const STUDIO_URL = process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3000";

interface DropdownItem {
  label: string;
  href: string;
  description?: string;
}

interface NavItem {
  label: string;
  items?: DropdownItem[];
  href?: string;
}

const NAV: NavItem[] = [
  {
    label: "product",
    items: [
      { label: "studio", href: STUDIO_URL, description: "3D visual simulation workspace" },
      { label: "autoresearch", href: "https://github.com/amandilippandit/OpenPersonaSimulation/tree/auto/autoresearch", description: "autonomous overnight optimization" },
      { label: "python library", href: "https://github.com/amandilippandit/OpenPersonaSimulation#quickstart", description: "the core engine" },
    ],
  },
  {
    label: "developers",
    items: [
      { label: "github", href: "https://github.com/amandilippandit/OpenPersonaSimulation" },
      { label: "docs", href: "https://github.com/amandilippandit/OpenPersonaSimulation#readme" },
      { label: "examples", href: "https://github.com/amandilippandit/OpenPersonaSimulation/tree/main/examples" },
    ],
  },
  {
    label: "company",
    items: [
      { label: "about", href: "#about" },
      { label: "contact", href: "#contact" },
    ],
  },
  { label: "pricing", href: "#pricing" },
  { label: "docs", href: "https://github.com/amandilippandit/OpenPersonaSimulation#readme" },
];

export default function Nav() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <nav className="relative z-50 border-b border-ink-800/50 bg-ink-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-400 to-purple-500 group-hover:from-indigo-300 group-hover:to-purple-400 transition-colors" />
          <span className="text-sm font-semibold text-ink-300 group-hover:text-white transition-colors">
            openpersona
          </span>
        </a>

        {/* Nav items */}
        <div className="hidden md:flex items-center gap-1 text-sm">
          {NAV.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.items && setOpenMenu(item.label)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              {item.href ? (
                <a
                  href={item.href}
                  className="px-3 py-2 text-ink-400 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <button className="px-3 py-2 text-ink-400 hover:text-white transition-colors flex items-center gap-1">
                  {item.label}
                  <svg
                    className={`w-3 h-3 transition-transform ${openMenu === item.label ? "rotate-180" : ""}`}
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
              )}

              {/* Dropdown */}
              {item.items && openMenu === item.label && (
                <div className="absolute top-full left-0 mt-1 w-64 rounded-lg border border-ink-800 bg-ink-900/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                  {item.items.map((sub) => (
                    <a
                      key={sub.label}
                      href={sub.href}
                      className="block px-4 py-3 hover:bg-ink-800/50 transition-colors"
                    >
                      <div className="text-sm text-ink-200">{sub.label}</div>
                      {sub.description && (
                        <div className="text-xs text-ink-500 mt-0.5">{sub.description}</div>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/amandilippandit/OpenPersonaSimulation"
            className="hidden sm:block text-sm text-ink-400 hover:text-white transition-colors"
          >
            github
          </a>
          <a
            href={STUDIO_URL}
            className="px-4 py-1.5 text-sm border border-ink-700 rounded-md text-ink-200 hover:border-ink-500 hover:text-white hover:bg-ink-900 transition-all"
          >
            launch studio
          </a>
        </div>
      </div>
    </nav>
  );
}
