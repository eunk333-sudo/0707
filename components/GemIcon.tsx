type ShapeProps = { fill: string; opacity: number };

function ShapeBrilliant({ fill, opacity }: ShapeProps) {
  return (
    <>
      <polygon points="12,2 20,10 12,22 4,10" fill={fill} opacity={opacity} stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
      <polygon points="12,2 20,10 12,10" fill="rgba(255,255,255,0.38)" />
      <polygon points="4,10 12,10 12,22" fill="rgba(0,0,0,0.12)" />
      <polygon points="12,10 20,10 12,22" fill="rgba(0,0,0,0.06)" />
    </>
  );
}

function ShapeRound({ fill, opacity }: ShapeProps) {
  return (
    <>
      <circle cx="12" cy="12" r="10" fill={fill} opacity={opacity} stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
      <ellipse cx="9" cy="8.5" rx="3.4" ry="2.1" fill="rgba(255,255,255,0.4)" />
      <path d="M4 14 A9 9 0 0 0 14 21.6" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function ShapeEmeraldCut({ fill, opacity }: ShapeProps) {
  return (
    <>
      <polygon points="7,3 17,3 21,8 21,16 17,21 7,21 3,16 3,8" fill={fill} opacity={opacity} stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
      <polygon points="7,3 17,3 14,7 10,7" fill="rgba(255,255,255,0.35)" />
      <polygon points="3,8 3,16 7,21 7,3" fill="rgba(0,0,0,0.1)" opacity="0.6" />
    </>
  );
}

function ShapeHexagon({ fill, opacity }: ShapeProps) {
  return (
    <>
      <polygon points="12,1 21,6.5 21,17.5 12,23 3,17.5 3,6.5" fill={fill} opacity={opacity} stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
      <polygon points="12,1 21,6.5 12,10" fill="rgba(255,255,255,0.35)" />
      <polygon points="3,6.5 12,1 12,10" fill="rgba(255,255,255,0.16)" />
    </>
  );
}

function ShapeTeardrop({ fill, opacity }: ShapeProps) {
  return (
    <>
      <path
        d="M12 1 C18 8 21 13 21 16 A9 9 0 1 1 3 16 C3 13 6 8 12 1 Z"
        fill={fill}
        opacity={opacity}
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="0.6"
      />
      <ellipse cx="10" cy="14.5" rx="2.6" ry="1.7" fill="rgba(255,255,255,0.35)" />
    </>
  );
}

function ShapeMarquise({ fill, opacity }: ShapeProps) {
  return (
    <>
      <path
        d="M12 1 C19 6 21.5 12 21.5 12 C21.5 12 19 18 12 23 C5 18 2.5 12 2.5 12 C2.5 12 5 6 12 1 Z"
        fill={fill}
        opacity={opacity}
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="0.6"
      />
      <path d="M12 1 C16 5 18.5 9 19.2 12 L12 12 Z" fill="rgba(255,255,255,0.32)" />
    </>
  );
}

function ShapeSquareCut({ fill, opacity }: ShapeProps) {
  return (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" fill={fill} opacity={opacity} stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
      <polygon points="4,4 20,4 14,10 10,10" fill="rgba(255,255,255,0.32)" />
      <polygon points="4,4 4,20 10,14 10,10" fill="rgba(0,0,0,0.1)" />
    </>
  );
}

function ShapePentagon({ fill, opacity }: ShapeProps) {
  return (
    <>
      <polygon points="12,1 21,9 17,23 7,23 3,9" fill={fill} opacity={opacity} stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
      <polygon points="12,1 21,9 12,9" fill="rgba(255,255,255,0.38)" />
      <polygon points="3,9 12,9 7,23" fill="rgba(0,0,0,0.18)" />
      <polygon points="12,9 21,9 17,23 7,23" fill="rgba(0,0,0,0.08)" />
    </>
  );
}

const SHAPES = [ShapeBrilliant, ShapeRound, ShapeEmeraldCut, ShapeHexagon, ShapeTeardrop, ShapeMarquise, ShapeSquareCut, ShapePentagon];

const GEM_STYLES: Record<string, { fill: string; glow: string; shape: (typeof SHAPES)[number] }> = {
  // vivid blue
  "크리에이티브 디렉션": { fill: "#3b5bfa", glow: "rgba(59,91,250,0.6)", shape: ShapeHexagon },
  // vivid mint
  "크리에이티브 브리프": { fill: "#0fd6a0", glow: "rgba(15,214,160,0.6)", shape: ShapeEmeraldCut },
  "Brief": { fill: "#0fd6a0", glow: "rgba(15,214,160,0.6)", shape: ShapeEmeraldCut },
  // vivid orange
  "AI 프롬프트": { fill: "#ff8c1a", glow: "rgba(255,140,26,0.6)", shape: ShapeBrilliant },
  // vivid sky/cyan
  "이미지 프롬프트": { fill: "#0ea5f5", glow: "rgba(14,165,245,0.6)", shape: ShapeRound },
  // vivid yellow
  "영상 프롬프트": { fill: "#ffd60a", glow: "rgba(255,214,10,0.6)", shape: ShapeMarquise },
  // vivid green
  "브랜드 자산": { fill: "#4ade36", glow: "rgba(74,222,54,0.6)", shape: ShapeSquareCut },
  // vivid pink/magenta
  "브랜드 확장": { fill: "#ff3fb4", glow: "rgba(255,63,180,0.6)", shape: ShapeTeardrop },
};
const DEFAULT_GEM_STYLE = { fill: "#e6b325", glow: "rgba(230,179,37,0.55)" };

const SIZE_BY_TIER = [0, 20, 26, 32, 38, 44];
const MAX_TIER = 5;

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getGemAccentColor(subject: string): string {
  if (subject === "브랜드 정의") return "#a020f0";
  return (GEM_STYLES[subject] ?? DEFAULT_GEM_STYLE).fill;
}

// The brand-DNA card gets an actual double-helix icon instead of a gem —
// it's the one subject that isn't really a "gem" in the collection.
function DnaIcon({ size, tier }: { size: number; tier: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="shrink-0"
      style={{ filter: `drop-shadow(0 0 ${2 + tier * 2}px rgba(160,32,240,0.6))` }}
    >
      <path d="M7 2c0 4 10 4 10 8s-10 4-10 8" fill="none" stroke="#a020f0" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M17 2c0 4-10 4-10 8s10 4 10 8" fill="none" stroke="#e0aaff" strokeWidth="1.7" strokeLinecap="round" />
      <line x1="8.1" y1="4.3" x2="15.9" y2="4.3" stroke="#a020f0" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
      <line x1="7.1" y1="10" x2="16.9" y2="10" stroke="#a020f0" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
      <line x1="8.1" y1="19.7" x2="15.9" y2="19.7" stroke="#a020f0" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

export function GemIcon({ subject, level }: { subject: string; level: number }) {
  const tier = Math.min(Math.max(level, 1), MAX_TIER);
  const size = SIZE_BY_TIER[tier];

  if (subject === "브랜드 정의") {
    return <DnaIcon size={size} tier={tier} />;
  }

  const style = GEM_STYLES[subject];
  const Shape = style?.shape ?? SHAPES[hashString(subject) % SHAPES.length];
  const { fill, glow } = style ?? DEFAULT_GEM_STYLE;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="shrink-0"
      style={{ filter: `drop-shadow(0 0 ${2 + tier * 2}px ${glow})` }}
    >
      <Shape fill={fill} opacity={0.6 + tier * 0.08} />
    </svg>
  );
}
