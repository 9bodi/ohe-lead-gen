"use client";

import { useEffect, useState } from "react";

type TestPayload = {
  answers: Array<{
    questionId: string;
    answer: string | null;
    isCorrect: boolean | null;
    answeredInMs: number;
  }>;
  durationMs: number;
};

export default function CapturePagePlaceholder() {
  const [payload, setPayload] = useState<TestPayload | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("test:payload");
    if (raw) {
      try {
        setPayload(JSON.parse(raw));
      } catch {
        setPayload(null);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-ohe-bg text-ohe-ink px-14 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-baseline gap-4 text-ohe-accent">
          <span className="font-serif italic text-[22px]">OHé</span>
          <span className="ohe-caption opacity-75">Diagnostic</span>
        </div>

        <div>
          <div className="ohe-eyebrow text-ohe-accent">✱ Test terminé · placeholder</div>
          <h1 className="mt-4 text-[52px] leading-[1.05] tracking-[-0.022em] text-balance">
            Test terminé.<br />
            <span className="font-serif italic text-ohe-accent">
              Capture email à venir en C.5.
            </span>
          </h1>
        </div>

        {payload && (
          <div className="space-y-3">
            <div className="ohe-caption text-ohe-muted">
              {payload.answers.length} réponses · {Math.round(payload.durationMs / 1000)}s
            </div>
            <pre className="bg-ohe-panel-tint border border-ohe-line rounded-lg p-6 text-xs overflow-auto">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
