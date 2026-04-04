const EMOTION_COLORS: Record<string, string> = {
  calm: "#3B82F6",
  happy: "#22C55E",
  frustrated: "#EF4444",
  excited: "#F59E0B",
  neutral: "#6B7280",
  angry: "#EF4444",
  sad: "#3B82F6",
  anxious: "#F59E0B",
  curious: "#8B5CF6",
  content: "#22C55E",
  bored: "#6B7280",
};

const DEFAULT_COLOR = "#8B5CF6";

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
  return Math.min(8 + actionsCount * 0.5, 20);
}
