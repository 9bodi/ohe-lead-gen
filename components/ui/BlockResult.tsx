import type { BlockLevel } from "@/lib/scoring/compute";

const COLOR_CLASSES = {
  red: {
    dot: "bg-red-500",
    text: "text-red-600",
    badge: "bg-red-50 text-red-700 border-red-200",
  },
  orange: {
    dot: "bg-orange-500",
    text: "text-orange-600",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
  },
  blue: {
    dot: "bg-blue-500",
    text: "text-blue-600",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  green: {
    dot: "bg-emerald-500",
    text: "text-emerald-600",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
} as const;

type VisibleProps = {
  mode: "visible";
  num: string;
  title: string;
  correct: number;
  total: number;
  level: BlockLevel;
  label: string;
  color: "red" | "orange" | "blue" | "green";
};

type LockedProps = {
  mode: "locked";
  num: string;
  title: string;
};

type BlockResultProps = VisibleProps | LockedProps;

export function BlockResult(props: BlockResultProps) {
  if (props.mode === "locked") {
    return (
      <div className="grid grid-cols-[32px_1fr] sm:grid-cols-[40px_1fr_auto] items-center gap-3 sm:gap-4 py-4 border-b border-ohe-line-soft">
        <div className="ohe-caption text-ohe-muted opacity-40">{props.num}</div>
        <div className="flex items-center gap-3">
          <span className="text-[17px] sm:text-[18px] text-ohe-muted opacity-50">
            {props.title}
          </span>
          <LockIcon />
        </div>
        <div className="hidden sm:block text-[12px] text-ohe-muted opacity-60">
          Disponible avec le diagnostic complet
        </div>
      </div>
    );
  }

  const colors = COLOR_CLASSES[props.color];
  const percent = Math.round((props.correct / props.total) * 100);

  return (
    <div className="grid grid-cols-[32px_1fr] sm:grid-cols-[40px_1fr_auto_auto] items-center gap-x-3 gap-y-2 sm:gap-4 py-4 border-b border-ohe-line">
      <div className="ohe-caption text-ohe-accent">{props.num}</div>
      <div className="flex items-center gap-3">
        <span className={`w-2 h-2 rounded-full shrink-0 ${colors.dot}`} />
        <span className="text-[18px] sm:text-[20px] text-ohe-ink">
          {props.title}
        </span>
      </div>
      {/* Score + badge : sous le titre sur mobile, en ligne dès sm */}
      <div className="col-start-2 sm:col-start-3 flex items-center gap-3 sm:gap-4 sm:contents">
        <div className="text-[16px] sm:text-[18px] text-ohe-ink tabular-nums font-medium">
          {percent} %
        </div>
        <div
          className={`px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] rounded-full border ${colors.badge}`}
        >
          {props.label}
        </div>
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="text-ohe-muted opacity-60 shrink-0"
    >
      <rect x="2" y="6" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 6V4a3 3 0 1 1 6 0v2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
