"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTest } from "@/hooks/useTest";
import {
  ProgressDots,
  TimerRing,
  QuestionCard,
  DeclarativeCard,
} from "@/components/ui";
import {
  PROCEDURAL_COUNT,
  PROCEDURAL_PROMPT,
  PROCEDURAL_SECONDS_PER_QUESTION,
  DECLARATIVE_COUNT,
} from "@/lib/questions";

export function TestClient() {
  const router = useRouter();
  const test = useTest();

  // Transition entre Bloc 1 et Bloc 2 — 2 sec auto
  useEffect(() => {
    if (test.phase === "transition") {
      const t = setTimeout(() => {
        test.finishTransition();
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [test.phase, test]);

  // Test terminé → capture email
  useEffect(() => {
    if (test.phase === "completed") {
      const payload = {
        answers: test.answers,
        durationMs: Date.now() - test.startedAt,
      };
      sessionStorage.setItem("test:payload", JSON.stringify(payload));
      router.push("/test/capture");
    }
  }, [test.phase, test.answers, test.startedAt, router]);

  // === Phase "loading" — court écran le temps que les questions soient mélangées ===
  if (test.phase === "loading") {
    return (
      <main className="min-h-screen grid place-items-center bg-ohe-bg text-ohe-ink">
        <div className="text-center">
          <div className="ohe-eyebrow text-ohe-accent mb-4">✱ Préparation</div>
          <p className="text-ohe-muted text-sm">Chargement du diagnostic...</p>
        </div>
      </main>
    );
  }

  // === Transition entre Bloc 1 et Bloc 2 ===
  if (test.phase === "transition") {
    return (
      <main className="min-h-screen grid place-items-center bg-ohe-bg text-ohe-ink">
        <div className="text-center max-w-md">
          <div className="ohe-eyebrow text-ohe-accent mb-6">✱ Partie 2 sur 2</div>
          <h2 className="text-[44px] leading-[1.05] tracking-[-0.02em] font-normal text-balance">
            Maintenant,{" "}
            <span className="font-serif italic text-ohe-accent">la conjugaison</span>.
          </h2>
          <p className="mt-4 text-ohe-muted text-sm">
            Même format, 8 questions, 10 secondes par question.
          </p>
        </div>
      </main>
    );
  }

  // === Test completed pendant la redirection ===
  if (test.phase === "completed") {
    return (
      <main className="min-h-screen grid place-items-center bg-ohe-bg text-ohe-ink">
        <div className="text-center">
          <div className="ohe-eyebrow text-ohe-accent mb-4">✱ Test terminé</div>
          <p className="text-ohe-muted text-sm">Préparation de votre résultat...</p>
        </div>
      </main>
    );
  }

  // === Écran de question (procédural OU déclaratif) ===
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-[380px_1fr] bg-ohe-bg text-ohe-ink">
      {/* Sidebar */}
      <aside className="bg-ohe-panel-tint border-r border-ohe-line px-9 py-9 flex flex-col">
        <div className="flex items-baseline gap-4 text-ohe-accent">
          <span className="font-serif italic text-[22px]">OHé</span>
          <span className="ohe-caption opacity-75">Diagnostic</span>
        </div>
        <SidebarInfo test={test} />
      </aside>

      {/* Main */}
      <section className="px-16 py-10 flex flex-col relative">
        {test.current.kind === "procedural" && (
          <div className="absolute top-9 right-14">
            <TimerRing
              secondsRemaining={test.current.secondsLeft}
              totalSeconds={PROCEDURAL_SECONDS_PER_QUESTION}
            />
          </div>
        )}

        <CurrentEyebrow test={test} />

        <div className="mt-10 flex-1 flex flex-col">
          {test.current.kind === "procedural" && (
            <QuestionCard
              key={test.current.question.id}
              question={test.current.question}
              prompt={PROCEDURAL_PROMPT}
              onAnswer={test.answerProcedural}
            />
          )}
          {test.current.kind === "declarative" && (
            <DeclarativeCard
              key={test.current.question.id}
              question={test.current.question}
              onAnswer={test.answerDeclarative}
            />
          )}
        </div>
      </section>
    </main>
  );
}

function SidebarInfo({ test }: { test: ReturnType<typeof useTest> }) {
  if (test.current.kind === "procedural") {
    const num = test.proceduralIndex + 1;
    const blockLabel =
      test.phase === "block1"
        ? "Bloc 1 — Accords"
        : "Bloc 2 — Conjugaison";

    return (
      <>
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
              {String(num).padStart(2, "0")}
            </span>
            <span className="text-ohe-muted text-[22px]">
              / {PROCEDURAL_COUNT}
            </span>
          </div>
          <div className="mt-4">
            <ProgressDots
              total={PROCEDURAL_COUNT}
              current={test.proceduralIndex}
            />
          </div>
        </div>

        <div className="mt-10 pt-7 border-t border-ohe-line">
          <div className="ohe-eyebrow text-ohe-muted">Section</div>
          <div className="mt-2.5 text-[18px] leading-[1.3]">{blockLabel}</div>
        </div>
      </>
    );
  }

  if (test.current.kind === "declarative") {
    const num = test.declarativeIndex + 1;
    return (
      <>
        <div className="mt-12">
          <div className="ohe-eyebrow text-ohe-accent">✱ Profil</div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span
              className="font-serif italic text-ohe-accent"
              style={{
                fontSize: 64,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {String(num).padStart(2, "0")}
            </span>
            <span className="text-ohe-muted text-[22px]">
              / {DECLARATIVE_COUNT}
            </span>
          </div>
        </div>

        <div className="mt-10 pt-7 border-t border-ohe-line">
          <div className="ohe-eyebrow text-ohe-muted">Section</div>
          <div className="mt-2.5 text-[18px] leading-[1.3]">
            Quelques précisions
          </div>
          <div className="mt-2 text-[13px] text-ohe-muted">
            Pas de chrono · prenez votre temps.
          </div>
        </div>
      </>
    );
  }

  return null;
}

function CurrentEyebrow({ test }: { test: ReturnType<typeof useTest> }) {
  if (test.current.kind === "procedural") {
    const label =
      test.phase === "block1"
        ? "Accords des mots"
        : "Conjugaison";
    return (
      <div className="ohe-eyebrow text-ohe-accent inline-flex items-center gap-3 mt-6">
        <span className="opacity-65">✱</span>
        <span style={{ letterSpacing: "0.32em", textTransform: "uppercase" }}>
          {label}
        </span>
      </div>
    );
  }
  if (test.current.kind === "declarative") {
    return (
      <div className="ohe-eyebrow text-ohe-accent inline-flex items-center gap-3 mt-6">
        <span className="opacity-65">✱</span>
        <span>Votre profil</span>
      </div>
    );
  }
  return null;
}
