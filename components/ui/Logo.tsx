import Image from "next/image";

interface LogoProps {
  size?: number;
  withLabel?: boolean;
  variant?: "default" | "white";
}

export function Logo({ size = 48, withLabel = false, variant = "default" }: LogoProps) {
  const isWhite = variant === "white";

  // logo-blanc.png : 479 × 242  → 1.98
  // ohe-logo.png   : 1064 × 561 → 1.90
  const aspectRatio = isWhite ? 1.98 : 1.9;
  const width = Math.round(size * aspectRatio);

  const src = isWhite ? "/images/logo-blanc.png" : "/images/ohe-logo.png";

  return (
    <div className="inline-flex items-center gap-4">
      <Image
        src={src}
        alt="OHé — Orthographe Héros"
        width={width}
        height={size}
        priority
        className="h-auto w-auto max-w-full"
        style={{ maxHeight: size }}
      />
      {withLabel && (
        <span className={`ohe-caption ${isWhite ? "text-white opacity-90" : "text-ohe-accent opacity-75"}`}>
          Diagnostic
        </span>
      )}
    </div>
  );
}
