const EMOTION_COLORS: Record<string, string> = {
  calm: "#94a3b8",
  happy: "#94a3b8",
  frustrated: "#94a3b8",
  excited: "#94a3b8",
  neutral: "#94a3b8",
  angry: "#94a3b8",
  sad: "#94a3b8",
  anxious: "#94a3b8",
  curious: "#94a3b8",
  content: "#94a3b8",
  bored: "#94a3b8",
};

const DEFAULT_COLOR = "#64748b";

export function emotionToColor(emotions: string | undefined | null): string {
  if (!emotions) return DEFAULT_COLOR;
  const lower = emotions.toLowerCase();
  for (const [emotion, color] of Object.entries(EMOTION_COLORS)) {
    if (lower.includes(emotion)) return color;
  }
  return DEFAULT_COLOR;
}

const ACTION_COLORS: Record<string, { bg: string; text: string }> = {
  TALK: { bg: "bg-green-500/20", text: "text-green-400" },
  THINK: { bg: "bg-purple-500/20", text: "text-purple-400" },
  DONE: { bg: "bg-gray-500/20", text: "text-gray-400" },
  REACH_OUT: { bg: "bg-blue-500/20", text: "text-blue-400" },
  LISTEN: { bg: "bg-amber-500/20", text: "text-amber-400" },
};

export function actionTypeStyle(type: string): { bg: string; text: string } {
  return ACTION_COLORS[type?.toUpperCase()] || { bg: "bg-gray-500/20", text: "text-gray-400" };
}

export function nodeSize(actionsCount: number): number {
  return Math.min(20 + actionsCount * 2, 50);
}

