interface ProgressDotsProps {
  /** Nombre total de dots */
  total: number;
  /** Index de la question courante (0-based) */
  current: number;
  /** Couleur accent — défaut bleu encre OHé */
  accentColor?: string;
}

export function ProgressDots({
  total,
  current,
  accentColor = "var(--color-ohe-accent)",
}: ProgressDotsProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => {
        const isDone = i < current;
        const isCurrent = i === current;

        return (
          <div
            key={i}
            className="rounded-[2px] transition-all duration-300"
            style={{
              width: isCurrent ? 18 : 8,
              height: 3,
              background: isCurrent || isDone ? accentColor : "var(--color-ohe-line)",
              opacity: isCurrent ? 1 : isDone ? 0.9 : 1,
            }}
          />
        );
      })}
    </div>
  );
}
