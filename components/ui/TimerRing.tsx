interface TimerRingProps {
  /** Secondes restantes */
  secondsRemaining: number;
  /** Durée totale (pour calculer le pourcentage) */
  totalSeconds: number;
  /** Diamètre du ring en px */
  size?: number;
}

export function TimerRing({
  secondsRemaining,
  totalSeconds,
  size = 44,
}: TimerRingProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.max(0, Math.min(1, secondsRemaining / totalSeconds));
  const dashOffset = circumference * (1 - ratio);

  // Format mm:ss
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const display =
    minutes > 0
      ? `${minutes}:${String(seconds).padStart(2, "0")}`
      : String(seconds).padStart(2, "0");

  return (
    <div className="flex items-center gap-3.5">
      <span className="ohe-eyebrow text-ohe-muted" style={{ letterSpacing: "0.28em" }}>
        Temps
      </span>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Track de fond */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-ohe-line)"
            strokeWidth="2"
          />
          {/* Progression */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-ohe-accent)"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div
          className="absolute inset-0 grid place-items-center font-serif italic text-ohe-ink"
          style={{ fontSize: minutes > 0 ? 12 : 14 }}
        >
          {display}
        </div>
      </div>
    </div>
  );
}
