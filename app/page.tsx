import { Logo, Eyebrow, PrimaryButton, Portrait, Badge } from "@/components/ui";

export default function Home() {
  return (
    <main className="min-h-screen bg-ohe-bg p-14">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <Logo variant="accent" />
          <Badge>Démo · gratuite</Badge>
        </div>

        <div className="space-y-6">
          <Eyebrow tone="accent">D E S I G N &nbsp; S Y S T E M &nbsp; O H É</Eyebrow>

          <h1 className="text-[60px] leading-[1.02] tracking-[-0.025em] font-normal text-balance">
            Évaluez votre<br />
            niveau en{" "}
            <span className="font-serif italic text-ohe-accent">français</span>.
          </h1>

          <p className="text-base text-ohe-muted max-w-[520px] text-pretty">
            Bibliothèque de composants OHé. Si tu vois ce texte avec une police
            sans-serif lisible et le mot "français" en italique avec un sérif
            élégant en bleu encre, on est bon.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <PrimaryButton>Démarrer la démo</PrimaryButton>
          <PrimaryButton variant="outline">Voir un exemple</PrimaryButton>
        </div>

        <div className="flex items-center gap-4 pt-6 border-t border-ohe-line">
          <Portrait size={42} />
          <div>
            <div className="ohe-caption text-ohe-muted">Conçu par</div>
            <div className="text-sm mt-0.5">
              Roxane Joannidès <span className="text-ohe-muted">· Dr. sciences du langage</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}