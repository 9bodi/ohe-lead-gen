"use client";

import { useEffect, useState } from "react";

interface FormClientProps {
  campaignSlug: string;
}

type TestPayload = {
  answers: Array<{
    questionId: string;
    choiceKey: string | null;
    answeredInMs: number;
  }>;
  durationMs: number;
};

export function FormClient({ campaignSlug }: FormClientProps) {
  const [payload, setPayload] = useState<TestPayload | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(`test:${campaignSlug}`);
    if (raw) {
      try {
        setPayload(JSON.parse(raw));
      } catch {
        setPayload(null);
      }
    }
  }, [campaignSlug]);

  return (
    <main className="min-h-screen bg-ohe-bg text-ohe-ink px-14 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-baseline gap-4 text-ohe-accent">
          <span className="font-serif italic text-[22px]">OHé</span>
          <span className="ohe-caption opacity-75">Diagnostic</span>
        </div>

        <div>
          <div className="ohe-eyebrow text-ohe-accent">✱ Test terminé · placeholder</div>
          <h1 className="mt-4 text-[52px] leading-[1.05] tracking-[-0.022em] text-balance">
            Votre relevé est prêt.<br />
            <span className="font-serif italic text-ohe-accent">
              Où l&apos;envoyons-nous ?
            </span>
          </h1>
          <p className="mt-4 text-ohe-muted text-pretty">
            Cette page est un placeholder. Le vrai formulaire de capture lead
            sera créé dans la sous-étape 3.4.
          </p>
        </div>

        {payload ? (
          <div className="space-y-4">
            <div className="ohe-caption text-ohe-muted">
              Données collectées ({payload.answers.length} réponses · {Math.round(payload.durationMs / 1000)}s)
            </div>
            <pre className="bg-ohe-panel-tint border border-ohe-line rounded-lg p-6 text-xs overflow-auto">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        ) : (
          <p className="text-sm text-ohe-muted italic">
            Aucune donnée trouvée. Lance le test depuis{" "}
            <code className="bg-ohe-panel-tint px-2 py-1 rounded text-ohe-ink">
              /{campaignSlug}
            </code>
            .
          </p>
        )}
      </div>
    </main>
  );
}
