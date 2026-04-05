"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// ---------- Marketing Profiles ----------
interface Profile {
  initials: string;
  name: string;
  age: number;
  location: string;
  segment: string;
  channel: string;
  priceBand: "budget" | "mid" | "premium" | "luxury";
  loyalty: "low" | "medium" | "high";
  description: string;
  tags: string[];
  avatarId: number;
}

const PROFILES: Profile[] = [
  {
    initials: "MC",
    name: "Maya Chen",
    age: 24,
    location: "Los Angeles",
    segment: "Gen Z Creator",
    channel: "TikTok · Instagram",
    priceBand: "mid",
    loyalty: "low",
    description: "Chases authenticity, tries new brands weekly, skeptical of traditional ads.",
    tags: ["Gen Z", "Female", "Urban", "Beauty & Lifestyle"],
    avatarId: 5,
  },
  {
    initials: "BT",
    name: "Ben Thompson",
    age: 38,
    location: "Columbus, OH",
    segment: "Value Seeker",
    channel: "Email · Search",
    priceBand: "budget",
    loyalty: "medium",
    description: "Compares prices carefully, reads reviews, waits for sales.",
    tags: ["Gen X", "Male", "Suburban", "Family"],
    avatarId: 9,
  },
  {
    initials: "PK",
    name: "Priya Kapoor",
    age: 33,
    location: "New York",
    segment: "Luxury Millennial",
    channel: "Instagram · Podcast",
    priceBand: "luxury",
    loyalty: "high",
    description: "Pays premium for quality and story, brand-loyal once earned.",
    tags: ["Millennial", "Female", "Urban", "Finance"],
    avatarId: 47,
  },
  {
    initials: "TH",
    name: "Tom Henderson",
    age: 52,
    location: "Austin",
    segment: "Practical Buyer",
    channel: "Search · TV",
    priceBand: "mid",
    loyalty: "medium",
    description: "Buys what works, avoids trends, rewards reliability.",
    tags: ["Gen X", "Male", "Urban", "Professional"],
    avatarId: 11,
  },
  {
    initials: "SL",
    name: "Sophie Laurent",
    age: 29,
    location: "Montreal",
    segment: "Brand Advocate",
    channel: "Instagram · Referral",
    priceBand: "premium",
    loyalty: "high",
    description: "Champions favorite brands, recommends to everyone in her network.",
    tags: ["Millennial", "Female", "Urban", "Creative"],
    avatarId: 25,
  },
  {
    initials: "DW",
    name: "David Walker",
    age: 31,
    location: "Seattle",
    segment: "Early Adopter",
    channel: "YouTube · Reddit",
    priceBand: "premium",
    loyalty: "low",
    description: "First in line for new tech, moves on once it's mainstream.",
    tags: ["Millennial", "Male", "Urban", "Tech"],
    avatarId: 13,
  },
  {
    initials: "EM",
    name: "Elena Morales",
    age: 27,
    location: "Miami",
    segment: "Impulse Shopper",
    channel: "Instagram · TikTok",
    priceBand: "mid",
    loyalty: "low",
    description: "Decides fast, shops emotionally, justifies the purchase later.",
    tags: ["Millennial", "Female", "Urban", "Fashion"],
    avatarId: 36,
  },
  {
    initials: "MR",
    name: "Marcus Reed",
    age: 35,
    location: "Portland",
    segment: "Eco-Conscious",
    channel: "Podcast · Email",
    priceBand: "premium",
    loyalty: "high",
    description: "Checks sustainability before price, boycotts greenwashing.",
    tags: ["Millennial", "Male", "Urban", "Outdoor"],
    avatarId: 44,
  },
  {
    initials: "LF",
    name: "Laura Fitzgerald",
    age: 45,
    location: "Boston",
    segment: "Loyal Customer",
    channel: "Email · Direct Mail",
    priceBand: "mid",
    loyalty: "high",
    description: "Sticks with what she knows, switches only after disappointment.",
    tags: ["Gen X", "Female", "Suburban", "Healthcare"],
    avatarId: 16,
  },
  {
    initials: "RN",
    name: "Ryan Nakamura",
    age: 26,
    location: "San Francisco",
    segment: "Social Influencer",
    channel: "TikTok · LinkedIn",
    priceBand: "premium",
    loyalty: "medium",
    description: "Tests products publicly, opinions shape his followers.",
    tags: ["Millennial", "Male", "Urban", "Media"],
    avatarId: 33,
  },
  {
    initials: "GC",
    name: "Grace Coleman",
    age: 41,
    location: "Denver",
    segment: "Premium Health",
    channel: "Podcast · Instagram",
    priceBand: "luxury",
    loyalty: "high",
    description: "Invests heavily in wellness, researches every ingredient.",
    tags: ["Gen X", "Female", "Urban", "Wellness"],
    avatarId: 20,
  },
  {
    initials: "CV",
    name: "Carlos Vega",
    age: 23,
    location: "Chicago",
    segment: "Trend Follower",
    channel: "TikTok · Instagram",
    priceBand: "mid",
    loyalty: "low",
    description: "Wears what's hot, discards what's not, always watching the feed.",
    tags: ["Gen Z", "Male", "Urban", "Streetwear"],
    avatarId: 12,
  },
  {
    initials: "NP",
    name: "Nina Park",
    age: 36,
    location: "Toronto",
    segment: "Researcher",
    channel: "Search · Reviews",
    priceBand: "mid",
    loyalty: "medium",
    description: "Reads every review, compares specs, buys with confidence.",
    tags: ["Millennial", "Female", "Urban", "Science"],
    avatarId: 19,
  },
  {
    initials: "JM",
    name: "Jake Morrison",
    age: 29,
    location: "Phoenix",
    segment: "Convenience First",
    channel: "App · Search",
    priceBand: "mid",
    loyalty: "medium",
    description: "Values speed over savings, pays more for frictionless checkout.",
    tags: ["Millennial", "Male", "Urban", "Sales"],
    avatarId: 15,
  },
  {
    initials: "AP",
    name: "Amelia Price",
    age: 48,
    location: "Minneapolis",
    segment: "Skeptic",
    channel: "Word of Mouth",
    priceBand: "mid",
    loyalty: "medium",
    description: "Trusts people over brands, demands proof before purchase.",
    tags: ["Gen X", "Female", "Suburban", "Education"],
    avatarId: 22,
  },
  {
    initials: "ZD",
    name: "Zach Diaz",
    age: 34,
    location: "Dallas",
    segment: "Sports Enthusiast",
    channel: "YouTube · TV",
    priceBand: "premium",
    loyalty: "high",
    description: "Loyal to performance brands, pays for gear that delivers.",
    tags: ["Millennial", "Male", "Urban", "Fitness"],
    avatarId: 68,
  },
  {
    initials: "OB",
    name: "Olivia Brooks",
    age: 21,
    location: "Atlanta",
    segment: "Beauty Obsessed",
    channel: "TikTok · Instagram",
    priceBand: "mid",
    loyalty: "low",
    description: "Follows beauty trends, restocks quickly, tries new formulas monthly.",
    tags: ["Gen Z", "Female", "Urban", "Beauty"],
    avatarId: 31,
  },
  {
    initials: "NK",
    name: "Noah King",
    age: 32,
    location: "Brooklyn",
    segment: "Minimalist",
    channel: "Newsletter · Podcast",
    priceBand: "premium",
    loyalty: "high",
    description: "Buys less, buys better, holds onto items for years.",
    tags: ["Millennial", "Male", "Urban", "Design"],
    avatarId: 45,
  },
  {
    initials: "IS",
    name: "Isla Silva",
    age: 39,
    location: "San Diego",
    segment: "Home Curator",
    channel: "Pinterest · Instagram",
    priceBand: "premium",
    loyalty: "medium",
    description: "Invests in home aesthetic, mixes high and low thoughtfully.",
    tags: ["Gen X", "Female", "Suburban", "Home"],
    avatarId: 40,
  },
  {
    initials: "LF",
    name: "Lucas Ford",
    age: 28,
    location: "Nashville",
    segment: "Foodie",
    channel: "Instagram · YouTube",
    priceBand: "premium",
    loyalty: "medium",
    description: "Discovers through Instagram, pays premium for specialty ingredients.",
    tags: ["Millennial", "Male", "Urban", "Food"],
    avatarId: 52,
  },
];

