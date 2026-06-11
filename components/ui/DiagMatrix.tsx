// Aperçu illustratif de la matrice "intérêt × pertinence" du diagnostic complet.
// Version vierge : aucune donnée utilisateur, simple vitrine de ce que révèle le diag complet.

const QUADRANTS = [
  {
    // haut-gauche
    color: "#3B82F6",
    bg: "#EFF6FF",
    title: "À convaincre",
    sub: "Public à sensibiliser",
  },
  {
    // haut-droite
    color: "#10B981",
    bg: "#ECFDF5",
    title: "À former avec OHé",
    sub: "Public prioritaire",
  },
  {
    // bas-gauche
    color: "#EF4444",
    bg: "#FEF2F2",
    title: "À orienter",
    sub: "Vers une autre solution",
  },
  {
    // bas-droite
    color: "#F97316",
    bg: "#FFF7ED",
    title: "À engager",
    sub: "Si besoin identifié",
  },
] as const;

export function DiagMatrix() {
  return (
    <div className="mt-8">
      <div className="text-[13px] text-ohe-muted mb-4">
        Aperçu : la cartographie du diagnostic complet
      </div>

      <div className="flex gap-3">
        {/* Axe vertical (pertinence) */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <span
            className="text-[10px] uppercase tracking-[0.14em] text-ohe-muted whitespace-nowrap"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Pertinence de la solution OHé
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Labels haut (adaptée) */}
          <div className="text-[10px] uppercase tracking-[0.12em] text-ohe-muted text-center mb-2">
            Formation adaptée
          </div>

          {/* Grille 2×2 */}
          <div className="grid grid-cols-2 gap-2">
            {QUADRANTS.map((q) => (
              <div
                key={q.title}
                className="rounded-xl border p-4 sm:p-5 min-h-[92px] flex flex-col justify-center"
                style={{ backgroundColor: q.bg, borderColor: `${q.color}33` }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: q.color }}
                  />
                  <span className="text-[14px] font-medium text-ohe-ink">
                    {q.title}
                  </span>
                </div>
                <div className="text-[12px] text-ohe-muted mt-1 pl-[18px]">
                  {q.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Labels bas (inadaptée) */}
          <div className="text-[10px] uppercase tracking-[0.12em] text-ohe-muted text-center mt-2">
            Formation inadaptée
          </div>

          {/* Axe horizontal (intérêt) */}
          <div className="flex justify-between mt-3 px-1">
            <span className="text-[10px] uppercase tracking-[0.12em] text-ohe-muted">
              Non intéressé
            </span>
            <span className="text-[10px] uppercase tracking-[0.12em] text-ohe-accent font-medium">
              Intérêt pour la formation
            </span>
            <span className="text-[10px] uppercase tracking-[0.12em] text-ohe-muted">
              Intéressé
            </span>
          </div>
        </div>
      </div>

      <p className="text-[12px] text-ohe-muted italic mt-4">
        Le diagnostic complet positionne chaque profil dans cette matrice pour orienter l&apos;action la plus pertinente.
      </p>
    </div>
  );
}
