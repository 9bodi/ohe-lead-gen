"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTest } from "@/hooks/useTest";
import { ProgressDots, TimerRing, QuestionCard } from "@/components/ui";
import { TOTAL_QUESTIONS } from "@/lib/questions";

interface TestClientProps {
  campaignSlug: string;
}

export function TestClient({ campaignSlug }: TestClientProps) {
  const router = useRouter();
  const test = useTest();

  // Quand le test est terminé, on stocke les réponses en sessionStorage
  // et on redirige vers le formulaire (sera créé dans la sous-étape 3.4)
  useEffect(() => {
    if (test.status === "completed") {
      const payload = {
        answers: test.answers,
        durationMs: Date.now() - test.startedAt,
      };
      sessionStorage.setItem(`test:${campaignSlug}`, JSON.stringify(payload));
      router.push(`/${campaignSlug}/form`);
    }
  }, [test.status, test.answers, test.startedAt, campaignSlug, router]);

  // Pendant la transition vers /form, on évite un flash visuel
  if (test.status === "completed") {
    return (
      <main className="min-h-screen grid place-items-center bg-ohe-bg">
        <div className="text-center">
          <div className="ohe-eyebrow text-ohe-accent mb-4">✱ Test terminé</div>
          <p className="text-ohe-muted text-sm">Préparation de votre relevé...</p>
        </div>
      </main>
    );
  }

  const currentNumber = test.currentIndex + 1;

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-[380px_1fr] bg-ohe-bg text-ohe-ink">
      {/* === Sidebar === */}
      <aside className="bg-ohe-panel-tint border-r border-ohe-line px-9 py-9 flex flex-col">
        {/* Logo */}
        <div className="flex items-baseline gap-4 text-ohe-accent">
          <span className="font-serif italic text-[22px]">OHé</span>
          <span className="ohe-caption opacity-75">Diagnostic</span>
        </div>

        {/* Progression — gros chiffre */}
        <div className="mt-12">
          <div className="ohe-eyebrow text-ohe-accent">✱ Progression</div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span
              className="font-serif italic text-ohe-accent"
              style={{
                fontSize: 64,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {String(currentNumber).padStart(2, "0")}
            </span>
            <span className="text-ohe-muted text-[22px]">/ {TOTAL_QUESTIONS}</span>
          </div>
          <div className="mt-4">
            <ProgressDots total={TOTAL_QUESTIONS} current={test.currentIndex} />
          </div>
        </div>

        {/* Catégorie */}
        <div className="mt-10 pt-7 border-t border-ohe-line">
          <div className="ohe-eyebrow text-ohe-muted">Catégorie</div>
          <div className="mt-2.5 text-[18px] leading-[1.3]">
            {test.currentQuestion.category}
          </div>
        </div>

        {/* Meta info en bas */}
        <div className="mt-auto flex flex-col gap-4 text-xs text-ohe-muted">
          <div className="flex justify-between">
            <span>Mode</span>
            <span className="text-ohe-ink">Chronométré · 5 min</span>
          </div>
          <div className="flex justify-between">
            <span>Retour en arrière</span>
            <span className="text-ohe-ink">Désactivé</span>
          </div>
          <div className="flex justify-between">
            <span>Validation</span>
            <span className="text-ohe-ink">Auto au clic</span>
          </div>
        </div>
      </aside>

      {/* === Main : question === */}
      <section className="px-16 py-10 flex flex-col relative">
        {/* Timer ring top right */}
        <div className="absolute top-9 right-14">
          <TimerRing
            secondsRemaining={test.secondsRemaining}
            totalSeconds={test.totalSeconds}
          />
        </div>

        {/* Espace pour ne pas chevaucher le timer */}
        <div className="mt-6 flex-1 flex flex-col">
          <QuestionCard
            key={test.currentQuestion.id}
            question={test.currentQuestion}
            onAnswer={test.answerAndNext}
          />
        </div>

        {/* Footer */}
        <div
          className="mt-7 pt-5 border-t border-ohe-line flex items-center justify-between"
          style={{ maxWidth: 720 }}
        >
          <div className="text-xs text-ohe-muted max-w-[380px]">
            Validation auto au clic. Vos premières intuitions sont les meilleures.
          </div>
        </div>
      </section>
    </main>
  );
}
