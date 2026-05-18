interface PortraitProps {
  initials?: string;
  size?: number;
}

export function Portrait({ initials = "RJ", size = 42 }: PortraitProps) {
  return (
    <div
      className="rounded-full grid place-items-center font-serif italic text-ohe-ink border border-ohe-line"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: `repeating-linear-gradient(135deg, var(--color-ohe-accent-soft), var(--color-ohe-accent-soft) 4px, transparent 4px, transparent 8px), var(--color-ohe-line-soft)`,
      }}
    >
      {initials}
    </div>
  );
}
