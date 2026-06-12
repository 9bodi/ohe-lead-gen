"use client";

// Toile d'araignée "teaser" pour la page bilan freemium.
// Affiche les 6 compétences avec des valeurs fictives équilibrées en grisé,
// pour donner un aperçu visuel du diagnostic complet.

type Competence = {
  label: string;
  value: number; // 0-100
};

const COMPETENCES: Competence[] = [
  { label: "Singulier/pluriel", value: 72 },
  { label: "Conjugaison", value: 68 },
  { label: "Participe passé", value: 60 },
  { label: "Orthographe des mots", value: 75 },
  { label: "Syntaxe", value: 63 },
  { label: "Compréhension", value: 78 },
];

// Configuration de la toile
const SIZE = 480; // viewBox carré
const CENTER = SIZE / 2;
const RADIUS = 160; // rayon de la toile pleine (100%)
const RINGS = 5; // 20, 40, 60, 80, 100

// Convertit un point polaire (angle, rayon) en cartésien
function polarToCartesian(angle: number, r: number) {
  return {
    x: CENTER + r * Math.cos(angle - Math.PI / 2),
    y: CENTER + r * Math.sin(angle - Math.PI / 2),
  };
}

// Position des labels (légèrement à l'extérieur du rayon max)
function labelPosition(angle: number) {
  const r = RADIUS + 28;
  return polarToCartesian(angle, r);
}

// Construit les points du polygone de valeurs
function buildValuePolygon(values: number[]): string {
  const N = values.length;
  return values
    .map((v, i) => {
      const angle = (i / N) * 2 * Math.PI;
      const r = (v / 100) * RADIUS;
      const { x, y } = polarToCartesian(angle, r);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

// Construit un polygone de référence (cercle approximé en hexagone)
function buildRingPolygon(ringIndex: number): string {
  const N = COMPETENCES.length;
  const r = ((ringIndex + 1) / RINGS) * RADIUS;
  return Array.from({ length: N })
    .map((_, i) => {
      const angle = (i / N) * 2 * Math.PI;
      const { x, y } = polarToCartesian(angle, r);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function RadarChart() {
  const N = COMPETENCES.length;
  const values = COMPETENCES.map((c) => c.value);
  const valuePolygon = buildValuePolygon(values);

  return (
    <div className="w-full max-w-[520px] mx-auto">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        style={{ overflow: "visible" }}
        aria-hidden="true"
      >
        {/* Gradient subtil pour la zone */}
        <defs>
          <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#15171C" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#15171C" stopOpacity="0.18" />
          </radialGradient>
        </defs>

        {/* Anneaux concentriques (5 niveaux : 20%, 40%, 60%, 80%, 100%) */}
        {Array.from({ length: RINGS }).map((_, i) => (
          <polygon
            key={`ring-${i}`}
            points={buildRingPolygon(i)}
            fill="none"
            stroke="#15171C"
            strokeOpacity={i === RINGS - 1 ? 0.18 : 0.1}
            strokeWidth={i === RINGS - 1 ? 1 : 0.8}
          />
        ))}

        {/* Axes radiaux (6 lignes du centre vers les sommets) */}
        {Array.from({ length: N }).map((_, i) => {
          const angle = (i / N) * 2 * Math.PI;
          const { x, y } = polarToCartesian(angle, RADIUS);
          return (
            <line
              key={`axis-${i}`}
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              stroke="#15171C"
              strokeOpacity={0.08}
              strokeWidth={0.8}
            />
          );
        })}

        {/* Zone des valeurs (grisée) */}
        <polygon
          points={valuePolygon}
          fill="url(#radarFill)"
          stroke="#6A6E78"
          strokeWidth={2}
          strokeOpacity={0.5}
          strokeLinejoin="round"
        />

        {/* Points aux sommets */}
        {values.map((v, i) => {
          const angle = (i / N) * 2 * Math.PI;
          const r = (v / 100) * RADIUS;
          const { x, y } = polarToCartesian(angle, r);
          return (
            <circle
              key={`dot-${i}`}
              cx={x}
              cy={y}
              r={4}
              fill="#6A6E78"
              fillOpacity={0.7}
            />
          );
        })}

        {/* Labels des compétences (autour) */}
        {COMPETENCES.map((c, i) => {
          const angle = (i / N) * 2 * Math.PI;
          const { x, y } = labelPosition(angle);
          // Anchor selon la position angulaire
          const cosA = Math.cos(angle - Math.PI / 2);
          let textAnchor: "start" | "middle" | "end" = "middle";
          if (cosA > 0.3) textAnchor = "start";
          else if (cosA < -0.3) textAnchor = "end";

          // Gestion des labels longs sur 2 lignes ("Orthographe des mots")
          const parts = c.label.split(" ");
          const isLong = c.label.length > 14 && parts.length > 1;
          const line1 = isLong ? parts.slice(0, Math.ceil(parts.length / 2)).join(" ") : c.label;
          const line2 = isLong ? parts.slice(Math.ceil(parts.length / 2)).join(" ") : "";

          return (
            <text
              key={`label-${i}`}
              x={x}
              y={y}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              fill="#15171C"
              fillOpacity={0.7}
              fontSize="13"
              fontFamily="var(--font-instrument-sans), 'Instrument Sans', system-ui, sans-serif"
              fontWeight={500}
            >
              {isLong ? (
                <>
                  <tspan x={x} dy="-0.5em">{line1}</tspan>
                  <tspan x={x} dy="1.2em">{line2}</tspan>
                </>
              ) : (
                c.label
              )}
            </text>
          );
        })}
      </svg>
    </div>
  );
}