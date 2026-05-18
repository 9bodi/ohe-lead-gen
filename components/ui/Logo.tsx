interface LogoProps {
  /** Variante : "default" (ink) ou "accent" (bleu encre) */
  variant?: "default" | "accent";
  /** Taille du wordmark "OHé" */
  size?: "sm" | "md";
}

export function Logo({ variant = "default", size = "md" }: LogoProps) {
  const colorClass = variant === "accent" ? "text-ohe-accent" : "text-ohe-ink";
  const wordmarkSize = size === "sm" ? "text-[22px]" : "text-[26px]";
  const captionOpacity = variant === "accent" ? "opacity-75" : "opacity-60";

  return (
    <div className={`flex items-baseline gap-4 ${colorClass}`}>
      <span className={`font-serif italic ${wordmarkSize} tracking-tight`}>
        OHé
      </span>
      <span className={`ohe-caption ${captionOpacity}`}>
        Diagnostic
      </span>
    </div>
  );
}