// ---------- Generate nodes on a 3D sphere using Fibonacci distribution ----------
function fibonacciSphere(n: number) {
  const nodes: { x: number; y: number; z: number }[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2; // y goes from 1 to -1
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    nodes.push({
      x: Math.cos(theta) * r,
      y,
      z: Math.sin(theta) * r,
    });
  }
  return nodes;
}

function rotate(
  x: number,
  y: number,
  z: number,
  angleY: number,
  angleX: number
) {
  // Rotate around Y-axis
  const cosY = Math.cos(angleY);
  const sinY = Math.sin(angleY);
  const rx = x * cosY + z * sinY;
  const rz = -x * sinY + z * cosY;
  // Rotate around X-axis
  const cosX = Math.cos(angleX);
  const sinX = Math.sin(angleX);
  const ry = y * cosX - rz * sinX;
  const rz2 = y * sinX + rz * cosX;
  return { x: rx, y: ry, z: rz2 };
}

const SPHERE_RADIUS = 260;
const CAMERA_Z = 900;
const VIEW_W = 1000;
const VIEW_H = 700;
const CENTER = { x: 500, y: 350 };

export default function AnimatedGraph() {
  const basePositions = useMemo(() => fibonacciSphere(PROFILES.length), []);
  const [angle, setAngle] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const rafRef = useRef<number>();

  // Continuous rotation via requestAnimationFrame
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      setAngle((now - start) / 1000);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Cycle active profile every 4 seconds (when not hovering)
  useEffect(() => {
    const interval = setInterval(() => {
      if (hoveredIdx === null) {
        setActiveIdx((i) => (i + 1) % PROFILES.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [hoveredIdx]);

  // Project all nodes to 2D with perspective
  const projectedNodes = basePositions.map((p, i) => {
    const r = rotate(p.x, p.y, p.z, angle * 0.35, angle * 0.15);
    const scale = CAMERA_Z / (CAMERA_Z - r.z * SPHERE_RADIUS);
    return {
      idx: i,
      x: CENTER.x + r.x * SPHERE_RADIUS * scale,
      y: CENTER.y + r.y * SPHERE_RADIUS * scale,
      z: r.z, // -1 (back) to 1 (front)
      scale,
    };
  });

  // Sort back-to-front for correct layering
  const sorted = [...projectedNodes].sort((a, b) => a.z - b.z);

  const currentIdx = hoveredIdx ?? activeIdx;
  const activeNode = projectedNodes[currentIdx];
  const activeProfile = PROFILES[currentIdx];

  // Determine card side based on active node position
  const cardSide = activeNode.x > CENTER.x ? "left" : "right";

  return (
    <div className="relative w-full max-w-5xl mx-auto aspect-[10/7]">
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full h-full">
        <defs>
          <filter id="activeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges from active node to nearest projected neighbors */}
        <g>
          {(() => {
            const active = projectedNodes[currentIdx];
            const neighbors = projectedNodes
              .filter((n) => n.idx !== currentIdx && n.z > -0.2)
              .map((n) => ({
                ...n,
                d: Math.hypot(n.x - active.x, n.y - active.y),
              }))
              .sort((a, b) => a.d - b.d)
              .slice(0, 5);
            return neighbors.map((n) => (
              <line
                key={`edge-${n.idx}`}
                x1={active.x}
                y1={active.y}
                x2={n.x}
                y2={n.y}
                stroke="#94a3b8"
                strokeWidth="0.8"
                opacity="0.4"
              />
            ));
          })()}
        </g>

        {/* Nodes — flat solid fills, rendered back to front */}
        {sorted.map((node) => {
          const isActive = node.idx === currentIdx;
          const baseRadius = 22;
          const radius = baseRadius * node.scale;
          // Deterministic shade based on index (3 flat grays)
          const shadeIdx = node.idx % 3;
          const fillColor = isActive
            ? "#f97316"
            : shadeIdx === 0
              ? "#475569"   // slate-600
              : shadeIdx === 1
                ? "#94a3b8" // slate-400
                : "#cbd5e1"; // slate-300
          const opacity = 0.4 + Math.max(0, (node.z + 1) / 2) * 0.6;

          return (
            <g
              key={`node-${node.idx}`}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoveredIdx(node.idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {isActive && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius + 14}
                  fill="#f97316"
                  opacity="0.18"
                  filter="url(#activeGlow)"
                />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={radius}
                fill={fillColor}
                opacity={isActive ? 1 : opacity}
              />
            </g>
          );
        })}
      </svg>

      {/* Floating profile card */}
      <div
        key={currentIdx}
        className={`absolute top-6 ${
          cardSide === "left" ? "left-2 md:left-6" : "right-2 md:right-6"
        } w-72 md:w-80 pointer-events-none`}
        style={{
          animation: "reactionIn 500ms cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        <div className="rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 p-5">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.pravatar.cc/88?img=${activeProfile.avatarId}`}
                alt={activeProfile.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate">
                {activeProfile.name}
              </div>
              <div className="text-xs text-slate-500 truncate">
                {activeProfile.age} · {activeProfile.location}
              </div>
            </div>
          </div>

          {/* Segment */}
          <div className="flex items-center gap-2 mb-3 p-2.5 rounded-lg bg-orange-50 border border-orange-100">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span className="text-xs font-semibold text-orange-900">
              {activeProfile.segment}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            {activeProfile.description}
          </p>

          {/* Marketing attributes grid */}
          <div className="grid grid-cols-2 gap-2 mb-3 text-[11px] font-mono">
            <div>
              <div className="text-slate-400 uppercase tracking-wider text-[9px] mb-0.5">channel</div>
              <div className="text-slate-700">{activeProfile.channel}</div>
            </div>
            <div>
              <div className="text-slate-400 uppercase tracking-wider text-[9px] mb-0.5">price band</div>
              <div className="text-slate-700 capitalize">{activeProfile.priceBand}</div>
            </div>
            <div>
              <div className="text-slate-400 uppercase tracking-wider text-[9px] mb-0.5">loyalty</div>
              <div className="text-slate-700 capitalize">{activeProfile.loyalty}</div>
            </div>
            <div>
              <div className="text-slate-400 uppercase tracking-wider text-[9px] mb-0.5">segment id</div>
              <div className="text-slate-700">#{String(currentIdx + 1).padStart(2, "0")}</div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {activeProfile.tags.map((t) => (
              <div
                key={t}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-mono text-slate-600"
              >
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Progress dots */}
        <div className="mt-3 flex items-center justify-center gap-1">
          {PROFILES.map((_, i) => (
            <div
              key={i}
              className="h-0.5 rounded-full transition-all duration-300"
              style={{
                width: i === currentIdx ? "12px" : "4px",
                background: i === currentIdx ? "#f97316" : "#cbd5e1",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
