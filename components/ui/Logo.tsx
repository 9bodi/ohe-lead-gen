import Image from "next/image";

interface LogoProps {
  /** Taille en pixels de la hauteur du logo */
  size?: number;
  /** Affichage en ligne avec ou sans label "Diagnostic" à côté */
  withLabel?: boolean;
}

export function Logo({ size = 48, withLabel = false }: LogoProps) {
  // Ratio approximatif du logo (largeur / hauteur)
  // À ajuster si nécessaire selon les vraies dimensions du PNG
  const aspectRatio = 1.05;
  const width = Math.round(size * aspectRatio);

  return (
    <div className="inline-flex items-center gap-4">
      <Image
        src="/images/ohe-logo.png"
        alt="OHé — Orthographe Héros"
        width={width}
        height={size}
        priority
        style={{
          width: "auto",
          height: size,
          maxWidth: "100%",
        }}
      />
      {withLabel && (
        <span className="ohe-caption text-ohe-accent opacity-75">
          Diagnostic
        </span>
      )}
    </div>
  );
}
